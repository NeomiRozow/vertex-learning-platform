# Align the Sanity schema with the seeded content

## Goal

The seed data imported into the `production` dataset uses field names and option
values that the committed schema does not define. Studio shows "Unknown field
found" and validation errors. Change the schema (and the web read layer that
mirrors it) so it matches the seeded content exactly. Do not change the data and
do not touch `studio/scripts/seed/*`.

## Decision

The user chose **change the schema**, not transform the data.

## What I read

- `AGENTS.md` sections 5, 6, 8, 12, 13.
- `studio/schemaTypes/documents/{course,lesson,instructor,category}.ts`
- `studio/schemaTypes/objects/{course-module,learning-outcome,key-point,resource}.ts`
- `studio/schemaTypes/index.ts`
- `sanity/lib/queries.ts`
- `studio/scripts/seed/seed.ndjson` (top-level and nested keys per type)
- `grep` over `app/`, `components/`, `lib/`, `sanity/` for consumers of the
  affected fields.

## What I verified in the data

Seed keys per type, compared to schema fields:

| # | Type | Seed | Current schema |
|---|---|---|---|
| F1 | course | `popular` (boolean) | `isPopular` |
| F2 | lesson | `freePreview` (boolean) | `isFreePreview` |
| F3 | lesson | `thumbnail` (image) | `poster` |
| F4 | lesson | `keyPoints`: array of plain strings | array of `keyPoint` objects `{text}` |
| F5 | learningOutcome | `icon` values include `puzzle`, `sparkles`, `workflow` | list lacks all three |
| F6 | resource | `type` value `link` (the only value used) | list lacks `link` |

Matching already (no change): `instructor`, `category`, `module`,
`learningOutcome` field names, `resource` field names, `lesson.notes`
(Portable Text blocks), `lesson.proTip` (plain string, matches `type: 'text'`),
`lesson.summary` (absent in seed, optional in schema).

Blast radius: no page or component reads these fields yet. Only
`sanity/lib/queries.ts` does.

## Files I expect to touch

1. `studio/schemaTypes/documents/course.ts` — rename `isPopular` to `popular`.
2. `studio/schemaTypes/documents/lesson.ts` — rename `isFreePreview` to
   `freePreview`, rename `poster` to `thumbnail` (including the `preview.select.media`),
   change `keyPoints` to an array of `string`.
3. `studio/schemaTypes/objects/learning-outcome.ts` — add `Puzzle/puzzle`,
   `Sparkles/sparkles`, `Workflow/workflow` to the icon option list.
4. `studio/schemaTypes/objects/resource.ts` — add `Link/link` to the type option list.
5. `studio/schemaTypes/objects/key-point.ts` — delete; unreferenced once
   `keyPoints` holds strings.
6. `studio/schemaTypes/index.ts` — drop the `keyPoint` import and registration.
7. `sanity/lib/queries.ts` — `isPopular` to `popular` (4 places, two of them in
   `order(...)`), `isFreePreview` to `freePreview` (2 places), `poster {` to
   `thumbnail {`, and `keyPoints[] {_key, text}` to `keyPoints`.
8. `sanity.types.ts` — regenerated, not hand-edited.

## Decisions and assumptions

- D1: Keep the icon values already in the list (`database`, `cloud`, `terminal`)
  even though the seed does not use them. Removing them is cleanup outside this
  request.
- D2: Keep the existing resource type values for the same reason; only add `link`.
- D3: `keyPoints` becomes `type: 'array', of: [{type: 'string'}]` with
  `options: {layout: 'tags'}` omitted, so Studio renders a plain editable list.
- D4: Delete `key-point.ts` rather than leave a registered but unused object
  type. It only exists to back the field being changed.
- D5: Field titles, descriptions, groups, and validation rules stay as they are.
  Only names, the two option lists, and the `keyPoints` shape change.

## Security considerations

None new. No env, token, client, or route changes. The read token stays server
side and no client boundary moves.

## Acceptance criteria

- A1: Studio shows no "Unknown field found" panel on any course or lesson.
- A2: A course shows the Popular toggle reflecting the seeded value.
- A3: A lesson shows its thumbnail, the Free preview toggle, and Key points as
  an editable list of strings.
- A4: No validation errors on `learningOutcomes[].icon` or `resources[].type`.
- A5: `sanity.types.ts` regenerates with the new field names and query result
  types.
- A6: Web type check, lint, and production build pass.

## Checks to run

From `studio/`:
- `npm run typegen` (extracts `schema.json` and regenerates `../sanity.types.ts`)

From the repo root:
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`

## Manual test steps

1. `cd studio && npm run dev`, open http://localhost:3333.
2. Open **Next.js App Router in Depth**. Confirm no "Unknown field found" panel
   and that the Marketing tab shows Popular switched on.
3. Open the lesson **File-system routing and the app directory**. Confirm the
   thumbnail renders, Free preview is on, and Key points lists three strings.
4. Scroll to Resources on that lesson. Confirm the Type select shows "Link" with
   no validation error.
5. Open the course's "What you'll learn" list. Confirm no icon field shows a
   validation error (the seeded values include `workflow` and `sparkles`).
6. `npm run dev` at the root, open http://localhost:3000 and confirm the home
   page still renders.
