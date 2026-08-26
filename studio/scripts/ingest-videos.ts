/**
 * Builds one `video` document per unique lesson video URL.
 *
 * Offline tooling. Never runs in the request path, and never returns a whole
 * transcript to anything: it writes many short timestamped chunks instead.
 *
 *   cd studio
 *   npx sanity exec scripts/ingest-videos.ts --with-user-token
 *   npx sanity exec scripts/ingest-videos.ts --with-user-token -- --limit 1
 *   npx sanity exec scripts/ingest-videos.ts --with-user-token -- --only 9602Yzvd7ik
 *
 * Why yt-dlp and not fetch: YouTube gates the `timedtext` endpoint behind a
 * proof-of-origin token. A plain fetch of a caption track's baseUrl returns
 * HTTP 200 with an empty body, and the InnerTube player endpoint rejects
 * unbound clients. yt-dlp handles that; nothing simpler does.
 */
import {execFile} from 'node:child_process'
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises'
import {existsSync} from 'node:fs'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {promisify} from 'node:util'
import {getCliClient} from 'sanity/cli'

const execFileAsync = promisify(execFile)

const client = getCliClient({apiVersion: '2026-08-26'})

const SEED_VIDEOS = fileURLToPath(new URL('./seed/videos.json', import.meta.url))
/** Raw yt-dlp output, gitignored, so a re-run resumes instead of refetching. */
const CACHE_DIR = fileURLToPath(new URL('./.video-cache/', import.meta.url))

/** Chunking targets. Small enough that a filtered match returns little text. */
const CHUNK_MIN_SECONDS = 8
const CHUNK_MAX_SECONDS = 20
const CHUNK_MAX_WORDS = 40

/**
 * Below this, an uploader's chapter list is not a usable table of contents —
 * one chapter covering a 17-minute video tells search nothing — so the lesson's
 * key points are the better ToC.
 */
const MIN_USABLE_CHAPTERS = 3

type SeedVideo = {
  id: string
  title: string
  channel: string
  duration: number
  query: string
}

type Lesson = {
  _id: string
  slug: string
  title: string
  duration: number
  videoUrl: string
  keyPoints: string[] | null
}

/**
 * Sanity rejects a document id whose path element starts with a hyphen, and
 * YouTube ids may (e.g. `-QVoIxEpFkM`). Prefixing with `x` makes it legal and
 * keeps it deterministic: the result is 12 characters, so it cannot collide
 * with an unprefixed 11-character id. The true id always lives in `videoId`.
 */
function documentIdFor(videoId: string): string {
  return `video.${videoId.startsWith('-') ? `x${videoId}` : videoId}`
}

type Chapter = {startSeconds: number; label: string}
type Chunk = {startSeconds: number; text: string}

type CaptionEvent = {tStartMs: number; segs?: {utf8?: string}[]}

// --- yt-dlp ---------------------------------------------------------------

/**
 * This Python has no CA bundle wired up, so yt-dlp dies with
 * CERTIFICATE_VERIFY_FAILED unless SSL_CERT_FILE points at certifi's bundle.
 * The console script also lands outside PATH, hence `python3 -m yt_dlp`.
 */
let cachedCertPath: string | undefined

async function certPath(): Promise<string> {
  if (cachedCertPath === undefined) {
    const {stdout} = await execFileAsync('python3', ['-c', 'import certifi;print(certifi.where())'])
    cachedCertPath = stdout.trim()
  }
  return cachedCertPath
}

async function ytDlp(args: string[], cwd?: string) {
  return execFileAsync('python3', ['-m', 'yt_dlp', ...args], {
    cwd,
    maxBuffer: 64 * 1024 * 1024,
    env: {...process.env, SSL_CERT_FILE: await certPath()},
  })
}

/** Video metadata, including uploader chapters. Cached per video id. */
async function fetchMetadata(videoId: string): Promise<Record<string, unknown>> {
  const cacheFile = join(CACHE_DIR, `${videoId}.info.json`)
  if (existsSync(cacheFile)) {
    return JSON.parse(await readFile(cacheFile, 'utf8'))
  }
  const {stdout} = await ytDlp([
    '--skip-download',
    '--dump-json',
    '--no-warnings',
    `https://www.youtube.com/watch?v=${videoId}`,
  ])
  await writeFile(cacheFile, stdout)
  return JSON.parse(stdout)
}

