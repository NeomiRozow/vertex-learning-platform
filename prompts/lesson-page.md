# Implementation Prompt — Lesson Page

## Goal
Build the lesson page at `/lessons/[slug]`, matching `Design/vertex-lesson.png` exactly on desktop and responsive down to mobile, wired to the seeded Sanity content through the existing server-only read layer. The lesson video plays on the page through the provider's own embed. Read only: no writes, no progress backend, no search.

## Skills and docs read
- `AGENTS.md` (sections 3, 5, 6, 7, 8, 9, 12, 13, 14).
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` — `PageProps<'/lessons/[slug]'>`, async `params`, and the note that reading `searchParams` in a server page forces dynamic rendering.
- No Sanity skill work needed: schema, query, and TypeGen types for this page already exist and nothing here adds a query.

## Code inspected
- `sanity/lib/queries.ts` — `LESSON_BY_SLUG_QUERY` already projects everything this page needs: title, summary, videoUrl, thumbnail, duration, freePreview, studentCount, notes (Portable Text), keyPoints, proTip, resources, plus the parent `course` by reverse reference with its coverImage, level, instructor and its full `modules[] { title, lessons[]-> { title, slug, duration } }`. `LESSON_SLUGS_QUERY` exists for `generateStaticParams`.
- `sanity.types.ts` — `LESSON_BY_SLUG_QUERY_RESULT` is generated and current. Every field is nullable.
- `sanity/lib/fetch.ts` (`sanityFetch`, `server-only`), `sanity/lib/client.ts` (read token server-side), `sanity/lib/image.ts` (`urlFor`).
- `studio/scripts/seed/seed.ndjson` — 10 courses × 4 modules × 3 lessons = 120 lessons. **Every seeded `videoUrl` is a YouTube watch URL** (`https://www.youtube.com/watch?v=…`). `duration` is seconds. `thumbnail` is the YouTube hqdefault image uploaded into Sanity, so it serves from `cdn.sanity.io`. `notes` is real Portable Text (intro paragraph, an `h2`, bulleted blocks). `keyPoints`, `proTip`, `resources` are populated.
- `studio/schemaTypes/documents/lesson.ts` — `videoUrl` is validated against YouTube, Vimeo and Bunny hosts only.
- `app/courses/[slug]/page.tsx` + `components/course/*` — the page frame (`hatch`, centered `max-w-[1440px]`, `lg:border-x`, `SiteHeader`), the `<details>` disclosure pattern that keeps pages server components, the derived `Lesson N.M` labelling, and `CourseProgressBar`'s precedent of rendering 0% rather than inventing progress.
- `components/ui/*` — `Badge` (`video` tone = primary-100/primary-500), `Button`/`buttonClasses`, `Card`, `ProgressBar`, `Breadcrumbs`, the 24px icon set.
- `components/course/lesson-link.tsx` — the existing PostHog client-link precedent.
- `lib/format.ts` — `formatDuration`, `formatCount`, `formatLevel`.
- `next.config.ts` — only `cdn.sanity.io/images/**` is allowed for `next/image`; that is all this page needs.
- `node_modules/@portabletext/react@6.2.0` is present in the tree but is not a declared dependency of the web workspace.

## Values read from the reference
Measured against `Design/vertex-lesson.png` (1024×1536), converted to design px.

- Frame and header identical to the course page: `hatch` ground, centered column, `SiteHeader` (logo, Courses / My Learning, bell, avatar).
- Below the header the page is two columns separated by a 1px vertical hairline, with a full-width sticky footer bar beneath both.
- **Left sidebar (~28% of the column, ~400px), flush to the frame edge, no page padding, `border-r`:**
  - `← Back to course` in primary-500, ~14px medium, ~28px top padding, ~24px left padding.
  - Course tile: ~56px black rounded square holding the course cover, then the course title (~15px semibold) over `35% complete` (~12px neutral-500) and a short 2px primary progress track.
  - `Module 5 of 12` section label (~13px) with a chevron on the right, on a hairline.
  - Module rows: ~28px circular outline number badge joined vertically to the next by a 1px connector, module title (~14px semibold) over its duration (~12px neutral-500), and on the right either a primary check-circle (completed) or a chevron (collapsed).
  - The current module is expanded: its badge is a filled primary-500 circle with white text, its row sits on a faint warm tint, and its lessons list below shows a small ring/dot marker per lesson, the lesson title (~13px) over its duration, with the current lesson's title in neutral-900, its marker filled primary-500, `Now playing` in primary-500 beneath it, and a filled primary-500 round play button on the right.
