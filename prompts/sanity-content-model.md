# Implementation Prompt — Sanity Content Model, Studio, and Web Data Layer

## Goal
Stand up the Sanity side of Vertex in two parts:

1. **Studio** — a standalone `studio/` workspace holding the schema for the five content types the request names: `course`, `module` (embedded object), `lesson`, `instructor`, `category`, plus the small objects they contain.
2. **Web data layer** — a server-only Sanity client, a `sanityFetch` helper, an image URL builder, and the typed GROQ queries the catalog, course, lesson, and instructor pages will read.

No pages, no UI, no components. Nothing renders yet. This is the model and the read path only.

## Skills and docs read
- `AGENTS.md` — 5 (two workspaces, server/client boundaries), 6 (stack), 7 (decisions), 8 (the data model), 12 (private dataset, token rules), 13 (checks).
- `~/.claude/skills/sanity-best-practices/SKILL.md` and `references/schema.md`, `references/project-structure.md`, `references/typegen.md`, `references/nextjs.md`.
- `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md` and `08-caching.md` — Next 16 fetch is uncached by default; `use cache` / Cache Components is opt-in via `cacheComponents: true`, which this project does not set.
- Not read, not needed here: `sanity-migration`, `dial-your-context`, `shape-your-agent`, `create-agent-with-sanity-context`. Those belong to the search and ingestion tasks.

## Code inspected
- `package.json` — Next `16.3.2`, React `19.2.8`, npm. Already has `sanity ^5.31.2`, `@sanity/vision`, `styled-components`, `next-sanity ^13.3.3`, `@sanity/image-url`, `@clerk/nextjs`. Scripts: `dev`, `build`, `start`, `lint`. No `typecheck` script.
- `sanity.config.ts` (root, untracked) — embedded-Studio config with `basePath: '/studio'`, importing `./sanity/schemaTypes` (a directory that **does not exist**, so this config cannot compile today).
- `app/studio/[[...tool]]/page.tsx` (untracked) — `NextStudio` mount. Embedded Studio.
- `sanity.cli.ts` (untracked) — `defineCliConfig` reading `NEXT_PUBLIC_SANITY_*`. No typegen block.
- `sanity/env.ts` — asserts `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`, `apiVersion` default `2026-08-26`.
- `sanity/structure.ts` — default `S.documentTypeListItems()`.
- `.env.local` — has the two Clerk keys and `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`. **No Sanity read token.**
- `.env.example` — Clerk keys only.
- `next.config.ts` — empty config. No `cacheComponents`, no `images.remotePatterns`.
- `tsconfig.json` — `@/*` → repo root; `include` is `**/*.ts(x)`; `exclude` is `node_modules`, `agent`, `.agents`.
- `app/layout.tsx` — server component, `ClerkProvider` inside `<body>`.
- `proxy.ts` — `clerkMiddleware()`, nothing gated.
- `lib/cn.ts` — the only lib helper. `components/` holds the home page UI.

## Decisions and assumptions

### D1 — Standalone `studio/` workspace. Delete the embedded Studio.
`AGENTS.md` section 5 is explicit: two standalone workspaces, do not embed the Studio inside Next.js. The `sanity-best-practices` project-structure and nextjs references say the same and label embedded "legacy — not recommended" (slow builds, no Studio auto-updates, no TypeGen watch mode).

The scaffolded embedded Studio is uncommitted and currently broken (it imports a `sanity/schemaTypes` directory that was never created), so removing it loses nothing.

Result: Next.js stays at the repo root as the web workspace (matching `prompts/clerk-auth.md` D1, which the user confirmed). The Studio becomes `studio/` with its own `package.json`, `sanity.config.ts`, `sanity.cli.ts`, `schemaTypes/`, and `.env`.

**Removed:** `app/studio/`, root `sanity.config.ts`, root `sanity.cli.ts`, root `sanity/structure.ts`.
**Removed from web `package.json`:** `sanity`, `@sanity/vision`, `styled-components` — embedded-Studio-only dependencies. `next-sanity` and `@sanity/image-url` stay.

