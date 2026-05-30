# GitHub Issue Authoring Standards

These standards govern how requirement documents are decomposed into GitHub work
items. They apply to the `requirements-to-github` skill and the
`requirements-analyzer` / `github-issue-creator` agents.

## How the hierarchy maps onto GitHub

GitHub has no native Epic/Story/Sub-task concept. We map them as:

- **Epic → Milestone.** A coherent capability or workflow that delivers
  user-visible value and spans multiple stories (e.g. "Player Registration",
  "Approval Workflow", "Team Management"). Anchor milestones to the requirement
  doc's major journeys or feature areas.
- **Story → Issue, assigned to its epic's milestone.** A single, independently
  shippable slice of user value.
- **Sub-task → sub-issue of the story's issue.** The MR-sized unit of execution,
  linked to its parent story via GitHub's native sub-issue relationship. A story
  with no sub-tasks is itself the leaf issue.

## Hierarchy & granularity

Decide the depth per requirement based on its complexity — do not force a fixed
depth.

**Guiding principle: smallest sensible ticket.** Default to the smallest unit of
work that still delivers something coherent and independently reviewable. Each
leaf issue (a story with no sub-tasks, or a sub-task) should map to **one small,
easy-to-read merge request** — ideally a change a reviewer can fully understand
in a few minutes. When in doubt, split. A pile of small, clear issues beats a
few big ones.

- **Milestone (epic)** — see mapping above. Spans multiple story issues.
- **Story issue** — must satisfy INVEST (Independent, Negotiable, Valuable,
  Estimable, Small, Testable). Keep the _Small_ deliberately tight: if a story
  would land as more than one reviewable MR, it is too big — either split it into
  multiple story issues or break it into sub-issues (below). If a story can't be
  estimated or tested as written, split it.
- **Sub-issue (sub-task)** — the MR-sized unit of execution. Break a story into
  sub-issues whenever it naturally decomposes into distinct, separately-mergeable
  steps (e.g. "Prisma schema", "API route", "UI form", "Stripe wiring", "tests").
  Each sub-issue should be one small MR. Prefer sub-issues over leaving a story
  large. Only skip sub-issues when the whole story already fits comfortably in a
  single small MR (≈1–2 points).

Rules of thumb:

- **Split aggressively.** A story above ~3 points should almost always be broken
  into sub-issues (or split into smaller stories); a story above ~5 points must
  be. Never leave a 5+ point story as a single undecomposed unit.
- Each leaf issue = one MR. If you can't describe the MR for an issue in a
  sentence, it's probably still too big.
- Don't split so far that an issue has no standalone meaning — a sub-issue must
  still be a self-contained, reviewable change, not a fragment of one.
- Don't create a milestone for a single story — promote it to a standalone story
  issue with no milestone.
- Cross-cutting concerns (auth, payments, data model) usually belong as story
  issues inside the milestone that first needs them, not as their own milestone,
  unless they are large enough to span several milestones.

## Every story issue must include

1. **Title** — concise, action-oriented, role-framed where natural.
   `As a <role>, I can <action> so that <benefit>` is preferred for user stories;
   plain imperative titles are fine for technical/enabler stories.
2. **Body** — context and the user-story narrative.
3. **Acceptance criteria** — Given/When/Then scenarios, or a checklist for
   non-behavioural work. Cover the happy path AND the key edge/error cases
   called out in the requirements (e.g. rejection-and-resubmit, dual-approval
   ordering). Each criterion must be objectively verifiable.
4. **Story point estimate** — modified Fibonacci: 1, 2, 3, 5, 8, 13. Estimate
   relative effort/complexity, not hours. GitHub has no points field, so record
   the estimate as a line in the issue body (e.g. `**Story points:** 3`).
   Because issues target one small MR each, most leaf issues should land at
   **1–3 points**; 5 means "decompose into sub-issues"; 8+ means "split into
   multiple stories". Treat anything above 3 as a prompt to break the work down
   further rather than a valid final size.
5. **Technical notes** — implementation hints grounded in the project stack
   (Next.js App Router, PostgreSQL, Prisma, NextAuth/Auth.js magic link, Stripe).
   Flag extensibility requirements (e.g. role/permission models built for future
   extension) where the requirements demand them.
6. **Labels** — tag by functional area for filtering (see taxonomy below).

## Label taxonomy

Apply one or more area labels per issue as GitHub labels. Extend as needed, but
reuse these:

- `auth` — accounts, magic-link login, sessions
- `payments` — Stripe integration, fees
- `player-registration` — new & returning player journeys
- `team-registration` — team creation & onboarding
- `team-management` — roster, team admin, permissions
- `approval-workflow` — dual-approval states & transitions
- `admin-portal` — association admin features
- `data-model` — Prisma schema, migrations, seasons
- `ui` — pages, forms, portals
- `infra` — hosting, env, email service, DB provisioning

## Issue body format

Use a consistent body layout so issues are scannable:

```
<user-story narrative — context and the As a / I can / so that line>

**Story points:** <n>

## Acceptance criteria

Scenario: <short name>
  Given <precondition>
  When <action>
  Then <expected outcome>

## Technical notes
<implementation hints grounded in the project stack>
```

Use multiple scenarios per issue when there are distinct paths. Prefer concrete
values from the requirements (e.g. season `25/26`, Cat A/B/C/Z/ZZ, states
Pending / Team Approved / Association Approved / Approved / Rejected).

## Scope discipline

- Only create issues for in-scope (MVP / requested) work. Items the requirement
  doc marks Non-Goals or Future Enhancements must NOT become issues — if they
  are load-bearing for an in-scope story, note them in that story's technical
  notes instead.
- Where the requirements say a feature is "stubbed" (e.g. photo/ID upload),
  create an issue for the stubbed behaviour and state explicitly in the AC that
  the file is not persisted.

## Before creating anything in GitHub

- The full breakdown MUST be presented to the user for review and explicit
  approval before any issue is created. Never write to GitHub unprompted.
- Confirm the target **repository** (`owner/repo`). Confirm which area labels
  already exist in that repo and which need creating.
