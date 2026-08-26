# Implementation Prompt — All Courses Page

## Goal
Add the catalog at `/courses`: every seeded course in one grid. There is no reference image for this page, so it reuses the home page's card and section language exactly. Deliberately simple — no filters, no search, no pagination, no progress.

## Code inspected
- `app/page.tsx` — page frame (`hatch`, centered `max-w-[1440px]`, `lg:border-x`, `SiteHeader`), the catalog section markup, and the Sanity read it now does.
- `sanity/lib/queries.ts` — `COURSES_CATALOG_QUERY` already returns every course ordered `popular desc, title asc` with the fields a card needs.
- `components/ui/card.tsx` — `CourseCard` `stacked` variant.
- `lib/format.ts`, `sanity/lib/image.ts`, `sanity/lib/fetch.ts`.

## Decisions and assumptions
- D1: `app/courses/page.tsx`, an async server component reading `COURSES_CATALOG_QUERY` with `tags: ['course']`. Same read the home page makes, unsliced.
- D2: Layout mirrors the home catalog section: breadcrumb-free page header with `All Courses` in the display face, a course count under it, then the same 3-column stacked-card grid.
- D3: Card tile shows the Sanity cover image, matching what the home page now does. No cover falls back to the title initial.
- D4: No category filter, sort, or pagination. The user asked for simple, and the catalog filter bar is a later deliverable if wanted (`CATEGORIES_QUERY` already exists for it).
- D5: Empty result renders a short empty state instead of a bare heading.
- D6: `generateMetadata` is a static `metadata` export: title `All Courses — Vertex`.

## Files to touch
- `app/courses/page.tsx` — new.
- `components/course/course-grid.tsx` — new. The card grid, shared by the home page and this page so the tile and formatting logic exists once; `app/page.tsx` switches to it.

## Security considerations
- Read goes through the `server-only` fetch helper. No token, no new env var, no write. Browsing stays public, so no Clerk gate.

## Acceptance criteria
1. `/courses` lists all 10 seeded courses with real title, summary, level, duration, module count, and cover.
2. Every card links to a working `/courses/<slug>` page.
3. The home page renders identically to now after switching to the shared grid.

## Checks to run
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, load `/courses` and `/` in dev.