- **Right content column (~48px padding):**
  - Breadcrumbs: `All Courses` › course › module › lesson.
  - `LESSON 5.1` badge, primary-100 fill / primary-500 text, ~4px radius, 11px bold uppercase, ~24px below the breadcrumbs.
  - Title in Playfair ~48px/1.15 bold, with a ~40px square outline bookmark button right-aligned to it.
  - Summary Inter ~17px/30px neutral-700, max ~640px.
  - Meta row ~28px below: clock/duration, signal/level, users/`3,426 students`, 14px neutral-500 with 18px icons.
  - Video: full-width 16:9, ~16px radius, black.
  - Tabs `Lesson Content` | `Notes` on a hairline, ~16px, active in primary-500 with a 2px primary underline.
  - `Overview` (~20px semibold) then body copy ~15px/28px neutral-700.
  - Hairline, then `In this lesson you will:` (~15px semibold) and a list of ~14px items each with a 20px primary-500 check-circle.
  - Pro Tip callout: primary-100 fill, ~12px radius, ~24px padding, a lightbulb icon, `Pro Tip` semibold, then ~14px/22px body.
  - Hairline, then `Resources` (~20px semibold) and a 3-column grid of white cards (1px neutral-200, ~12px radius, ~20px padding): a 24px icon, title (~14px semibold, wraps to 2 lines), description (~12px neutral-500), and an external-link glyph bottom-right.
- **Sticky footer bar:** full width of the column, top hairline, ~24px padding. Left: tertiary `← Previous Lesson` button then the previous item's title (~14px) over its duration (~13px neutral-500). Right: the next item's title over its duration, then a primary `Next Lesson →` button (h-14).

## Decisions and assumptions
- D1: Route is `app/lessons/[slug]/page.tsx`, a server component. `generateStaticParams` uses `LESSON_SLUGS_QUERY` with `useCdn: false`; an unknown slug or a lesson with no title calls `notFound()`.
- D2: No new GROQ, no schema change, no TypeGen run. `LESSON_BY_SLUG_QUERY` already covers the page.
- D3: All numbering is derived from array order, never stored. The lesson's position is found by flattening `course.modules[].lessons[]` and matching `_id`; that yields the module index, the lesson index inside it, the `Lesson 5.1` label, the `Module 5 of 12` label, and the previous/next lessons.
- D4: Previous/Next in the footer are the previous and next **lessons** in the flattened course order, labelled with their own title and duration. The reference shows adjacent module titles there while the buttons read "Previous/Next Lesson"; lessons are the coherent reading and match the button text. At the first or last lesson the corresponding side renders disabled with no link.
- D5: Playback is the provider's own embed in an iframe, per AGENTS section 7. No custom player is built, so the reference's custom control bar is deliberately not reproduced — the provider's controls render instead. A new `lib/video-embed.ts` maps a `videoUrl` plus a start second to an embed src for YouTube (`youtube-nocookie.com/embed/ID?start=N`), Vimeo (`player.vimeo.com/video/ID#t=Ns`) and Bunny (`iframe.mediadelivery.net/embed/LIB/ID?t=N`) — the three hosts the lesson schema allows. An unrecognised URL renders the poster with no player rather than throwing.
- D6: The player is a small client component. It shows the lesson `thumbnail` with a play button until the user clicks, then swaps in the iframe with `autoplay=1`. This keeps YouTube's script off the page until it is wanted, gives a real play signal without pulling in the YouTube IFrame API, and matches the poster-first look of the reference.
- D7: The start second comes from a `?t=` search param, read in the player with `useSearchParams` rather than in the server page. Reading `searchParams` on the server would force dynamic rendering and lose `generateStaticParams`. This is the param the search results page will link to.
- D8: PostHog, browser side only, two events: `lesson_viewed` on mount (lesson slug/title, course slug/title) and `lesson_video_played` on the play click (adds `start_seconds`). Watch-progress and lesson-completed events depend on the progress store and are out of scope here.
- D9: Progress is not modelled yet — there is no progress document and no server route, matching `CourseProgressBar`'s existing 0% treatment. So the sidebar shows `0% complete` with an empty track, no module shows a completion check, and the only marked lesson is the one being viewed (`Now playing`). Nothing is invented. Flagged for the user.
- D10: The `Notes` tab is presentational only per AGENTS section 7. Tabs are a small client component holding the active-tab state; both panels are rendered server-side and passed in as children. The Notes panel shows an empty state saying notes are not saved yet. `Bookmark` is likewise an inert button, matching the course page.
- D11: `Lesson Content` renders `Overview` from the lesson's `notes` Portable Text through `@portabletext/react`, with a serializer set matching the project's type scale (h2/h3, paragraphs, bullet and number lists, links opening in a new tab with `rel="noreferrer"`, and images through `urlFor` + `next/image`). `@portabletext/react` is added to `package.json` — it is currently only present transitively.
- D12: `keyPoints`, `proTip` and `resources` render as the `In this lesson you will`, Pro Tip and Resources blocks. Each section is omitted entirely when its field is empty. Resource cards use a per-type icon (repository → a code/GitHub-style mark, documentation/guide/article → file, video → play, download → file, link → external link) and always link out with `target="_blank" rel="noreferrer"`.
- D13: New icons added to `components/ui/icons.tsx` in the existing style: `ArrowLeftIcon`, `LightbulbIcon`, `GithubIcon`. Nothing existing changes.
- D14: New composition lives in `components/lesson/`. Nothing in `components/course/` or `components/ui/` changes except the icon additions.
- D15: Every projected field is nullable; the page renders what exists and drops the rest. A lesson whose reverse-reference course is missing still renders: the sidebar and footer nav are omitted and the content column goes full width.
- D16: Responsive. Below `lg` the sidebar collapses to a `<details>` disclosure above the content ("Course content"), the content column loses its side padding down to `px-6`, the resources grid goes 2-up at `sm` and 1-up below, the meta row wraps, and the footer bar keeps only the two buttons.

