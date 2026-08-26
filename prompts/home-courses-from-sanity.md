# Implementation Prompt — Home Page Courses from Sanity

## Goal
Replace the hardcoded `courses` array in `app/page.tsx` with a read of the seeded Sanity content. Presentation stays exactly as it is today; only the data source changes.

## Code inspected
- `app/page.tsx` — `HomeCourse[]` const with three placeholder courses and inline brand marks.
- `sanity/lib/queries.ts` — `COURSES_CATALOG_QUERY` already projects title, slug, summary, coverImage, level, popular, studentCount, instructor, category, `moduleCount`, `lessonCount`, `totalDuration`, ordered `popular desc, title asc`.
- `sanity.types.ts` — `COURSES_CATALOG_QUERY_RESULT` generated; the query TypeMap types `sanityFetch` without a cast.
- `components/ui/card.tsx` — `CourseCard` `stacked` variant takes `icon` as a `ReactNode` for the 64px tile.
- `lib/format.ts` — `formatDuration`, `formatLevel` from the course-page work.

## Decisions and assumptions
- D1: The home page becomes an async server component and reads with `sanityFetch({query: COURSES_CATALOG_QUERY, tags: ['course']})`.
- D2: It shows the first three of the ordered result, matching the reference's three cards. "View all courses" still points at `/courses`.
- D3: The 64px tile renders the course's Sanity `coverImage` through `urlFor` and `next/image`, replacing the hand-drawn brand marks. The seeded covers are photos, so the reference's `N` / Docker / `TS` marks no longer apply — the design tile is a stand-in for whatever the cover is. A course with no cover falls back to `CourseCard`'s title initial.
- D4: `components/home/course-marks.tsx` is left in place, unused by this page. Deleting it is cleanup and out of scope.
- D5: Level and duration are formatted with `lib/format.ts`; module count comes from the query aggregate, never a stored field.
- D6: Empty result renders the section heading with no grid, not an error.

## Files to touch
- `app/page.tsx`

## Security considerations
- The read goes through `sanity/lib/fetch.ts` (`server-only`); no token reaches the browser. No new env var.

## Acceptance criteria
1. The three cards show seeded courses with their real titles, summaries, levels, durations, and module counts.
2. Card links resolve to working `/courses/<slug>` pages.
3. No hardcoded course copy remains in `app/page.tsx`.

## Checks to run
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, and load `/` in dev.