### D2 — Studio env uses `SANITY_STUDIO_*`, not `NEXT_PUBLIC_*`.
A standalone Studio is Vite, and only `SANITY_STUDIO_`-prefixed vars reach it. `studio/.env` gets `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`; `studio/.env.example` is committed. The web app keeps reading `NEXT_PUBLIC_SANITY_*` through `sanity/env.ts`, unchanged.

### D3 — Scope is five content types plus their inline objects. Nothing else.
In: `course`, `lesson`, `instructor`, `category` as documents; `module`, `learningOutcome`, `keyPoint`, `resource` as objects.
Out, deferred to their own tasks: the `video` document (section 9 ingestion), the agent context document (section 10), the progress record (section 7), and any `text::semanticSimilarity` or search wiring.

### D4 — Model per `AGENTS.md` section 8, exactly.
- `course`: `title`, `slug`, `summary`, `coverImage` (hotspot), `level` (radio list: beginner/intermediate/advanced), `price` (number), `isPopular` (boolean), `studentCount` (number, display only), `learningOutcomes` (array of `learningOutcome`), `instructor` (reference), `category` (reference), `modules` (array of `module`).
- `module`: object, not a document. `title`, `summary`, `lessons` (array of references to `lesson`). Module and lesson numbers ("Module 5", "Lesson 5.1") are **derived from array order at render time and never stored** — no `number` field.
- `lesson`: document. `title`, `slug`, `videoUrl` (url), `poster` (image), `duration` (number, seconds), `isFreePreview` (boolean), `studentCount` (number), `notes` (Portable Text), `keyPoints` (array of `keyPoint`), `proTip` (text, optional), `resources` (array of `resource`). **No parent-course field** — the course is derived with a reverse reference in GROQ.
- `instructor`: `name`, `slug`, `photo`, `expertise` (array of string), `bio` (Portable Text).
- `category`: `title`, `slug`, `description`.
- `learningOutcome`: `icon` (string, list of named icon keys), `title`, `description`.
- `keyPoint`: `text`.
- `resource`: `type` (radio list), `title`, `description`, `url`.

`defineType` / `defineField` / `defineArrayMember` throughout. Every document and object gets an `@sanity/icons` icon imported from **its own subpath** (`@sanity/icons/Play`) — root named exports were removed in Sanity v5 and fail at bundle time. Every document gets a `preview`.

**A1 — assumption on the `learningOutcome.icon` list and the `resource.type` list.** `AGENTS.md` names the fields but not their values. I read `Design/vertex-course.png` and `Design/vertex-lesson.png` and derive the option values from what the design actually shows. If the images do not settle it, I use a small sensible list and flag it under `Needs your attention` rather than guessing silently.

**A2 — assumption: `duration` is stored in seconds** as a number, formatted for display in the frontend. Storing "12:30" as a string would be presentation, not data.

**A3 — `isPopular` and `isFreePreview` stay booleans**, against the skill's "prefer `options.list`" guidance. Both are genuinely binary display flags with no third state on the horizon, and section 7 calls free preview "a label, not access control". Cheap to widen later.

### D5 — Manual `sanityFetch`, not `defineLive`.
`defineLive` needs a `browserToken` to stream updates, and the dataset is private. Section 5 and 12 forbid any token in the browser, so `defineLive` is not usable here. Instead: a server-only client plus a manual `sanityFetch({ query, params, tags, revalidate })` wrapper over `client.fetch`, using Next's `next: { revalidate, tags }`. Tag-based revalidation is wired later with the Sanity webhook; this task only establishes the helper and the tags.

### D6 — `import 'server-only'` at the top of the client module.
`server-only` is already present in `node_modules`. It makes any accidental client-component import a build error rather than a leaked token. The read token is `SANITY_API_READ_TOKEN`, server-only, no `NEXT_PUBLIC_` prefix.

