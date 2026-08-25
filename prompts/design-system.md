# Implementation Prompt — Vertex Design System

## Goal
Implement the design system in `Design/vertex-designsystem.png` as the project's token layer plus a reusable UI primitive library, and a `/design-system` route that renders every primitive for visual verification against the reference image.

## Skills and docs read
- `AGENTS.md` (sections 3, 5, 6, 13, 14).
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` — `next/font/google` usage in the root layout.
- No Sanity/Clerk/PostHog skill applies: this task touches presentation only.

## Code inspected
- `package.json` — Next 16.3.2, React 19.2.8, Tailwind v4 via `@tailwindcss/postcss`. No icon library, no `clsx`, no component library.
- `app/globals.css` — CRA-style scaffold tokens (`--background`, `--foreground`, dark-mode block, Geist vars).
- `app/layout.tsx` — Geist + Geist Mono fonts, scaffold metadata.
- `app/page.tsx` — Next.js starter page.
- `tsconfig.json` — `@/*` → repo root, so `components/ui/*` imports as `@/components/ui/*`.
- `eslint.config.mjs`, `postcss.config.mjs` — defaults, no changes needed.

## Values read from the reference
Sampled pixels and OCR-verified labels from `Design/vertex-designsystem.png`.

Primary: 500 `#F97316`, 400 `#FB923C`, 300 `#FDBA74`, 200 `#FED7AA`, 100 `#FFEEE5`.
Neutral: 900 `#0F172A`, 700 `#334155`, 500 `#64748B`, 300 `#CBD5E1`, 200 `#E2E8F0`, 100 `#F1F5F9`, 50 `#FAFAFC`, white `#FFFFFF`.
Page background sampled at `#FCF8F6` (warm off-white); cards are `#FFFFFF`.
Lesson badge (only non-palette color in the sheet): background `#F2F0F9`, text `#4338CA`.

Typography: Playfair Display (display) and Inter (sans).
Type scale — Display 1 48/56 bold, Display 2 36/44 bold (both Playfair); Heading 1 28/36 semibold, Heading 2 22/30 semibold, Heading 3 18/26 medium, Body Large 16/24 regular, Body 14/20 regular, Small 12/16 regular (all Inter).

Spacing: 4px base — 4, 8, 12, 16, 24, 32, 40, 48, 64. Tailwind's default 4px scale already covers this; no override.

Radius: xs 4, sm 8, md 12, lg 16, xl 24, full.
Shadows: sm `0 1px 2px 0 rgba(15,23,42,0.05)`, md `0 4px 12px -2px rgba(15,23,42,0.08)`, lg `0 12px 24px -4px rgba(15,23,42,0.10)`, xl `0 20px 40px -8px rgba(15,23,42,0.12)`.

Buttons: height 44px, radius 12px, padding 0 16px (lg) / 0 12px (md), Inter Medium 14–16px. Variants primary (solid `#F97316`, white text; hover darker), secondary (white fill, 1px primary border, primary text; hover primary-100 fill), tertiary (white fill, neutral-200 border, neutral-900 text, external-link icon), text (primary text + play icon, no chrome). Each has default / hover / disabled.

Inputs: height 44px, radius 12px, border `1px solid #E2E8F0`, padding 0 16px, focus border `#FB923C`. Search input has a leading search icon and a trailing `⌘K` hint chip. Select is a native `select` with a chevron.

Badges: VIDEO and POPULAR use primary-100 background with primary-500 text; LESSON uses `#F2F0F9` / `#4338CA`. Uppercase, letter-spaced, small.

Status indicators: In Progress (partial ring, primary), Completed (check circle, green `#16A34A`), Now Playing (filled play circle, primary), Locked (lock, neutral-900).

Progress bar: 8px track in primary-100, primary-500 fill, rounded full, with `35% complete` label to the right.

Cards: white, radius 16px, 1px neutral-200 border, shadow sm. Four kinds — Course, Lesson (Video), Lesson (Lesson), Resource — matching the four card layouts in the sheet.

Navigation: logo mark + wordmark, active link in primary, inactive in neutral-900. Breadcrumbs with chevron separators, trailing crumb muted. Pagination with prev/next chevrons, active page boxed in primary border with primary text, ellipsis gap.

Icons: 24×24 grid, 2px stroke, rounded caps, outline and filled variants of bell, search, play-circle, file, bookmark, bar-chart, clock, user, chevron-right — plus the extra glyphs the sheet uses (external-link, check-circle, lock, chevron-down, chevron-left, folder).

## Decisions and assumptions
- D1: Tokens live in `app/globals.css` under Tailwind v4 `@theme`. That is the Tailwind v4 way and avoids a `tailwind.config` file the project does not have.
- D2: The system is light-only. The reference sheet shows no dark palette, so the scaffold's `prefers-color-scheme: dark` block is removed rather than guessed at.
- D3: Fonts load through `next/font/google` (Playfair Display, Inter) exposed as `--font-display` and `--font-sans`. Geist is dropped — the sheet names the two typefaces explicitly.
- D4: Icons are hand-written inline SVGs in `components/ui/icons.tsx`. No icon dependency is added: the sheet specifies a 24px/2px style and only ~15 glyphs are needed.
- D5: A tiny local `cn()` helper (`lib/cn.ts`) joins class names instead of adding `clsx`/`tailwind-merge`.
- D6: Primitives are server components by default. Only `Select` and `Pagination` need interactivity later; both ship as uncontrolled/presentational markup now, so no `"use client"` is required. If a primitive needs state later it gets the directive then.
- D7: Cards are exported as the four named variants from the sheet rather than one generic `Card` with a `variant` prop — their internals differ enough that a single prop would obscure them.
- D8: `/design-system` is an internal reference route, not part of the product surface. It renders every primitive in the same order and grouping as the reference image.
- A1: Assumption — the hover state for the primary button is a darker orange; the sheet shows it visually but names no hex. Using `#EA580C` (the natural 600 step below `#F97316`).
- A2: Assumption — "Neutral 50 `#FAFAFC`" is the panel surface, and the warm `#FCF8F6` sampled behind the sheet is the app page background. Both are tokenized; page background uses the warm value.
- A3: Out of scope, not touched — the empty `app 2/` and `public 2/` directories, and the Next.js starter content in `app/page.tsx`.

## Files to touch
- `app/globals.css` — rewrite: `@theme` tokens for colors, fonts, radius, shadows; base body styles; type-scale utility classes.
- `app/layout.tsx` — swap Geist for Playfair Display + Inter, set Vertex metadata, apply base background/text tokens.
- `lib/cn.ts` — new.
- `components/ui/icons.tsx` — new.
- `components/ui/button.tsx` — new.
- `components/ui/input.tsx` — new (`SearchInput`, `Select`).
- `components/ui/badge.tsx` — new.
- `components/ui/status.tsx` — new (status indicators).
- `components/ui/progress-bar.tsx` — new.
- `components/ui/card.tsx` — new (`CourseCard`, `LessonVideoCard`, `LessonCard`, `ResourceCard`).
- `components/ui/navigation.tsx` — new (`Logo`, `NavBar`, `Breadcrumbs`, `Pagination`).
- `app/design-system/page.tsx` — new showcase route.

Not touched: `app/page.tsx`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `package.json` (no new dependencies).

## Requirements
- R1: Every color, size, radius, and shadow comes from a token. No raw hex in component files.
- R2: Match the reference exactly on desktop — layout, spacing, typography, color, and the default/hover/disabled states shown.
- R3: Responsive down to mobile: card grids collapse to one column, the nav collapses to logo plus links, pagination stays scrollable. Desktop rendering is unchanged.
- R4: Semantic, accessible markup — real `button`, `input`, `select`, `nav`, `ol` for breadcrumbs; `aria-current` on the active nav link and page; `aria-label` on icon-only controls; `role="progressbar"` with value attributes; decorative SVGs `aria-hidden`.
- R5: Visible focus states on every interactive element (primary-400 ring), not just `:hover`.
- R6: Disabled buttons use `disabled` plus the muted styling from the sheet, and are not focusable-and-actionable.
- R7: TypeScript props are explicit and extend the native element props where a primitive wraps one.
- R8: Components are presentational only. No data fetching, no client state, no tokens, no network calls.

## Security considerations
- S1: Presentation-only change. No secrets, no env vars, no server routes, no tokens.
- S2: No new dependencies, so no new supply-chain surface.
- S3: `next/font/google` self-hosts the fonts at build time, so no runtime third-party font request.
- S4: All rendered content is passed as React children/props; no `dangerouslySetInnerHTML` anywhere.

## Acceptance criteria
- AC1: `/design-system` renders all 14 sections of the reference sheet, in order, and visually matches the image on a desktop viewport.
- AC2: All four button variants render default, hover, and disabled states matching the sheet.
- AC3: Search input, select, badges, status indicators, and progress bar match the sheet.
- AC4: All four card types match the sheet, including their meta rows and actions.
- AC5: Nav, breadcrumbs, and pagination match the sheet.
- AC6: The page is usable and unbroken at 375px width.
- AC7: Keyboard focus is visible on every interactive element.
- AC8: `npx tsc --noEmit` passes with no errors.
- AC9: `npm run lint` passes with no errors.
- AC10: `npm run build` succeeds.

## Checks to run
1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build` (routes and global config changed)
4. `npm run dev` and load `/design-system`

## Manual test steps
1. Run `npm run dev`.
2. Open `http://localhost:3000/design-system` at 1440px wide.
3. Compare each numbered section against `Design/vertex-designsystem.png` — colors, type scale, spacing, radius, shadows.
4. Hover each button variant; confirm the hover styling matches row 2 of section 07.
5. Confirm the disabled row is muted and does not respond to clicks.
6. Click into the search input and the select; confirm the border turns `#FB923C`.
7. Tab through the page; confirm a visible focus ring on every button, input, select, nav link, and pagination control.
8. Resize to 375px; confirm nothing overflows horizontally and card grids stack.
