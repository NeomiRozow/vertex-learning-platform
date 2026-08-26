# PostHog Self-driving setup — Vertex

## Summary

PostHog Self-driving has been configured for Vertex, the AI-powered learning platform. Session Replay, Error Tracking, and Support (Conversations) products were enabled; seven signal sources were wired up; GitHub and GitHub Issues were connected; a seven-scout troop (five built-in specialists and two custom scouts) was tuned; and two Replay Vision scanners were armed to watch course and lesson sessions. Findings will start appearing in the [Self-driving inbox](https://eu.posthog.com/project/257195/inbox) within ~30 minutes.

---

## AI data processing

**Approved.** Organization-level AI data processing consent was confirmed before this run began.

---

## GitHub

**Connected during this run.** GitHub App installed by Neomi Rozow (integration id: 80312, account: NeomiRozow). One repository accessible: `NeomiRozow/vertex-learning-platform`.

---

## Products enabled

| Product | Status | Notes |
|---|---|---|
| Session Replay | **Already enabled** | Server-side toggle was already ON. `posthog.init` has no `disable_session_recording` override — clean. |
| Error Tracking | **Enabled** | `capture_exceptions: true` already set in `instrumentation-client.ts` — client side aligned. |
| Support (Conversations) | **Enabled** | Tickets only arrive once an inbound channel is connected — see Follow-ups. |

---

## Signal sources

| Source product | Source type | Action |
|---|---|---|
| `signals_scout` | `cross_source_issue` | **Skipped** — scout gate is ON by default; no row needed |
| `health_checks` | `health_issue` | **Enabled** |
| `error_tracking` | `issue_created` | **Enabled** |
| `error_tracking` | `issue_reopened` | **Enabled** |
| `error_tracking` | `issue_spiking` | **Enabled** |
| `session_replay` | `session_analysis_cluster` | **Enabled** (sample rate: 10%) |
| `conversations` | `ticket` | **Enabled** — dormant until an inbound channel is connected |
| `github` | `issue` | **Enabled** — connected to `NeomiRozow/vertex-learning-platform` |
| `replay_vision` | *(n/a)* | **Skipped** — Replay Vision scanners are self-authorizing via `emits_signals`; no source row needed |

---

## Connected tools

| Tool | Status |
|---|---|
| **GitHub Issues** | Connected by this setup — warehouse source id `01a03e1f-8d18-0000-2a7f-b13b32860e0b`, repo `NeomiRozow/vertex-learning-platform`, first sync started. Only the `issues` table is syncing; additional tables (pull_requests, etc.) can be enabled in PostHog → Data management → Sources. |
| Linear, Jira, Sentry, Zendesk, others | Not used — not selected |

---

## Scout troop

**Run budget:** 100 runs/day during early access. 0 runs used today at time of setup.
**Banner:** *"Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."*

### Enabled (7 scouts)

| Scout | Why enabled |
|---|---|
| `signals-scout-general` | Always on — watches cross-product correlations and surfaces no specialist covers |
| `signals-scout-product-analytics` | Active product-event instrumentation (`lesson_selected`, `search_submitted`, `identify`) |
| `signals-scout-web-analytics` | Next.js web app with page views, traffic channels, and landing pages |
| `signals-scout-web-vitals` | Core Web Vitals matter for video/content UX; posthog-js defaults capture `$web_vitals` |
| `signals-scout-observability-gaps` | Cross-product; catches event volumes with no insight/dashboard coverage — valuable on a new project |
| `signals-scout-search-engagement` | **Custom** — watches `search_submitted` rate vs `$pageview` for AI search feature degradation |
| `signals-scout-lesson-engagement` | **Custom** — watches `lesson_selected` rate vs course page views for catalog/lesson friction |

### Disabled (22 scouts)

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Covered by native error_tracking source — enabling it would duplicate findings |
| `signals-scout-session-replay` | Covered by native session_replay source — enabling it would duplicate findings |
| `signals-scout-ai-observability` | No `$ai_*` events or LLM SDK in use |
| `signals-scout-anomaly-detection` | Not in top used surfaces; can enable if dashboards grow |
| `signals-scout-apm` | No distributed tracing / OpenTelemetry |
| `signals-scout-conversations` | Conversations product just enabled, no data yet — can enable once support tickets flow |
| `signals-scout-csp-violations` | No CSP reporting configured |
| `signals-scout-customer-analytics` | No B2B account/group analytics |
| `signals-scout-data-pipelines` | No CDP destinations or batch exports |
| `signals-scout-data-warehouse` | GitHub Issues source just connected — can enable once syncs are established |
| `signals-scout-experiments` | No A/B experiments in use |
| `signals-scout-feature-flags` | No feature flags in use |
| `signals-scout-health-checks` | Health checks covered by the native health_checks source |
| `signals-scout-inbox-validation` | Fresh setup — no shipped fixes to validate yet |
| `signals-scout-insight-alerts` | No insight alerts configured |
| `signals-scout-logs` | PostHog logs product not in use |
| `signals-scout-mcp-tool-calls` | No `$mcp_tool_call` telemetry |
| `signals-scout-replay-vision` | Scanners created in this run have no historical observations yet; enable once data accumulates |
| `signals-scout-revenue-analytics` | No payment SDK or revenue events |
| `signals-scout-skills-store` | No skills-store usage to monitor |
| `signals-scout-surveys` | No surveys in use |
| `signals-scout-tasks` | No PostHog Tasks usage |

---

## Custom scouts

Two custom scouts were created and approved. If a scout becomes noisy, go to PostHog → Self-driving → Scouts, find the scout, and set its `emit` to off — it will keep running but write nothing to the inbox until you re-enable it.

### `signals-scout-search-engagement`

- **Watches:** `search_submitted` event rate relative to `$pageview` count — the search engagement rate.
- **Discriminator:** A >25% drop in `search_submitted` / `$pageview` ratio vs the 7-day baseline, without a proportional traffic drop. Raw search volume falling with traffic is a web-analytics issue; a ratio drop while traffic holds is a search feature issue.
- **Why no built-in covers it:** `product-analytics` watches saved funnels/retention flows — it has nothing to watch until funnels are saved. `web-analytics` watches traffic channels, not feature-specific event rates. `general` sweeps cross-product but won't deep-dive on the search engagement ratio.

### `signals-scout-lesson-engagement`

- **Watches:** `lesson_selected` event rate relative to `$pageview` count on course pages.
- **Discriminator:** A >25% drop in `lesson_selected` / `$pageview` ratio vs the 7-day baseline, while course page traffic holds — indicates catalog or course page friction preventing learners from selecting lessons.
- **Why no built-in covers it:** Same gap as above — `product-analytics` needs saved funnels; `observability-gaps` would flag that `lesson_selected` has no insight coverage but doesn't watch the metric trend itself.

**Surfaces ruled out:**
- Auth funnel: no explicit sign-up/sign-in events captured yet; too thin to watch.
- Lesson completion: `lesson_completed` and video events not yet instrumented (planned per AGENTS.md) — revisit once those events are in place.

---

## Replay Vision scanners

Replay Vision scanners are LLMs that watch individual session recordings on a schedule and push what they find to the Self-driving inbox. Each finding arrives at half weight; a finding needs corroboration from another session before it's promoted into a full inbox report. These are the only things in this setup that spend Replay Vision quota.

The project has no recordings yet — the scanners are armed and will start working the day recordings begin.

| Scanner | Type | What it watches | Query scope | Sampling | Est. credits/month |
|---|---|---|---|---|---|
| **Course and lesson breakage** | Monitor | Video player failures, blank lesson pages, search errors, broken lesson links, sign-in redirect failures | URL contains `/courses` | 50% of matching sessions | 0 (no recordings yet) |
| **Learner frustration** | Monitor | Rage-clicks on lesson links, search submit, video play buttons; catalog hunting | Sessions with a `$rageclick` event | 100% of matching sessions | 0 (no recordings yet) |

The two scanners' queries are intentionally disjoint: the breakage monitor owns *where* (URL scope on `/courses`); the frustration monitor owns *what they did* (`$rageclick` gate only). This prevents the same session being scanned by both with overlapping questions, which would let a single defect self-corroborate.

---

## Follow-ups

- [ ] **Connect a support channel** — Support (Conversations) is enabled but tickets won't arrive in the inbox until you connect an inbound channel. Go to PostHog → Support → Settings to connect email, inbox, or Slack.
- [ ] **Instrument remaining planned events** — AGENTS.md calls for `catalog_viewed`, `lesson_viewed`, `video_started`, `video_progress`, `lesson_completed`. Once these land, save funnel and retention insights in PostHog — the `product-analytics` scout will then watch them automatically.
- [ ] **Enable `signals-scout-replay-vision`** — Once Replay Vision scanners have accumulated observations (typically a few days after recordings begin), enable this scout from PostHog so it can surface aggregate trends across scanner findings.
- [ ] **Enable `signals-scout-data-warehouse`** — Once GitHub Issues syncs are running cleanly and you have more warehouse sources, enable this scout to watch import health.
- [ ] **Enable `signals-scout-conversations`** — Once a support inbound channel is connected and `$conversation_*` events are flowing, enable this scout to watch support-delivery regressions.
- [ ] **Save product analytics insights** — The `product-analytics` scout watches saved funnel, retention, lifecycle, and stickiness insights. Create at least one (e.g., lesson_selected retention or a search-to-lesson funnel) so it has something to watch.

---

## What happens next

The scout coordinator picks up fresh configs within ~30 minutes. Scout runs draw from the project's daily budget (100 runs/day during early access). Findings cluster into reports in the [Self-driving inbox](https://eu.posthog.com/project/257195/inbox). Immediately-actionable reports can start coding tasks automatically.