### D7 — `useCdn: true` by default; `useCdn: false` for `generateStaticParams`.
Per the nextjs reference. The helper exposes an override rather than hardcoding.

### D8 — TypeGen configured, types committed.
`studio/sanity.cli.ts` gets a `typegen` block pointing at the web app: `path: '../{app,components,lib,sanity}/**/*.{ts,tsx}'`, `generates: '../sanity.types.ts'`. A `studio` script `typegen` runs `sanity schemas extract --force && sanity typegen generate`. `sanity.types.ts` is committed (Option A in the reference) and is picked up by the root `tsconfig.json` `include` already. `schema.json` lands in `studio/` and is gitignored.

I do **not** pass `--enforce-required-fields`, since drafts can be invalid and the frontend has to tolerate missing values anyway.

### D9 — Queries live in `sanity/queries.ts`, each with a unique `UPPER_SNAKE` name via `defineQuery`.
Ship exactly the reads the four planned pages need:
- `COURSES_CATALOG_QUERY` — all courses with instructor, category, cover, level, price, popular flag, student count, and a derived lesson count.
- `COURSE_BY_SLUG_QUERY` — one course with learning outcomes, instructor, category, and modules with their lessons resolved (title, slug, duration, free preview).
- `LESSON_BY_SLUG_QUERY` — one lesson with notes, key points, pro tip, resources, plus the parent course derived by reverse reference (`*[_type == "course" && references(^._id)][0]`) and its instructor.
- `INSTRUCTOR_BY_SLUG_QUERY` — one instructor with their courses via reverse reference.
- `CATEGORIES_QUERY` — all categories.
- `COURSE_SLUGS_QUERY` / `LESSON_SLUGS_QUERY` / `INSTRUCTOR_SLUGS_QUERY` — for `generateStaticParams`.

Every array projection includes `_key`. No `...` spreads on documents — explicit projections only, so nothing unintended reaches the client.

### D10 — No content seeding in this task.
The schema and the read path only. Importing real courses, lessons, and instructors is its own task and needs the design copy. This means the queries are type-checked but return empty arrays until content exists.

### D11 — `.env.example` gains the Sanity keys.
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, and `SANITY_API_READ_TOKEN` (server only, commented as such). I do not read or print `.env.local` values.

### D12 — `next.config.ts` gains `images.remotePatterns` for `cdn.sanity.io`.
Required before any `next/image` renders a Sanity asset. Adding it now with the image builder keeps the data layer complete.

### A4 — Out of scope, not touched
Pages, components, the home page, `/design-system`, Clerk, PostHog, video ingestion, the agent context document, progress records, search, Visual Editing / Presentation, draft mode.

## Files to touch

**New — Studio workspace**
- `studio/package.json` — `sanity`, `@sanity/vision`, `@sanity/icons`, `styled-components`, `react`, `react-dom`, `typescript`. Scripts: `dev`, `build`, `deploy`, `deploy-graphql`, `typegen`.
- `studio/sanity.config.ts` — `defineConfig` with `projectId`, `dataset`, `schema`, `structureTool({ structure })`, `visionTool`. No `basePath`.
- `studio/sanity.cli.ts` — `defineCliConfig` with `api` and the `typegen` block from D8.
- `studio/structure.ts` — Content list grouping Courses, Lessons, Instructors, Categories.
- `studio/tsconfig.json`, `studio/.gitignore` (`dist`, `node_modules`, `.env`, `schema.json`), `studio/.env.example`.
- `studio/schemaTypes/index.ts` — exports the `schema` object.
- `studio/schemaTypes/documents/course.ts`, `lesson.ts`, `instructor.ts`, `category.ts`.
- `studio/schemaTypes/objects/module.ts`, `learning-outcome.ts`, `key-point.ts`, `resource.ts`.

