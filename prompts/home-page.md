# Implementation Prompt — Vertex Home Page

## Goal
Build the Vertex home page at `/` to match `Design/vertex-home.png` exactly on desktop, and make it responsive down to mobile. Presentation only: static placeholder content, no Sanity, no Clerk, no PostHog, no search wiring.

## Skills and docs read
- `AGENTS.md` (sections 3, 5, 6, 13, 14).
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — page/layout conventions in this Next version.
- No Sanity/Clerk/PostHog skill applies: this task touches presentation only.

## Code inspected
- `app/layout.tsx` — Inter + Playfair loaded as `--font-inter` / `--font-playfair`; body is `min-h-full flex flex-col bg-canvas`.
- `app/globals.css` — Tailwind v4 `@theme` tokens (primary/neutral/canvas/surface, radius xs–xl, shadows sm–xl) and type-scale utilities (`display-1`, `display-2`, `heading-1..3`, `body-lg`, `body`, `small`).
- `components/ui/button.tsx` — `primary|secondary|tertiary|text` × `lg|md`, fixed `h-11`.
- `components/ui/input.tsx` — `SearchInput` (h-11, leading search icon, trailing `⌘ K` chip), `Select`.
- `components/ui/card.tsx` — `Card`, `CourseCard` (icon tile beside title, no divider), `LessonVideoCard`, `LessonCard`, `ResourceCard`.
- `components/ui/navigation.tsx` — `Logo`, `NavBar` (logo + links only, no right-hand actions), `Breadcrumbs`, `Pagination`.
- `components/ui/icons.tsx` — 24px outline/filled set; no arrow-right, no star.
- `lib/cn.ts`, `tsconfig.json` (`@/*` → repo root).
- `app/page.tsx` — still the `create-next-app` starter; it gets replaced.

## Values read from the reference
Measured against `Design/vertex-home.png` (1024×1536, read at 1× so px below are design px).

- Page frame: content sits in a centered column ~958px wide with a 1px vertical hairline on each side; outside those lines the background carries a faint diagonal hatch. Frame background is `--color-canvas`.
- Header: ~96px tall, 1px bottom hairline, 48px horizontal padding. Left: Vertex mark + wordmark, then `Courses` and `My Learning` links (~15px, neutral-900, ~32px gap, first link ~64px after the wordmark). Right: outline bell icon (~24px) and a circular 48px avatar photo.
- Hero: centered, ~64px top padding, ~72px bottom padding.
  - Eyebrow pill: white fill, 1px neutral-200 border, ~12px radius, ~40px tall, label `INTELLIGENT LEARNING` in primary-500, ~12px, bold, wide letter-spacing, uppercase.
  - Headline: Playfair, ~64px / ~76px line height, bold, neutral-900, two lines — `Search your learning` / `in plain English.`
  - Sub-copy: Inter ~18px / ~33px, neutral-700, two lines, max width ~460px.
  - CTA: primary solid button `Explore Courses` + arrow-right icon, ~56px tall, ~12px radius, ~16px label.
  - Search field: ~745px wide, ~86px tall, ~16px radius, white fill, 1px neutral-200 border, leading 24px search icon, placeholder `Ask anything about your learning…` at ~18px neutral-500, trailing `⌘ K` chip (bordered, ~8px radius).
- Section rule: full-width 1px hairline between hero and catalog.
- Catalog: ~56px top padding. Row with `All Courses` in Playfair ~32px on the left and a primary-500 `View all courses` link + arrow on the right (~15px). Below, a 3-column grid, ~24px gap, cards ~267px wide.
- Course card: white fill, 1px neutral-200 border, ~16px radius, ~24px padding. Stacked: 64px rounded brand tile on top, ~24px gap, title in Playfair ~19px, description Inter ~14px neutral-500, flexible spacer, 1px top hairline, then a meta row of three 12px neutral-500 items with 16px icons — level (signal), duration (clock), `N modules` (file).
- Card content: `Next.js for Production` / Intermediate / 18h 24m / 12 modules; `Docker Essentials` / Beginner / 10h 12m / 8 modules; `TypeScript Deep Dive` / Intermediate / 14h 36m / 10 modules, with the descriptions shown in the reference.
- Footnote strip: a hairline running the content width, broken in the middle by a primary-500 outline star icon and `New courses and lessons added every week.` in ~15px neutral-700.
- Footer decoration: a row of ~26 uniform-width vertical bars of varying heights, each filled with a top-to-bottom gradient from primary orange to transparent, bleeding off the bottom of the page. Purely decorative.

## Decisions and assumptions
- D1: Everything is a server component. Nothing on this page needs state — the search field is a non-submitting presentational input, matching the reference which shows placeholder text only.
- D2: Reuse existing primitives by extending them rather than duplicating. Three small additive changes, each defaulting to today's behaviour so `/design-system` renders unchanged:
  - `Button` gains an `xl` size (h-14, px-8, 16px label).
  - `SearchInput` gains `size?: "md" | "lg"`; `lg` is h-20, 16px radius, 18px text, 24px icon.
  - `CourseCard` gains `variant?: "inline" | "stacked"`; `stacked` is the home layout (tile above title, Playfair title, divider above the meta row).
