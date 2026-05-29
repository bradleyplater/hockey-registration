---
description: Take a GitHub issue and drive it through review → council selection → scope check → clarifying Q&A → implementation (with incremental commits) → documentation → MR.
argument-hint: <issue-number-or-url>
---

# Complete Issue — `$ARGUMENTS`

You are driving a GitHub issue from "open" to "MR raised" through a defined,
gated workflow. This command **overrides auto-mode's bias against asking
clarifying questions** — the user has explicitly said "make no assumptions".
You must pause for input at every gate marked **GATE**.

## Inputs

- `$ARGUMENTS` — a GitHub issue number (e.g. `42`) or URL. If empty, ask the
  user which issue to work on.
- The councils that may be convened live at `.claude/councils/council-*.md`.
- Persona contract: `.claude/rules/persona-charter.md`. Council response
  protocol: `.claude/rules/council-protocol.md`. Issue standards:
  `.claude/rules/github-issue-standards.md`.

## Hard rules across all phases

- **Commit incrementally.** A logical chunk is a commit (e.g. "scaffold prisma
  model", "add server action", "wire up form", "add tests"). Do not batch a
  whole MR into one commit. Commit messages: short imperative subject, body
  only when the _why_ is non-obvious. Always run `git status` and stage by
  name — never `git add -A`.
- **Never skip hooks** (`--no-verify`) unless the user explicitly says so.
- **Run typecheck / lint / tests** after each meaningful chunk, before
  committing. If they fail, fix before moving on.
- **Make no assumptions on intent.** When there's ambiguity in the issue or
  the spec, use `AskUserQuestion` — don't infer.
- **State what you're about to do at each phase boundary** so the user can
  redirect.

---

## Status transitions

Move the issue through these statuses at the phase boundaries below using
the GitHub Projects API (`gh project item-edit`). Status values:

| Status        | When to set                                            |
| ------------- | ------------------------------------------------------ |
| `Ready`       | End of Phase 1, after the summary GATE passes.         |
| `In Progress` | Start of Phase 5, immediately before the first commit. |
| `In Review`   | End of Phase 8, immediately after the PR is opened.    |

> **Note:** `Backlog` (default for new issues) and `Done` (set on merge) are
> not managed by this command.

To update the status, find the issue's project item ID and field ID, then run:
`gh project item-edit --id <item-id> --field-id <field-id> --project-id <project-id> --single-select-option-id <option-id>`

Use `gh project item-list <project-number> --owner <owner>` to find the item,
and `gh project field-list <project-number> --owner <owner>` to find the
Status field and its option IDs. If the issue is not linked to a project or
the field cannot be updated programmatically, note it to the user and continue.

---

## Phase 0 — Preflight

1. Resolve `$ARGUMENTS` to an issue number; if missing, ask.
2. `git status` — confirm clean working tree. If not clean, stop and ask the
   user how to handle the existing changes.
3. `git branch --show-current` — confirm we are on `main`. If not, ask before
   switching.
4. `git fetch origin && git pull --ff-only` so we branch off the latest main.

**GATE:** report the issue we're about to start and confirm we're cleared to
proceed.

---

## Phase 1 — Review the issue

1. Fetch the issue:
   `gh issue view <n> --json number,title,body,labels,milestone,assignees,state,url,comments`
2. Also fetch any linked sub-issues / parent issue if present.
3. Produce a short summary to the user covering:
   - Title, labels, milestone, current state.
   - The user-story narrative and acceptance criteria.
   - Any comments that change the scope or add context.
   - Linked issues (parent/children).
4. Note any obvious ambiguities — do not resolve them yet, save them for
   Phase 4.

**GATE:** confirm the summary matches the user's mental model before moving on.
**Status transition:** move the issue to `Ready` after this gate passes.

---

## Phase 2 — Council selection

Decide which council(s) need to be convened to advise on this issue. The
council files are at `.claude/councils/`.

Use this guidance, but always state your reasoning and let the user adjust:

- **System-level / structural decision** (data + server + UI together with a
  non-trivial shape choice; touches an extensibility hook from spec §7.4;
  sets a lasting precedent) → `council-architecture.md` **first**, then any
  layer councils to flesh out the chosen direction.
- **Backend-heavy** (server actions, Prisma, transactions, Stripe, NextAuth)
  → `council-backend.md`
- **Frontend-heavy** (pages, components, forms, UX flow)
  → `council-frontend.md`
- **Cross-cutting tactical work** (touches both layers but the structural
  shape is already settled) → both layer councils, no architecture council.
- **Scope feels off / issue may need decomposition** → start with
  `council-issue-creation.md` in Phase 3 instead of (or before) the design
  councils.
- **Trivial / mechanical** (one-line config, a typo fix) → no council needed.
  Say so explicitly and skip ahead.

Order matters when multiple councils are convened: architecture sets the
shape, layer councils fill it in. Don't run them in parallel — the layer
councils need the architecture verdict as input.

If a council is needed, convene it now per the council file's playbook:
state the panel, spawn all members in **parallel** with the briefing template,
then synthesize.

**GATE:** present the council's synthesized verdict (or "no council needed,
here's why") and confirm the user is happy to proceed on this direction.

---

## Phase 3 — Scope check

Hold the issue up against `.claude/rules/github-issue-standards.md`. Specifically:

- Is the leaf issue **one small MR**? Standards say leaf issues should be
  1–3 points; 5+ means decompose.
- Are the acceptance criteria verifiable and complete?
- Are non-happy paths (rejection-and-resubmit, dual approval, returning
  player, etc.) covered if relevant?

### If the scope is appropriate

State that explicitly and move to Phase 4.

### If the scope is NOT appropriate — pivot to a ticket creation session

1. Convene `council-issue-creation.md` on the current issue draft.
2. Propose a concrete decomposition: titles, narratives, ACs, points, labels.
3. Confirm with the user.
4. Use the `requirements-to-github` skill to create the sub-issues / split
   issues in GitHub, wired to the parent.
5. **Stop this run.** Tell the user to re-invoke `/complete-issue` on a
   specific child issue. Do not silently keep going — the implementation
   workflow assumes a properly-scoped leaf.

**GATE (either branch):** confirm scope decision before proceeding.

---

## Phase 4 — Clarifying Q&A (no assumptions)

For every ambiguity that affects implementation — names, behaviors, error
states, edge cases, copy, where files live, where decisions are recorded —
**use `AskUserQuestion`**. Batch related questions together; do not
overwhelm the user with one-at-a-time prompts.

Cover at minimum:

- Anything the spec is silent on that this work needs to decide.
- Any conflict between the issue body, comments, spec, and council output.
- Naming and file location decisions that aren't obvious from the codebase.
- Test strategy for this issue (unit / integration / E2E mix).
- Where architectural decisions should be documented (Phase 6).

When you have answers to everything, restate the agreed plan in one
paragraph.

**GATE:** the user confirms "yes, you understand the work" before any code
is written.

---

## Phase 5 — Implement (with incremental commits)

**Status transition:** move the issue to `In Progress` now, before the first commit.

1. **Branch.** Create and switch:
   `git checkout -b issue-<n>-<short-slug>`
2. **Plan.** Use `TaskCreate` to lay out the chunks you'll commit
   incrementally. Mark each `in_progress` when you start it and `completed`
   the moment it's done. Don't batch.
3. **Implement chunk by chunk.** For each chunk:
   - Make the change.
   - Run typecheck / lint / the relevant test command. Fix what's broken.
   - `git status` → stage by name → commit. Short imperative subject. The
     body explains _why_ if non-obvious; otherwise omit.
4. **Tests.** Every chunk that adds behavior should add or update a test
   that would fail if the behavior regressed. Do not defer all tests to the
   end.
5. **Check against ACs.** Before declaring implementation done, walk through
   each acceptance criterion and confirm — explicitly, in writing back to the
   user — that it's exercised by the code and a test.

**GATE:** report what was implemented, what's tested, and what's left (if
anything) before moving on.

---

## Phase 6 — Document important things

For anything in this implementation that future-you would want explained:

- **Architectural decisions** — if you made a non-obvious design choice
  (e.g. "registration state machine lives on the registration row, not the
  player"), record it. Default location is `docs/decisions/` as an ADR-style
  short file (`NNNN-title.md`); if the project doesn't have that folder yet,
  ask the user before creating it.
- **README / setup changes** — if you added an env var, a script, a
  migration step, update the relevant doc.
- **Code comments** — only where the _why_ is non-obvious. Do not narrate
  _what_ the code does. Per project rules: most code needs no comments.

Commit docs as their own chunk.

**GATE:** report what was documented and confirm before the pre-PR review.

---

## Phase 7 — Pre-PR self-review

Convene `council-mr-review.md` on the **local branch diff** before pushing.
This catches what the human reviewer would catch, while changes are still
cheap to make.

1. Get the diff: `git diff main...HEAD` (or against the relevant base).
2. Convene `council-mr-review.md` per its playbook. Brief members with the
   diff, the linked issue + ACs, and the council outputs from Phase 2 (so
   members aren't surprised by deliberate design choices).
3. Triage findings:
   - **Blockers** — fix before push. New chunk, new commit.
   - **Majors** — fix if cheap; otherwise capture in the PR description's
     "Decisions / trade-offs taken" or "Out of scope" section with reasoning.
   - **Minors / nits** — ignore unless they overlap with something you were
     already going to touch.
4. Re-run the diff after fixes and confirm verdict moved to APPROVE or
   APPROVE-WITH-CHANGES.

**Skip this phase only if** the change is genuinely mechanical (one-line
config, typo fix, rename). Say so explicitly and move on.

**GATE:** report the synthesized verdict, what you fixed, and what you're
deferring (with rationale) before pushing.

---

## Phase 8 — Raise the MR

1. Push the branch: `git push -u origin <branch>`
2. Open the PR with `gh pr create`. The body must include:

```
## Summary
<1–3 bullets — what changed, in plain language>

## Issue
Closes #<n>

## Why
<the motivation, taken from the issue + any decisions made during clarification>

## How it was built
<short walkthrough of the approach — server action, schema change, etc.>

## Acceptance criteria check
- [x] <AC 1> — covered by <test name / file>
- [x] <AC 2> — covered by <test name / file>

## Decisions / trade-offs taken
<bullet list of choices the reviewer should know about — link to any ADR file>

## How to test
<bulleted steps a reviewer can run locally>

## Out of scope
<anything explicitly deferred to a follow-up, with issue links if filed>
```

3. Return the PR URL to the user.

**Status transition:** move the issue to `In Review` now.
**GATE:** confirm the PR was opened successfully and the URL is correct. If
CI is configured, mention that you'll let CI run rather than polling it.

---

## Guardrails

- Never close the issue or merge the PR from this command. Reviewer-driven
  merge is intentional.
- Never force-push to `main`. Never `--no-verify`.
- Never invent acceptance criteria the issue doesn't state — flag the gap in
  Phase 4 instead.
- If at any phase you find the issue is wrong (contradicts the spec, isn't
  actually shippable), stop and surface the conflict. Don't paper over it.
