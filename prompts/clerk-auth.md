# Implementation Prompt — Clerk Authentication

## Goal
Wire Clerk authentication into the Vertex Next.js app at the repo root. Scope is setup plus visible auth controls: provider, proxy, env, and sign-in / sign-up / signed-in controls in the site header. No protected routes, no progress records, no user sync. Browsing stays fully public.

## Skills and docs read
- `AGENTS.md` — sections 2 (loop), 5 (structure, server/client boundaries), 6 (stack), 7 (Clerk decisions), 12 (secret-key rule), 13 (checks).
- Clerk setup skill (the `/clerk` install instructions supplied in this session).
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` — this Next version's request-interception convention.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/middleware.md` — confirms `middleware.ts` is deprecated in Next 16 and renamed to `proxy.ts`.
- No Sanity skill applies: this task touches auth only.

## Code inspected
- `package.json` — Next `16.3.2`, React `19.2.8`, Tailwind v4, npm (`package-lock.json`). No Clerk dependency yet. Scripts: `dev`, `build`, `start`, `lint`. **No `typecheck` script.**
- `app/layout.tsx` — `RootLayout` is a server component. Inter + Playfair as CSS vars on `<html>`; `<body className="min-h-full flex flex-col bg-canvas text-neutral-900">` renders `{children}` directly. Nothing wraps the tree today.
- `components/home/site-header.tsx` — server component. `NavBar` with `Courses` / `My Learning`, and an `actions` slot holding a bell button, a placeholder `Avatar()` (48px neutral-100 circle with `UserFilledIcon`), and `MobileMenu`. The `Avatar` doc comment already names Clerk as its replacement.
- `components/ui/navigation.tsx` — `NavBar` renders `actions` right-aligned in a `flex items-center gap-5` div.
- `components/ui/button.tsx` — `buttonClasses(variant, size)` helper; variants `primary|secondary|tertiary|text`, sizes `lg|md|xl`.
- `app/page.tsx`, `app/design-system/page.tsx` — the only routes. No `proxy.ts`, no `middleware.ts`, no `.env*` file, no `.env.example`, no `components.json` (shadcn is not in use, so skill step 8 does not apply).
- `tsconfig.json` — `@/*` maps to the repo root.

## Decisions and assumptions
- **D1 — Install at the repo root, not in a `web/` workspace.** `AGENTS.md` section 5 describes a separate web workspace, but the app currently lives at the root (`app/`, `components/`, `lib/`). User confirmed the root. The split is a later refactor, out of scope here.
- **D2 — Manual install over the Clerk CLI.** `clerk auth login` needs an interactive browser handshake this session cannot drive. Instead: the user pastes the publishable and secret keys from the Clerk Dashboard into `.env.local`, and I run `npm install @clerk/nextjs` and write the provider, proxy, and header wiring by hand. Same end state. Cost: no `clerk doctor` verification step, so verification is the type check, the production build, and a real sign-up in the browser.
- **D3 — `proxy.ts`, not `middleware.ts`.** Next 16 deprecated `middleware.ts` and renamed it to `proxy.ts`. The file exports `clerkMiddleware()` from `@clerk/nextjs/server` as `proxy`, at the repo root beside `app/`.
- **D4 — The matcher includes `'/__clerk/:path*'`** after `'/(api|trpc)(.*)'`, per the Clerk skill's Next.js rule.
- **D5 — `clerkMiddleware()` runs with no protection rules.** `AGENTS.md` section 7: browsing is public, and only what a feature marks protected gets gated. Nothing is marked protected yet. The proxy establishes the auth context and the Clerk handshake routes, and protects nothing. `createRouteMatcher` + `auth.protect()` come later with My Learning and progress.
- **D6 — `ClerkProvider` goes inside `<body>`,** wrapping `{children}` in `app/layout.tsx`, not around `<html>`. Keeps the font vars and the body layout classes untouched.
- **D7 — Header controls replace the placeholder `Avatar`, and only that.** Signed out: a `text`-variant `Sign in` and a `primary`/`md` `Sign up`. Signed in: Clerk's `UserButton`, sized to the existing 48px circle via `appearance`. The bell and `MobileMenu` are unchanged. This keeps the wiring inside the existing header rather than adding a parallel component, matching the home-page prompt's D3.
- **D8 — Modal sign-in and sign-up, no dedicated auth routes.** `<SignInButton mode="modal">` / `<SignUpButton mode="modal">` means no `app/sign-in/[[...sign-in]]` catch-all routes to build and no design reference to invent. There is no reference image for an auth page, and `AGENTS.md` section 3 forbids designing UI. If the user wants hosted auth pages later, that is a separate task with a reference.
- **D9 — `.env.example` is committed** as the canonical env list (`AGENTS.md` section 12), holding the two Clerk keys with empty values. `.env.local` holds the real values and is gitignored. I do not read or print `.env.local`.
- **D10 — No `typecheck` script exists.** I run `npx tsc --noEmit` rather than adding a script, since adding one is scope the request did not ask for.
- **A1 — Assumption: which Clerk sign-out/sign-in component API this version ships.** The skill shows `<Show when="signed-out">`; older Clerk ships `<SignedIn>` / `<SignedOut>`. I verify against the installed `@clerk/nextjs` type definitions at implementation time and use whichever it actually exports. Not guessed.
- **A2 — Assumption: `clerkMiddleware()` is compatible with the `proxy.ts` filename in Next 16.** The function is filename-agnostic, but if `@clerk/nextjs` 16-support is incomplete I fall back to `middleware.ts` (still supported, deprecated) and flag it. Verified by the build.
- **A3 — Assumption: `UserButton` styling.** The reference home design shows a plain 48px circular avatar. I match that size and border via Clerk's `appearance` prop rather than restyling the design. Exact visual parity with the reference photo is not achievable — Clerk renders the real user's image or initials.
- **A4 — Out of scope, not touched:** progress records, Sanity, PostHog, the My Learning page, protected routes, user webhooks/sync, organizations, billing, `/design-system`, and the home page layout.

