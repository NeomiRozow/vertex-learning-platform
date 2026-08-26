# Implementation Prompt — Catalog Category Filter

## Goal
Add a category filter bar to `/courses`. Picking a category narrows the grid; `All` clears it.

## Code inspected
- `app/courses/page.tsx` — reads `COURSES_CATALOG_QUERY`, renders heading, count, `CourseGrid`.
- `sanity/lib/queries.ts` — `CATEGORIES_QUERY` (title, slug, description, ordered by title) and the catalog projection, which already resolves `category->{_id, title, slug}` per course.
- `components/ui/navigation.tsx`, `components/ui/button.tsx` — no pill/chip primitive exists; `buttonClasses` covers the shape.

## Decisions and assumptions
- D1: The filter is a URL state, `?category=<slug>`, rendered as `Link` pills. No client component, no state, and a filtered view is shareable and back-button correct.
- D2: The active category is read from `searchParams` on the server. An unknown slug shows the empty state rather than 404.
- D3: Filtering happens in the page over the fetched catalog, not in GROQ. The catalog is 10 documents, and adding a `$category` param to the shared projection would mean regenerating `sanity.types.ts`, which needs the Studio TypeGen run. If the catalog grows past a page's worth, this moves into the query.
- D4: Both reads (`COURSES_CATALOG_QUERY`, `CATEGORIES_QUERY`) run in parallel with `Promise.all`, tagged `course` and `category`.
- D5: The bar renders as a horizontal row of pills that wraps: `All` first, then each category by title. Active pill is the primary fill, the rest are the tertiary outline, reusing `buttonClasses` at `md`.
- D6: The count line reflects the filtered result, and the empty state names the active category.
- D7: A category with no courses still shows a pill. Hiding it would need a per-category count and is not worth the query.

## Files to touch
- `app/courses/page.tsx`
- `components/course/category-filter.tsx` — new.

## Security considerations
- Reads go through the `server-only` fetch helper. The `category` search param is only compared against slugs already returned by Sanity, never interpolated into a query.

## Acceptance criteria
1. `/courses` shows all 10 courses with `All` active.
2. `/courses?category=web-development` shows only that category's courses, its pill active, and the count matching.
3. An unknown `?category=` value shows the empty state, not an error.
4. Pills are keyboard reachable and the active one is marked `aria-current`.

## Checks to run
- `npx tsc --noEmit`, `npm run lint`, `npm run build`, load `/courses` filtered and unfiltered in dev.
