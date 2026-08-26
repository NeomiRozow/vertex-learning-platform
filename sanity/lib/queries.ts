import {defineQuery} from 'next-sanity'

/**
 * Every read the catalog, course, lesson, and instructor pages need.
 *
 * Rules held to here:
 * - Explicit projections only. No `...` spreads, so nothing unintended ships.
 * - Every array projection carries `_key` for React keys and Visual Editing.
 * - Module and lesson numbers are never stored; the frontend derives them from
 *   array order.
 * - A lesson has no parent-course field. The course is found by reverse
 *   reference from the lesson's `_id`.
 */

/** Catalog grid. */
export const COURSES_CATALOG_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(popular desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    },
    level,
    price,
    popular,
    studentCount,
    instructor->{
      _id,
      name,
      "slug": slug.current,
      photo {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    }
    },
    category->{_id, title, "slug": slug.current},
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]),
    "totalDuration": math::sum(modules[].lessons[]->duration)
  }
`)

/** Course detail page. */
export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    },
    level,
    price,
    popular,
    studentCount,
    learningOutcomes[] {
      _key,
      icon,
      title,
      description
    },
    instructor->{
      _id,
      name,
      "slug": slug.current,
      photo {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    },
      expertise
    },
    category->{_id, title, "slug": slug.current},
    modules[] {
      _key,
      title,
      summary,
      lessons[]-> {
        _id,
        title,
        "slug": slug.current,
        summary,
        duration,
        freePreview
      }
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]),
    "totalDuration": math::sum(modules[].lessons[]->duration)
  }
`)

/** Lesson page. The parent course comes from a reverse reference. */
export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    videoUrl,
    thumbnail {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    },
    duration,
    freePreview,
    studentCount,
    notes,
    keyPoints,
    proTip,
    resources[] {
      _key,
      type,
      title,
      description,
      url
    },
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      "slug": slug.current,
      coverImage {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    },
      level,
      instructor->{
      _id,
      name,
      "slug": slug.current,
      photo {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    }
    },
      modules[] {
        _key,
        title,
        lessons[]-> {
          _id,
          title,
          "slug": slug.current,
          duration
        }
      }
    }
  }
`)

/** Instructor page. */
export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    photo {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    },
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)] | order(popular desc, title asc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      coverImage {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    },
      level,
      price,
      popular,
      studentCount,
      "lessonCount": count(modules[].lessons[])
    }
  }
`)

/** Catalog filter bar. */
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`)

/**
 * Video intelligence lookup for search. Internal only: a video is never a
 * result on its own, it is surfaced through the lesson that uses it.
 *
 * Chapters carry clean authored labels, so they are matched first. Chunks are
 * the noisier backstop and are FILTERED HERE, never projected wholesale — the
 * full array would overflow the model's context window.
 *
 * `$pattern` must be a wildcarded, token-based match built by the caller, for
 * example "*caching*". Never pass a whole phrase as one pattern.
 */
export const VIDEO_MATCHES_QUERY = defineQuery(`
  *[_type == "video" && url in $urls] {
    videoId,
    url,
    provider,
    durationSeconds,
    "chapterMatches": chapters[label match $pattern][0...5] {
      startSeconds,
      label
    },
    "chunkMatches": chunks[text match $pattern][0...3] {
      startSeconds,
      text
    }
  }
`)

// --- generateStaticParams ---

export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)]{"slug": slug.current}
`)

export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)]{"slug": slug.current}
`)

export const INSTRUCTOR_SLUGS_QUERY = defineQuery(`
  *[_type == "instructor" && defined(slug.current)]{"slug": slug.current}
`)