## Files to touch
- `app/lessons/[slug]/page.tsx` — new. Fetch, `generateStaticParams`, `generateMetadata`, position derivation, page composition.
- `components/lesson/lesson-sidebar.tsx` — new. Back link, course tile, module/lesson tree.
- `components/lesson/lesson-player.tsx` — new, client. Poster, play click, provider iframe, `?t=` handling, PostHog play event.
- `components/lesson/lesson-view-tracker.tsx` — new, client. `lesson_viewed` capture.
- `components/lesson/lesson-tabs.tsx` — new, client. Tab state only; panels come in as children.
- `components/lesson/lesson-content.tsx` — new. Overview + Portable Text, key points, pro tip, resources.
- `components/lesson/portable-text.tsx` — new. The serializer set.
- `components/lesson/lesson-nav.tsx` — new. Sticky previous/next footer bar.
- `components/ui/icons.tsx` — additive: `ArrowLeftIcon`, `LightbulbIcon`, `GithubIcon`.
- `lib/video-embed.ts` — new. URL → provider, id, embed src.
- `package.json` — add `@portabletext/react`.

## Requirements
- The page renders server-side from Sanity only. No content is hardcoded.
- Desktop matches the reference; the page is usable down to 360px.
- The video plays on the page. The learner is never sent to the provider.
- `?t=<seconds>` starts playback at that second.
- Numbering, labels and previous/next are derived from order.
- Nothing is invented: no fake progress, no fake completion marks, no fake counts.

## Security considerations
- The Sanity read token stays server-side; all content is fetched through `sanityFetch` (`server-only`). No token, no client-side Sanity call.
- The page is public; no route is gated and middleware is untouched.
- Nothing writes. No write token is used or needed.
- Iframes are given a minimal `allow` list (`accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share`) and the YouTube embed uses the `youtube-nocookie.com` host.
- Embed sources are built from a parsed and validated provider id, never by string-concatenating the raw stored URL, so a bad stored URL cannot inject arbitrary iframe src.
- Outbound resource links carry `rel="noreferrer"`.
- Only the public PostHog key is used, in the browser, via the existing setup.

## Acceptance criteria
1. `/lessons/<any seeded slug>` renders the full page from Sanity: sidebar tree, breadcrumbs, badge, title, summary, meta, player, tabs, overview, key points, pro tip, resources, previous/next bar.
2. Clicking the poster plays the video inline; the page never navigates to YouTube.
3. `/lessons/<slug>?t=120` starts the video at 2:00.
4. The sidebar highlights the current module and lesson, and every module and lesson number matches its position in the course.
5. Previous/Next move through the course in lesson order and are disabled at the ends.
6. An unknown slug 404s.
7. No progress, completion mark or count appears that is not in the data.
8. Layout holds at 1440, 1024, 768 and 375px wide.
9. `npx tsc --noEmit` and `npm run lint` pass; `npm run build` succeeds.

## Checks to run
- `npm install` (adds `@portabletext/react`).
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` (a route is added)
- `npm run dev` for the manual steps below.

## Manual test steps
1. `npm run dev`, open `/courses/nextjs-app-router-in-depth`, expand a module and click a lesson.
2. On the lesson page confirm the sidebar shows the course, the correct `Module N of M`, the current module expanded, and the current lesson marked `Now playing`.
3. Confirm the badge reads the derived `Lesson N.M` and the breadcrumbs read All Courses › course › module › lesson.
4. Click the video poster; confirm it plays inline and the tab never leaves the site.
5. Reload with `?t=120`; confirm playback starts at 2:00.
6. Switch to the `Notes` tab; confirm the empty state, then switch back.
7. Click a resource; confirm it opens in a new tab.
8. Use Previous Lesson and Next Lesson through a module boundary; confirm the order is correct and both are disabled at the course's first and last lesson.
9. Resize to 1024, 768 and 375px; confirm the sidebar collapses into its disclosure and nothing overflows horizontally.
10. In PostHog, confirm `lesson_viewed` on load and `lesson_video_played` on the play click.
