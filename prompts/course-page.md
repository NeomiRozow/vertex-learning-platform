# Implementation Prompt — Course Detail Page

## Goal
Build the course detail page at `/courses/[slug]`, matching `Design/vertex-course.png` exactly on desktop and responsive down to mobile, wired to the seeded Sanity content through the existing server-only read layer. Read only: no writes, no progress backend, no search, no PostHog.

## Skills and docs read
- `AGENTS.md` (sections 3, 5, 7, 8, 12, 13, 14).
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — `PageProps<'/courses/[slug]'>` route-props helper, async `params`.
- No Sanity skill work is needed: the schema, queries, and TypeGen types already exist and this task adds no new query.

## Code inspected
- `sanity/lib/queries.ts` — `COURSE_BY_SLUG_QUERY` already projects every field this page needs (title, summary, coverImage, level, price, popular, studentCount, learningOutcomes, instructor, category, modules with resolved lessons, moduleCount, lessonCount, totalDuration) plus `COURSE_SLUGS_QUERY`.
- `sanity.types.ts` — `COURSE_BY_SLUG_QUERY_RESULT`, `COURSE_SLUGS_QUERY_RESULT` are generated and current. Every field is nullable.
- `sanity/lib/fetch.ts` — `sanityFetch({query, params, revalidate, tags, useCdn})`, `server-only`.
- `sanity/lib/image.ts` — `urlFor(source)` builder.
- `studio/scripts/seed/seed.ndjson` — 10 courses, each with 4 modules × 3 lessons, 4 learning outcomes, a picsum-sourced cover image, `popular`, `studentCount`, `price`, `level`. Lesson `duration` is seconds. No course has 12 modules; the design's "Show all 12 modules" affordance therefore has to key off the real count.
- `components/ui/*` — `Button`/`buttonClasses`, `Badge` (`popular` tone), `Card`, `ProgressBar`, `StatusIndicator`, `Breadcrumbs` in `navigation.tsx`, and the 24px icon set in `icons.tsx`.
- `components/home/site-header.tsx` — the header in the reference, already built (logo, Courses / My Learning, bell, Clerk `UserButton`).
- `app/page.tsx` — the page frame pattern: `hatch` background, centered `max-w-[1440px]` column with `lg:border-x`, `SiteHeader`, `main`.
- `app/globals.css` — Tailwind v4 `@theme` tokens and type-scale utilities.
- `next.config.ts` — `cdn.sanity.io/images/**` allowed for `next/image`.

## Values read from the reference
Measured against `Design/vertex-course.png` (1024×1536, design px).

- Frame and header identical to the home page.
- Breadcrumbs: ~24px below the header, `All Courses` (neutral-500) › `Next.js for Production` (neutral-900), ~14px, chevron separator.
- Hero, two columns, ~40px gap, ~40px top padding:
  - Left: square cover ~280px, ~16px radius, cropped, dark artwork.
  - Right: `POPULAR` badge (primary-100 fill, primary-500, ~4px radius, 11px bold uppercase); title in Playfair ~52px/1.15 bold; summary Inter ~17px/31px neutral-700, max ~480px, ~20px below the title; meta row ~28px below with four 14px neutral-500 items and 18px icons — signal/level, clock/duration, file/`12 modules`, users/`2.1k students`; ~28px below, a primary `Continue Learning` button with a trailing arrow (h-14) and a tertiary `Bookmark` button with a leading bookmark icon.
- "What you'll learn" panel: full-width card, white, 1px neutral-200, ~16px radius, ~40px padding, ~56px below the hero. Heading in Playfair ~28px. Below it a 2-column grid, ~24px gap, of outcome cards: white, 1px neutral-200, ~12px radius, ~24px padding, a ~40px primary-500 outline icon on the left, then title (Inter ~17px semibold neutral-900) and description (~14px/22px neutral-500).
- "Course Content": ~48px below. Left heading in Playfair ~28px, right meta `12 modules • 18h 24m` in ~13px neutral-500, baseline-aligned.
- Module list: one white card, 1px neutral-200, ~16px radius, rows separated by 1px hairlines. Each row ~62px tall, ~24px padding: a ~28px circular outline number badge on the left joined to the next by a 1px vertical connector, then the module title (~15px semibold) over its summary (~13px neutral-500), then the module duration (~13px neutral-500) and a 20px chevron-down on the right.
- Below the card, centered, a tertiary pill button `Show all 12 modules` with a chevron-down.
- Sticky bottom bar: white, 1px neutral-200, ~16px radius, ~20px padding, spanning the content width and pinned to the viewport bottom with a small gap. Left: `Your Progress` (~12px neutral-500) over `35% complete` (~15px, the number bold neutral-900). Middle: a ~2px-tall rounded track, primary-100 with a primary-500 fill. Right: a primary `Continue Learning` button with a trailing arrow.

