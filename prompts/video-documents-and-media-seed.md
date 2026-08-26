# Video documents, provider validation, and Lorem Picsum media

## Goal

Give every seeded lesson a video document so timestamp-level search has real
data to match, restrict `lesson.videoUrl` to the three supported providers, and
move instructor photos and lesson thumbnails to Lorem Picsum.

## What I read

- `AGENTS.md` sections 5, 7, 8, 9, 11, 12, 13.
- `studio/schemaTypes/documents/lesson.ts`, `studio/schemaTypes/index.ts`
- `studio/scripts/seed/videos.json`, `studio/scripts/seed/seed.ndjson`
- `sanity/lib/queries.ts`, `sanity.types.ts`
- `prompts/sanity-content-model.md`, `prompts/align-schema-with-seed.md`

## What I verified in the data

- `videos.json` holds 120 entries, 120 unique YouTube ids, all 11-char
  `[A-Za-z0-9_-]`.
- Every `videos.json` key matches a seeded lesson slug. Zero missing.
- Every entry's `id` matches that lesson's `videoUrl`
  (`https://www.youtube.com/watch?v=<id>`). Zero mismatches.
- Every entry's `duration` matches that lesson's `duration`. Zero mismatches.
- So the video-to-lesson mapping needs no reconciliation. One video document per
  lesson, 120 total, and the one-per-unique-URL rule holds trivially.
- Current asset hosts in the seed: 10 `picsum.photos` (course covers),
  5 `randomuser.me` (instructor photos), 120 `i.ytimg.com` (lesson thumbnails).
- `lesson.videoUrl` validation today is `rule.required().uri({scheme:
  ['http','https']})`. It does not restrict the provider.
- No ingestion tooling exists: no `yt-dlp` on PATH, no transcript package in any
  `package.json`, no scripts beyond the seed directory.

## Transcript strategy — decided and verified

**T1, real YouTube captions via yt-dlp (option A1), with chapters falling back to
the lesson's key points.**

I probed this before writing the plan rather than assuming it:

- Plain `fetch` does **not** work. The watch page still exposes a `timedtext`
  `baseUrl`, but fetching it returns **HTTP 200 with 0 bytes** in every format
  (bare, `json3`, `srv3`, `vtt`) with a browser UA and Referer. The InnerTube
  `player` endpoint returns `400 FAILED_PRECONDITION` for the iOS client and
  `UNPLAYABLE / "Video unavailable"` for the WEB client. This is YouTube's
  PoToken gate. Header spoofing does not get past it.
- `yt-dlp` does work. Installed `yt-dlp==2026.08.19` with `pip3 install --user`.
  `--write-auto-subs --write-subs --sub-langs "en.*" --sub-format json3
  --skip-download` returns a real transcript: 299 timed events and 5,109
  characters for `9602Yzvd7ik`, properly punctuated, each event carrying
  `tStartMs`.
- Chapters are better supplied than expected. Sampled 6 videos across 6 different
  courses (`9602Yzvd7ik`, `VBlSe8tvg4U`, `rGPpQdbDbwo`, `0XrviXgk_rY`,
  `gMeTK6zzaO4`, `SnSH8Ht3MIc`). **All 6 had real uploader chapters**, 7 to 22
  each, and all 6 had English captions. The key-points fallback should fire
  rarely, but it stays in the plan for the videos that lack chapters.

Two environment facts the script must handle:

- The `yt-dlp` console script lands in `~/Library/Python/3.12/bin`, which is not
  on PATH. Invoke it as `python3 -m yt_dlp`.
- This Python (python.org 3.12 on macOS) has no CA bundle wired up, so yt-dlp
  fails with `CERTIFICATE_VERIFY_FAILED`. The script must set
  `SSL_CERT_FILE` to `certifi.where()`. `certifi` is installed.

## Files I expect to touch

1. `studio/schemaTypes/documents/video.ts` — new. Fields: `videoId` (string,
   required), `url` (url, required), `provider` (string, list:
   youtube/vimeo/bunny), `source` (string, list: captions/authored),
   `chapters` (array of `videoChapter`), `chunks` (array of `videoChunk`).
   Hidden from the default Studio list per section 7 ("internal lookup").
2. `studio/schemaTypes/objects/video-chapter.ts` — new. `startSeconds` (number,
   required, integer, min 0), `label` (string, required).
3. `studio/schemaTypes/objects/video-chunk.ts` — new. `startSeconds` (number,
   required, integer, min 0), `text` (string, required).
4. `studio/schemaTypes/documents/lesson.ts` — tighten `videoUrl` validation with
   a regex or custom rule accepting only YouTube, Vimeo, and Bunny hosts.
5. `studio/schemaTypes/index.ts` — register the three new types.
6. `studio/structure.ts` — keep video documents out of the authoring surface, or
   put them under a clearly labelled "Internal" group.
7. `studio/scripts/ingest-videos.ts` — new. The offline ingestion tool. Reads
   `videos.json`, shells out to `python3 -m yt_dlp` per video for captions and
   metadata, builds chapters and chunks, and writes `video` documents with a
   write token. Never runs in the request path. Caches raw yt-dlp output to a
   gitignored directory so a re-run does not refetch.
8. `studio/scripts/seed/media.ts` or an inline patch script — remaps instructor
   `photo` and lesson `thumbnail` to Lorem Picsum and re-uploads.
9. `sanity/lib/queries.ts` — add a video lookup projection that returns only
   filtered chapter and chunk matches, never a whole `chunks` array (section 12).