/**
 * Caption events, preferring manual captions over auto-generated ones.
 * Returns null when the video has no usable English captions.
 *
 * Provenance comes from the metadata, not from the filenames: yt-dlp writes
 * both `<id>.en.json3` and `<id>.en-orig.json3` for auto-only videos, so
 * counting files reports auto captions as manual. `subtitles` holds only real
 * uploader-provided tracks; `automatic_captions` holds the machine ones.
 */
async function fetchCaptions(
  videoId: string,
  metadata: Record<string, unknown>,
): Promise<{events: CaptionEvent[]; kind: 'manual' | 'auto'} | null> {
  const manualLangs = Object.keys(
    (metadata.subtitles as Record<string, unknown> | undefined) ?? {},
  ).filter((lang) => lang.toLowerCase().startsWith('en'))
  const videoCache = join(CACHE_DIR, videoId)
  await mkdir(videoCache, {recursive: true})

  let files = await readdir(videoCache)
  if (files.length === 0) {
    try {
      await ytDlp(
        [
          '--skip-download',
          '--write-subs',
          '--write-auto-subs',
          '--sub-langs',
          'en.*',
          '--sub-format',
          'json3',
          '--no-warnings',
          '-o',
          '%(id)s.%(ext)s',
          `https://www.youtube.com/watch?v=${videoId}`,
        ],
        videoCache,
      )
    } catch (error) {
      console.error(`    caption fetch failed: ${(error as Error).message.split('\n')[0]}`)
    }
    files = await readdir(videoCache)
  }

  const json3 = files.filter((name) => name.endsWith('.json3'))
  if (json3.length === 0) return null

  const kind: 'manual' | 'auto' = manualLangs.length > 0 ? 'manual' : 'auto'
  const chosen =
    manualLangs.map((lang) => `${videoId}.${lang}.json3`).find((name) => json3.includes(name)) ??
    json3.find((name) => !name.includes('-orig.')) ??
    json3[0]
  const parsed = JSON.parse(await readFile(join(videoCache, chosen), 'utf8'))
  const events: CaptionEvent[] = (parsed.events ?? []).filter(
    (event: CaptionEvent) => Array.isArray(event.segs) && typeof event.tStartMs === 'number',
  )
  if (events.length === 0) return null

  return {events, kind}
}

// --- shaping --------------------------------------------------------------

function cleanCaptionText(events: CaptionEvent[]): {startSeconds: number; text: string}[] {
  return events
    .map((event) => ({
      startSeconds: Math.floor(event.tStartMs / 1000),
      text: (event.segs ?? [])
        .map((seg) => seg.utf8 ?? '')
        .join('')
        .replace(/\s+/g, ' ')
        .trim(),
    }))
    .filter((event) => event.text.length > 0)
}

/**
 * Groups caption events into chunks that are long enough to carry meaning and
 * short enough that a filtered query returns little text.
 */
function buildChunks(events: CaptionEvent[], maxSeconds: number): Chunk[] {
  const cleaned = cleanCaptionText(events)
  const chunks: Chunk[] = []

  let startSeconds = cleaned[0]?.startSeconds ?? 0
  let words: string[] = []

  const flush = (endSeconds: number) => {
    if (words.length === 0) return
    chunks.push({
      startSeconds: Math.min(startSeconds, maxSeconds),
      text: words.join(' ').replace(/\s+/g, ' ').trim(),
    })
    words = []
    startSeconds = endSeconds
  }

  for (const event of cleaned) {
    if (words.length === 0) startSeconds = event.startSeconds
    words.push(...event.text.split(' '))

    const elapsed = event.startSeconds - startSeconds
    const longEnough = elapsed >= CHUNK_MIN_SECONDS
    const tooLong = elapsed >= CHUNK_MAX_SECONDS || words.length >= CHUNK_MAX_WORDS
    if (longEnough && tooLong) flush(event.startSeconds)
  }
  flush(startSeconds)

  return chunks.filter((chunk) => chunk.text.length > 0)
}

/** Splits a lesson's key points evenly across the runtime as a fallback ToC. */
function chaptersFromKeyPoints(keyPoints: string[], duration: number): Chapter[] {
  const step = Math.max(1, Math.floor(duration / (keyPoints.length + 1)))
  return keyPoints.map((label, index) => ({
    startSeconds: Math.min(step * (index + 1), duration),
    label,
  }))
}

function chaptersFromUploader(raw: unknown, duration: number): Chapter[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((entry) => {
      const chapter = entry as {start_time?: number; title?: string}
      if (typeof chapter.start_time !== 'number' || !chapter.title) return null
      return {
        startSeconds: Math.min(Math.floor(chapter.start_time), duration),
        label: String(chapter.title).trim(),
      }
    })
    .filter((chapter): chapter is Chapter => chapter !== null && chapter.label.length > 0)
}