**New — web data layer**
- `sanity/client.ts` — `import 'server-only'`, `createClient` from `next-sanity` with `projectId`, `dataset`, `apiVersion`, `useCdn: true`, `token: process.env.SANITY_API_READ_TOKEN`, `perspective: 'published'`.
- `sanity/fetch.ts` — the `sanityFetch` helper (D5, D7).
- `sanity/queries.ts` — the queries in D9.
- `sanity/image.ts` — `@sanity/image-url` builder, `urlForImage(source)`.
- `sanity.types.ts` — generated, committed.

**Modified**
- `package.json` — drop `sanity`, `@sanity/vision`, `styled-components`.
- `.env.example` — add the four Sanity vars.
- `next.config.ts` — add `images.remotePatterns` for `cdn.sanity.io`.
- `.gitignore` — confirm `sanity.types.ts` is **not** ignored.

**Deleted**
- `app/studio/[[...tool]]/page.tsx` (and the empty dirs), root `sanity.config.ts`, root `sanity.cli.ts`, `sanity/structure.ts`.

## Requirements
- `sanity/env.ts` keeps working unchanged for the web app.
- No token, no client, and no query result reaches a client component. `server-only` enforces it.
- No `_id`-encoded relationships. References only, Sanity-generated ids (skill global rule).
- Video stays a URL string on the lesson. No Sanity `file` asset for video (skill Video rule).
- Module and lesson numbering is never stored.
- Lesson stores no parent course.
- Every array projection carries `_key`.
- Kebab-case filenames; each schema file exports one named const matching the filename.

## Security considerations
- `SANITY_API_READ_TOKEN` is server-only and unprefixed. It appears in `.env.local` and `.env.example` (empty) and is read only inside `sanity/client.ts`, which is `server-only`.
- The dataset stays private. No public read path is opened.
- The client is read-only. No write token, no `create`/`patch` anywhere in this task.
- `perspective: 'published'` keeps drafts out of the public read path.
- Studio auth is Sanity's own, unrelated to Clerk. The Studio is not deployed to a public web route.

## Acceptance criteria
1. `studio/` runs standalone on `localhost:3333` and shows Courses, Lessons, Instructors, Categories in the Content pane.
2. A course can be authored end to end in the Studio: pick an instructor and a category, add modules, and reference lessons into each module.
3. `sanity.types.ts` is generated and contains `Course`, `Lesson`, `Instructor`, `Category`, plus a `*_QUERY_RESULT` type for every query in `sanity/queries.ts`.
4. `npx tsc --noEmit` passes at the repo root with the generated types in place.
5. `npm run lint` passes.
6. `npm run build` passes with no Studio route and no Sanity Studio bundle in the web output.
7. No `app/studio` route exists; `curl localhost:3000/studio` 404s.
8. Nothing in `app/` or `components/` imports `sanity/client.ts` from a client component.

## Checks to run
- `npx tsc --noEmit` (repo root)
- `npm run lint` (repo root)
- `npm run build` (repo root) — routes and config changed
- `cd studio && npm run typegen`
- `cd studio && npm run dev` — Studio boots, schema loads with no validation errors
- Studio deploy is **not** run in this task. It is required before the Context MCP will serve the dataset (section 12), but that belongs to the search task. Flagged under `Needs your attention`.

## Manual test steps
1. `npm install` at the repo root, then `cd studio && npm install`.
2. Copy `studio/.env.example` to `studio/.env` and fill `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` with the same values already in the root `.env.local`.
3. Add `SANITY_API_READ_TOKEN` to the root `.env.local` — a **Viewer** token from sanity.io/manage → API → Tokens.
4. `cd studio && npm run dev`. Open `http://localhost:3333`. Confirm the four document types in the Content pane.
5. Create one instructor, one category, one lesson, and one course. On the course, add a module and reference the lesson into it. Confirm the reference pickers list the right documents and that required-field validation fires on an empty title.
6. `cd studio && npm run typegen`. Confirm `sanity.types.ts` at the repo root updates.
7. Back at the root: `npx tsc --noEmit`, `npm run lint`, `npm run build`. All pass.
8. `npm run dev`, then `curl -o /dev/null -w '%{http_code}' http://localhost:3000/studio` → `404`.