- D3: `NavBar` gains an optional `actions?: ReactNode` slot rendered right-aligned, so the header's bell and avatar reuse the existing nav instead of a parallel component.
- D4: New page-level pieces live in `components/home/` (`site-header.tsx`, `course-marks.tsx`, `chart-decoration.tsx`) — they are composition, not design-system primitives.
- D5: The frame is `max-w-[1100px]`, `border-x border-neutral-200`, on a body that paints the diagonal hatch. Design px above are used as-is; at the reference's own width the layout is pixel-faithful and it centers on wider screens.
- D6: Course data is a typed const array in `app/page.tsx`. Sanity is not modeled yet, and this page is presentational per section 7. The array shape mirrors the future course fields (title, summary, level, duration, module count) so swapping in a GROQ result later is a data-source change only.
- D7: Brand marks (Next.js `N`, Docker whale, TypeScript `TS`) are hand-written inline SVG in `components/home/course-marks.tsx`. No image assets exist in the repo and no icon dependency is added, consistent with D4 of the design-system prompt.
- D8: The footer bars are a static array of heights rendered as divs with a Tailwind gradient. No canvas, no chart library.
- A1: Assumption — the reference avatar is a photograph the repo does not have. It renders as a 48px neutral-100 circle holding `UserFilledIcon` in neutral-500 until Clerk supplies a real user image. Flagged for the user.
- A2: Assumption — `Explore Courses` links to `/courses`, `View all courses` links to `/courses`, and the course cards link to `/courses/<slug>`. Those routes do not exist yet, so the links 404 until the catalog is built. Flagged.
- A3: Assumption — the diagonal hatch outside the frame is a ~4px repeating stripe at 45° in neutral-200 at low opacity; the reference is too subtle to sample an exact value.
- A4: Out of scope, not touched — `/design-system`, all other design references, `.env` handling, and the starter files in `public/`.

## Files to touch
- `app/page.tsx` — replace the starter with the home page.
- `app/globals.css` — add a `hatch` utility for the page-edge stripes.
- `components/ui/button.tsx` — add the `xl` size.
- `components/ui/input.tsx` — add `size` to `SearchInput`.
- `components/ui/card.tsx` — add the `stacked` variant to `CourseCard`.
- `components/ui/navigation.tsx` — add the `actions` slot to `NavBar`.
- `components/ui/icons.tsx` — add `ArrowRightIcon` and `StarIcon`.
- `components/home/site-header.tsx` — new.
- `components/home/course-marks.tsx` — new.
- `components/home/chart-decoration.tsx` — new.

Not touched: `app/layout.tsx`, `app/design-system/page.tsx`, `package.json` (no new dependencies), config files.

## Requirements
- R1: Desktop matches the reference in layout, spacing, type, colour, and radius. Use existing tokens and type-scale utilities; introduce a raw value only where the reference clearly exceeds the scale (the 64px headline, the 86px search field, the 56px button).
- R2: Responsive without changing the desktop rendering. Below `lg` the card grid drops to two columns, below `md` to one; the nav links collapse out of the header below `md` (logo, bell, avatar remain); the headline and search field scale down; horizontal padding tightens; the frame borders disappear below the frame width.
- R3: Additive props only. `/design-system` must render byte-identically.
- R4: Semantic markup — one `h1`, `header`/`main`/`section` landmarks, the decoration `aria-hidden`, the search input labelled, the avatar and bell given accessible names.
- R5: No client components, no `useState`, no data fetching, no env vars.

## Security considerations
- No tokens, keys, secrets, or network calls are introduced. All content is static and server-rendered. No user input is processed or persisted, and the search field posts nowhere. The server/client boundary from section 5 is untouched.

## Acceptance criteria
- AC1: `/` visually matches `Design/vertex-home.png` at desktop width — header, hero, catalog, footnote strip, footer bars.
- AC2: `/design-system` is unchanged.
- AC3: Type check passes with no new errors.
- AC4: Lint passes with no new errors.
- AC5: Production build succeeds and `/` is statically prerendered.
- AC6: At 375px, 768px, and 1440px the page has no horizontal overflow and stays readable.

## Checks to run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run dev`, then load `/` and `/design-system`.

## Manual test steps
1. `npm run dev` and open `http://localhost:3000/`.
2. Compare against `Design/vertex-home.png` side by side at ~1100px browser width: header row, eyebrow pill, headline, sub-copy, CTA, search field, section rule, `All Courses` row, three cards, footnote strip, footer bars.
3. Hover the CTA (darkens to primary-600), `View all courses`, the nav links, and a card title — each shows a hover state.
4. Focus the search field with Tab — the border turns primary and a focus ring appears.
5. Resize to 768px, then 375px — confirm the grid reflows, nothing overflows horizontally, and the footer bars still bleed off the bottom.
6. Open `/design-system` and confirm it renders exactly as before.
