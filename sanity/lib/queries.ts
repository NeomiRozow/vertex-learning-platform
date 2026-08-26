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
  *[_type == "course" && defined(slug.current)] | order(isPopular desc, title asc) {
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
    isPopular,
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
    isPopular,
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
        isFreePreview
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
    poster {
      "asset": asset->{_id, url, metadata{lqip, dimensions{width, height}}},
      hotspot,
      crop,
      alt
    },
    duration,
    isFreePreview,
    studentCount,
    notes,
    keyPoints[] {_key, text},
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
    "courses": *[_type == "course" && references(^._id)] | order(isPopular desc, title asc) {
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
      isPopular,
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