## Decisions and assumptions
- D1: Route is `app/courses/[slug]/page.tsx`, a server component. `generateStaticParams` uses `COURSE_SLUGS_QUERY` with `useCdn: false`; an unknown slug calls `notFound()`.
- D2: No new GROQ. `COURSE_BY_SLUG_QUERY` covers the page as written, so no schema, query, or TypeGen change is needed.
- D3: Derived numbers come from array order and query aggregates, never stored fields — module numbers from index, `moduleCount`/`totalDuration`/per-module duration summed from lesson `duration` seconds.
- D4: Formatting helpers live in a new `lib/format.ts`: `formatDuration(seconds)` → `18h 24m` / `45m`, `formatCount(n)` → `2.1k`, `formatLevel(level)` → `Intermediate`. They are shared with the lesson and catalog pages later.
- D5: Module rows expand with a native `<details>`/`<summary>` disclosure, the same pattern `SiteHeader`'s mobile menu already uses, so the page stays a server component with no client bundle. Expanding lists that module's lessons: derived `Lesson 3.1` label, title, duration, and a link to the lesson page.
- D6: "Show all N modules" is also a `<details>`: the first 6 modules always render, the rest live inside the disclosure, and the button is omitted when a course has 6 modules or fewer. The seeded courses have 4, so it will not appear on seeded content — the design's 12-module case still works.
- D7: Progress is not modeled yet (AGENTS section 7 lists it as its own deliverable, and no progress document or server route exists). The sticky bar renders at 0% and both CTAs read `Start Learning` and link to the course's first lesson. No fabricated 35%. When progress lands, this bar takes a real value and the label flips back to `Continue Learning`. Flagged for the user.
- D8: The lesson route does not exist yet. Lesson links point at `/lessons/[slug]`, matching `LESSON_BY_SLUG_QUERY`, which keys off the lesson slug alone. They 404 until the lesson page is built.
- D9: `Bookmark` is presentational, matching the free-preview and notification-bell precedent in section 7. It is a disabled-free but inert `<button>` with `aria-disabled` left off; no state, no write.
- D10: The cover image renders with `next/image` from the Sanity asset via `urlFor`, using the asset `lqip` as `blurDataURL`. The seeded covers are photos, not the dark `N` tile in the reference; the reference tile is the design's stand-in for whatever the cover image is.
- D11: Learning-outcome icons: `icons.tsx` has none of the 11 schema keys. Add the missing outline icons (layers, database, gauge, cloud, code, shield, terminal, rocket, puzzle, sparkles, workflow) to `components/ui/icons.tsx` in the existing 24px stroke style, plus a `learningOutcomeIcon(key)` lookup. An unknown or null key falls back to `StarIcon`.
- D12: The header lives in `components/home/site-header.tsx`. It is reused from there as-is; moving it is out of scope.
- D13: New page-level composition lives in `components/course/` (`course-hero.tsx`, `learning-outcomes.tsx`, `course-content.tsx`, `course-progress-bar.tsx`). Nothing in `components/ui/` changes except the icon additions.
- D14: Every projected field is nullable. The page renders what exists and drops the rest: no cover, no badge, no outcomes section, empty meta items are all handled without throwing. `title` missing is treated as a 404.
- D15: Responsive: below `lg` the hero stacks (cover above the text), the outcome grid becomes one column, the module row meta wraps under the title, and the sticky bar drops the middle track and keeps label plus button.

## Files to touch
- `app/courses/[slug]/page.tsx` — new. Data fetch, `generateStaticParams`, `generateMetadata`, page composition.
- `components/course/course-hero.tsx` — new.
- `components/course/learning-outcomes.tsx` — new.
- `components/course/course-content.tsx` — new (module list, disclosures, show-all).
- `components/course/course-progress-bar.tsx` — new (sticky bar).
- `components/ui/icons.tsx` — additive: the 11 outcome icons.
- `lib/format.ts` — new.

## Requirements
- Server components only. No `use client` anywhere in this change.
- All content comes from `sanityFetch` with the existing query. No hardcoded course copy.
- Module and lesson numbers derived from order, never stored.
- Durations stored in seconds, formatted at render.
- No new dependency.
- Reuse `Badge`, `buttonClasses`, `Card`, `Breadcrumbs`, `ProgressBar`, and the icon set before adding anything.

## Security considerations
- Reads go through `sanity/lib/fetch.ts`, which imports `server-only`; the read token never reaches the browser.
- No token, project secret, or Clerk secret is referenced in any component.
- The page is public browsing, so no Clerk gate is added (AGENTS section 7: browsing stays public).
- No user input is echoed; the slug is only ever a query parameter to GROQ, never interpolated into the query string.

## Acceptance criteria
1. `/courses/nextjs-app-router-in-depth` renders the seeded course: title, summary, cover, POPULAR badge, level, total duration, module count, student count.
2. "What you'll learn" shows the four seeded outcomes with their mapped icons in a 2-column grid.
3. "Course Content" lists the four seeded modules, numbered 1–4, each with its summary and summed duration; expanding one lists its three lessons with derived `N.M` labels and links.
4. The show-all button is absent at 4 modules and present when a course exceeds 6.
5. The sticky bar shows 0% and `Start Learning`, linking to the course's first lesson.
6. An unknown slug returns the 404 page.
7. Desktop matches the reference; at 375px nothing overflows horizontally.

## Checks to run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` (new route and server code)
- `npm run dev` and load the page

## Manual test steps
1. `npm run dev`.
2. Open `/courses/nextjs-app-router-in-depth`. Compare against `Design/vertex-course.png`.
3. Expand module 3 and confirm the lessons read `Lesson 3.1`–`Lesson 3.3` with durations.
4. Click a lesson link and confirm it goes to `/lessons/<slug>` (404 until the lesson page exists).
5. Open `/courses/python-for-data-work` and confirm the POPULAR badge and different level, counts, and outcomes.
6. Open `/courses/not-a-course` and confirm the 404 page.
7. Resize to 375px and confirm no horizontal scroll and a readable stacked layout.