10. `sanity.types.ts` and `studio/schema.json` — regenerated, not hand-edited.

`studio/scripts/seed/seed.ndjson` and `studio/scripts/seed/videos.json` are read
only. Neither is modified.

## Decisions and assumptions

- D1: Video document id is `video.<youtubeId>`. The prefix guarantees a legal
  Sanity id regardless of a leading hyphen in the YouTube id, and the 120 ids are
  already unique so no collision handling is needed.
- D2: `provider` is stored explicitly rather than parsed at read time, so the
  lesson page can pick its embed and seek parameter without re-parsing the URL.
- D3: Lessons link to videos by URL, not by reference (section 7). No schema
  field is added to `lesson`. The search route resolves `video` by matching
  `url == lesson.videoUrl`.
- D4: Lorem Picsum URLs are deterministic and seeded, so a re-import reproduces
  the same images: instructor photos
  `https://picsum.photos/seed/vertex-instructor-<slug>/800/800`, lesson
  thumbnails `https://picsum.photos/seed/vertex-lesson-<slug>/1280/720`. Course
  covers already follow this pattern and stay as they are.
- D5: Existing instructor and lesson image assets are replaced in place by
  patching the documents. The 125 orphaned assets from the first import are left
  alone rather than swept, since asset cleanup is outside this request. I will
  report the count.
- D6: Chunks stay short. Target 8 to 20 seconds of speech per chunk, roughly 25
  to 40 words, so a filtered match returns little text.
- D7: Real uploader chapters are kept in full, however many there are (the
  sample ranged 7 to 22). They are the clean labels section 7 wants and capping
  them would throw away good match targets. Only when a video has no chapters do
  I synthesise a table of contents from the lesson's `keyPoints`, spread evenly
  across the lesson `duration`.
- D9: The seeded `lesson.duration` stays authoritative. yt-dlp durations differ
  by up to 1 second on some videos (e.g. `rGPpQdbDbwo`: 948 seeded vs 947
  reported). Chapter and chunk `startSeconds` are clamped to the seeded duration
  so no timestamp can exceed it.
- D10: When both manual and auto captions exist, prefer manual. Record which was
  used in `source` as `captions` either way, with a separate `captionKind` field
  holding `manual` or `auto` so caption quality is inspectable later.
- D11: Videos where yt-dlp returns no English captions at all get `source:
  'authored'` and chunks derived from the lesson's Portable Text notes, so no
  video document is left without searchable text. The run reports how many.
- D8: The ingestion script is idempotent and re-runnable, using
  `createOrReplace` keyed on the video id.

## Security considerations

- The write token used by the ingestion script is server side only, read from
  env, and never committed. It is added to `.env.example` as a named key with an
  empty value.
- Ingestion runs offline from the command line. Nothing about it enters the
  Next.js request path.
- The read path must never project a whole `chunks` array. The query added to
  `sanity/lib/queries.ts` filters chunks before returning them.
- No client-side change. The browser gains no token and calls no new endpoint.

## Acceptance criteria

- A1: 120 `video` documents exist, one per unique video URL, ids `video.<id>`.
- A2: Every lesson's `videoUrl` resolves to exactly one video document, and every
  video document is referenced by exactly one lesson. No orphans either way.
- A3: Every video document has at least 3 chapters and at least 10 chunks, with
  `startSeconds` strictly increasing and every value inside the lesson's seeded
  `duration`.
- A9: The ingestion run reports, per video, whether chapters came from the
  uploader or the lesson's key points, and whether the transcript came from
  manual captions, auto captions, or the notes fallback. Totals are printed at
  the end.
- A4: Saving a lesson with a non-YouTube/Vimeo/Bunny URL fails validation in
  Studio with a clear message. Saving the existing 120 URLs still passes.
- A5: All 5 instructor photos and all 120 lesson thumbnails resolve to assets
  originating from `picsum.photos`. Zero remaining `randomuser.me` or
  `i.ytimg.com` assets in use.
- A6: A filtered chunk query returns at most a few chunks per video, never the
  full array.
- A7: Video documents do not appear as a top-level authoring type in Studio.
- A8: Web type check, lint, and production build pass. Studio type check passes.

## Checks to run

From `studio/`:
- `npm run typegen`
- `npx tsc --noEmit`
- the ingestion script itself, reporting per-video success and fallback counts

From the repo root:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

Integrity queries after ingestion:
- video count, orphan videos, lessons with no matching video
- chapter and chunk counts per video, min and max
- any `startSeconds` exceeding the lesson `duration`
- asset host distribution across `instructor.photo` and `lesson.thumbnail`

## Manual test steps

1. `cd studio && npm run dev`, open http://localhost:3333.
2. Open any instructor. Confirm the photo is a Lorem Picsum image and renders.
3. Open lesson **File-system routing and the app directory**. Confirm the
   thumbnail is Lorem Picsum.
4. On the same lesson, change `videoUrl` to `https://example.com/x` and confirm
   the validation error. Revert.
5. In Vision, run `*[_type=="video"][0]{videoId, url, provider, source,
   chapters, "chunkCount": count(chunks)}` and confirm the chapters read as a
   sensible table of contents for that lesson's topic.
6. In Vision, run a filtered chunk query for a keyword and confirm it returns a
   handful of chunks with timestamps, not the whole array.
7. `npm run dev` at the root and confirm http://localhost:3000 still renders.