## Files to touch
- `.env.example` — new, committed. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=` and `CLERK_SECRET_KEY=`.
- `.gitignore` — confirm `.env*` is ignored while `.env.example` is not; adjust only if it is wrong.
- `package.json` / `package-lock.json` — add `@clerk/nextjs`.
- `proxy.ts` — new, repo root. `clerkMiddleware()` plus the matcher.
- `app/layout.tsx` — wrap `{children}` in `ClerkProvider` inside `<body>`.
- `components/home/site-header.tsx` — replace the placeholder `Avatar` with the Clerk controls.

## Requirements
1. `npm install @clerk/nextjs` (not `@clerk/clerk-react`).
2. `proxy.ts` at the repo root exports `clerkMiddleware()` as `proxy`, with a `config.matcher` that skips `_next` and static assets, and includes `'/(api|trpc)(.*)'` then `'/__clerk/:path*'`.
3. `ClerkProvider` wraps `{children}` inside `<body>` in `app/layout.tsx`.
4. The header shows sign-in and sign-up when signed out, and a user button when signed in, using the components the installed package actually exports.
5. Any `auth()` call is awaited (Next 15+ async `auth()`). This task adds none, but the rule holds for anything I write.
6. Every page stays publicly reachable. No route is gated.

## Security considerations
- `CLERK_SECRET_KEY` is server-only. It never appears in a client component, a `NEXT_PUBLIC_` var, this prompt, or any log. Only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` reaches the browser.
- I do not read, print, or echo `.env.local`. The user creates it from the Clerk Dashboard.
- `.env.example` carries key *names* with empty values, never values.
- Auth gating, when it arrives, lives in `proxy.ts` on the server — never in client code.
- No Sanity token, write token, or PostHog private key is introduced by this task.

## Acceptance criteria
- `npx tsc --noEmit` passes.
- `npm run lint` passes.
- `npm run build` succeeds (routes and server config changed, so a build is required by `AGENTS.md` section 13).
- `npm run dev` boots with no Clerk key or middleware warnings in the terminal.
- `/` renders the header with `Sign in` and `Sign up` while signed out, and the existing layout is otherwise pixel-unchanged.
- Signing up through the modal succeeds and the header swaps to the user button.
- Reloading `/` while signed in keeps the user button (session persists).
- `/design-system` and `/` still render for a signed-out visitor. Nothing is gated.
- `.env.example` is committed; `.env.local` is not tracked by git.

## Checks to run
```bash
npx tsc --noEmit
npm run lint
npm run build
npm run dev
git status --short          # confirm .env.local is untracked
```

## Manual test steps
1. Create `.env.local` at the repo root with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from https://dashboard.clerk.com (app `app_3IP7UIbQ7fMDszbOY2PcTYMNBn5`) → Configure → API Keys → Next.js tab.
2. Run `npm run dev` and open http://localhost:3000.
3. Confirm the header shows `Sign in` and `Sign up` on the right, with the bell still to their left.
4. Click `Sign up`. Complete the modal with a real email and verify the code.
5. Confirm the modal closes and the header now shows the circular user button.
6. Reload the page. Confirm the user button is still there.
7. Click the user button → `Sign out`. Confirm the header returns to `Sign in` / `Sign up`.
8. Visit http://localhost:3000/design-system while signed out. Confirm it loads — nothing is gated.
9. Narrow the browser below 768px. Confirm the auth controls and the hamburger menu still fit and the header does not wrap.
10. In the Clerk Dashboard, confirm the new user appears under Users.