/** Timestamps must be strictly increasing and inside the seeded duration. */
function normaliseTimeline<T extends {startSeconds: number}>(entries: T[], duration: number): T[] {
  const sorted = [...entries].sort((a, b) => a.startSeconds - b.startSeconds)
  const result: T[] = []
  let previous = -1
  for (const entry of sorted) {
    const startSeconds = Math.min(Math.max(entry.startSeconds, 0), duration)
    if (startSeconds <= previous) continue
    previous = startSeconds
    result.push({...entry, startSeconds})
  }
  return result
}

// --- main -----------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2)
  const read = (flag: string) => {
    const index = args.indexOf(flag)
    return index === -1 ? undefined : args[index + 1]
  }
  const limit = read('--limit')
  return {limit: limit ? Number(limit) : undefined, only: read('--only')}
}

async function main() {
  const {limit, only} = parseArgs()
  await mkdir(CACHE_DIR, {recursive: true})

  const seed: Record<string, SeedVideo> = JSON.parse(await readFile(SEED_VIDEOS, 'utf8'))
  const lessons = await client.fetch<Lesson[]>(
    `*[_type == "lesson" && defined(videoUrl)]{
      _id, "slug": slug.current, title, duration, videoUrl, keyPoints
    }`,
  )
  const lessonBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]))

  let entries = Object.entries(seed)
  if (only) entries = entries.filter(([, value]) => value.id === only)
  if (limit) entries = entries.slice(0, limit)

  console.log(`Ingesting ${entries.length} video(s).\n`)

  const tally = {manual: 0, auto: 0, authored: 0, uploader: 0, keyPoints: 0, failed: 0}

  for (const [slug, entry] of entries) {
    const lesson = lessonBySlug.get(slug)
    if (!lesson) {
      console.error(`SKIP ${entry.id} — no lesson with slug "${slug}"`)
      tally.failed += 1
      continue
    }

    // The seeded lesson duration is authoritative; yt-dlp differs by a second
    // on some videos and every timestamp must stay inside the lesson.
    const duration = lesson.duration

    try {
      const metadata = await fetchMetadata(entry.id)
      const captions = await fetchCaptions(entry.id, metadata)

      let chunks: Chunk[]
      let transcriptSource: 'manual' | 'auto' | 'authored'
      if (captions) {
        chunks = buildChunks(captions.events, duration)
        transcriptSource = captions.kind
      } else {
        chunks = []
        transcriptSource = 'authored'
      }

      let chapters = chaptersFromUploader(metadata.chapters, duration)
      let chaptersSource: 'uploader' | 'keyPoints' = 'uploader'
      if (chapters.length < MIN_USABLE_CHAPTERS) {
        chapters = chaptersFromKeyPoints(lesson.keyPoints ?? [], duration)
        chaptersSource = 'keyPoints'
      }

      chapters = normaliseTimeline(chapters, duration)
      chunks = normaliseTimeline(chunks, duration)

      if (chapters.length === 0 || chunks.length === 0) {
        console.error(
          `SKIP ${entry.id} — ${chapters.length} chapters, ${chunks.length} chunks (need both)`,
        )
        tally.failed += 1
        continue
      }

      await client.createOrReplace({
        _id: documentIdFor(entry.id),
        _type: 'video',
        videoId: entry.id,
        url: lesson.videoUrl,
        provider: 'youtube',
        title: entry.title,
        durationSeconds: duration,
        transcriptSource,
        chaptersSource,
        chapters: chapters.map((chapter, index) => ({
          _key: `chapter-${index}`,
          _type: 'videoChapter',
          ...chapter,
        })),
        chunks: chunks.map((chunk, index) => ({
          _key: `chunk-${index}`,
          _type: 'videoChunk',
          ...chunk,
        })),
      })

      tally[transcriptSource] += 1
      tally[chaptersSource] += 1
      console.log(
        `OK   ${entry.id}  ${chapters.length} chapters (${chaptersSource}), ` +
          `${chunks.length} chunks (${transcriptSource})  — ${lesson.title}`,
      )
    } catch (error) {
      tally.failed += 1
      console.error(`FAIL ${entry.id}: ${(error as Error).message.split('\n')[0]}`)
    }
  }

  console.log(
    `\nTranscripts: ${tally.manual} manual, ${tally.auto} auto, ${tally.authored} authored.\n` +
      `Chapters: ${tally.uploader} uploader, ${tally.keyPoints} from key points.\n` +
      `Failed: ${tally.failed}.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
