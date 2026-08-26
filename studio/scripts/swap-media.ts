/**
 * Repoints instructor photos and lesson thumbnails at Lorem Picsum.
 *
 * The first seed import pulled instructor photos from randomuser.me and lesson
 * thumbnails from i.ytimg.com. Both are replaced with deterministic, seeded
 * Lorem Picsum URLs so a re-run reproduces the same images. Course cover images
 * already use Lorem Picsum and are left alone.
 *
 * Offline tooling. Never runs in the request path.
 *
 *   cd studio && npx sanity exec scripts/swap-media.ts --with-user-token
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-08-26'})

type Target = {
  _id: string
  slug: string
  field: 'photo' | 'thumbnail'
  alt: string
  url: string
}

/** Deterministic so a re-run yields the same image for the same document. */
function picsum(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

async function collectTargets(): Promise<Target[]> {
  const instructors = await client.fetch<{_id: string; slug: string; name: string}[]>(
    `*[_type == "instructor" && defined(slug.current)]{_id, "slug": slug.current, name}`,
  )
  const lessons = await client.fetch<{_id: string; slug: string; title: string}[]>(
    `*[_type == "lesson" && defined(slug.current)]{_id, "slug": slug.current, title}`,
  )

  return [
    ...instructors.map((doc): Target => ({
      _id: doc._id,
      slug: doc.slug,
      field: 'photo',
      alt: `Portrait of ${doc.name}`,
      url: picsum(`vertex-instructor-${doc.slug}`, 800, 800),
    })),
    ...lessons.map((doc): Target => ({
      _id: doc._id,
      slug: doc.slug,
      field: 'thumbnail',
      alt: `Video thumbnail for ${doc.title}`,
      url: picsum(`vertex-lesson-${doc.slug}`, 1280, 720),
    })),
  ]
}

async function uploadFromUrl(url: string, filename: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`)
  }
  const body = Buffer.from(await response.arrayBuffer())
  return client.assets.upload('image', body, {filename})
}

async function main() {
  const targets = await collectTargets()
  console.log(`Repointing ${targets.length} images at Lorem Picsum.`)

  let done = 0
  let failed = 0

  for (const target of targets) {
    try {
      const asset = await uploadFromUrl(target.url, `${target.slug}.jpg`)
      await client
        .patch(target._id)
        .set({
          [target.field]: {
            _type: 'image',
            asset: {_type: 'reference', _ref: asset._id},
            alt: target.alt,
          },
        })
        .commit()
      done += 1
      console.log(`  ${done}/${targets.length} ${target._id}`)
    } catch (error) {
      failed += 1
      console.error(`  FAILED ${target._id}: ${(error as Error).message}`)
    }
  }

  console.log(`\nDone. ${done} patched, ${failed} failed.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
