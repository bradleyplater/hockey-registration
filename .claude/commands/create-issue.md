---
description: Draft a GitHub issue from a description, convene a council to pressure-test it, then create it after user approval.
argument-hint: <short description of the issue to create>
---

# Create Issue — `$ARGUMENTS`

You are drafting a single GitHub issue from a user description, running it
through the appropriate council, and creating it in GitHub after approval.

This command **overrides auto-mode's bias against asking clarifying questions**
— you must pause at every gate marked **GATE** before proceeding.

## Inputs

- `$ARGUMENTS` — a short description of the issue to create. If empty, ask
  the user to describe what they want to capture.
- Issue standards: @.claude/rules/github-issue-standards.md
- Council playbooks: `.claude/councils/`
- Persona charter: @.claude/rules/persona-charter.md
- Council response protocol: @.claude/rules/council-protocol.md
- MVP spec: @docs/eiha-rec-hockey-registration-mvp.md

---

## Phase 0 — Scope intake

1. If `$ARGUMENTS` is empty, ask the user: "What should this issue cover?"
2. Read the MVP spec (`docs/eiha-rec-hockey-registration-mvp.md`) and the
   issue standards to orient yourself.
3. Identify the likely functional area: player registration, team registration,
   approval workflow, auth, payments, data model, admin portal, team management,
   UI, infra — or cross-cutting.
4. Do a quick check: does this description map to **in-scope** MVP work? If it
   smells like a Non-Goal or Future Enhancement from §2 of the spec, surface
   that concern immediately and ask the user how to proceed before drafting.

**GATE:** Confirm the area and scope status with the user before drafting.

---

## Phase 1 — Draft the issue

Using the issue standards, write a full draft that includes:

- **Title** — action-oriented, role-framed where natural (`As a <role>, I can
<action> so that <benefit>`, or plain imperative for technical work).
- **Body** — context + the user-story narrative.
- **Story points** — modified Fibonacci (1, 2, 3, 5, 8, 13). If the draft
  would be 5+ points or clearly spans more than one small MR, flag it now as
  a candidate for splitting.
- **Acceptance criteria** — Given/When/Then scenarios covering: happy path,
  key edge/error cases, any non-happy paths called out in the spec (rejection,
  dual-approval ordering, returning-player flows, etc.).
- **Technical notes** — implementation hints grounded in the project stack
  (Next.js App Router, Prisma, PostgreSQL, NextAuth magic-link, Stripe). Flag
  any extensibility requirements from spec §7.4 that are relevant.
- **Labels** — from the taxonomy in the standards file. Pick all that apply.
- **Milestone** — propose one if the functional area maps clearly to an
  existing epic; leave blank if uncertain.

Present the full draft to the user.

**GATE:** Does this draft capture what they meant? Collect any corrections
before moving to the council.

---

## Phase 2 — Council selection

Decide the council composition. Read all files in `.claude/councils/` to
understand what's available. Use `council-issue-creation.md` as the base, with
the panel composition rules defined there.

State your proposed panel and your reasoning in one short paragraph:

- **Always include:** `product-manager`, `backend-engineer`, `data-modeler`,
  `qa-engineer` (the default issue-creation panel).
- **Add `frontend-engineer`** if the issue is UI-heavy or has user-facing
  flow ACs.
- **Add `ux-designer`** if the issue has copy, journey, or accessibility
  concerns.
- **Add `security-engineer`** if the issue touches auth, payments, PII, or
  new endpoints.
- **Add `devx-engineer`** if the issue requires new scripts, env vars, or
  tooling changes.

**GATE:** Show the proposed panel and reasoning. Let the user add or remove
members before you spawn.

---

## Phase 3 — Convene the council

1. State the final panel in one line.
2. Spawn all members **in parallel** in a single message using the briefing
   template from `council-issue-creation.md`. Include:
   - The full draft from Phase 1 (after any Phase 1 gate corrections).
   - The relevant spec section(s) as the source requirement.
   - Any scope hints the user gave.
3. Wait for all members to return their reports.
4. Synthesize per the `council-issue-creation.md` output format:
   - Tally verdicts (any BLOCK stops creation).
   - Group findings by issue section (title, ACs, technical notes, scope,
     size).
   - Propose a concrete rewrite or split where the panel recommends one.
   - Name anything that passed cleanly.

**GATE:** Present the synthesized council verdict and proposed changes. Confirm
the user wants to proceed with the revised draft (or the original if no changes
were recommended).

---

## Phase 4 — Revise and finalize

1. Apply all changes the user accepts from the council synthesis.
2. Present the **final draft** in full — title, body, ACs, story points,
   technical notes, labels, milestone.
3. If the draft is 5+ points or the council recommended splitting, propose a
   concrete decomposition (titles + one-line summaries for each child issue)
   and let the user decide before creating anything.

**GATE:** User must give explicit approval ("yes, create this") before any
GitHub write happens.

---

## Phase 5 — Create in GitHub

1. Confirm the target repo. If not already known, run:
   `gh repo view --json nameWithOwner`
2. Confirm which labels from the draft already exist:
   `gh label list`
   Create any missing labels with a sensible colour before creating the issue.
3. Create the issue:
   ```
   gh issue create \
     --title "<title>" \
     --body "<body>" \
     --label "<label1>" --label "<label2>" \
     [--milestone "<milestone-title>" if one was agreed]
   ```
4. If a split was agreed in Phase 4, create each child issue and then link
   them to the parent using GitHub's sub-issue relationship via the `gh` CLI
   or API.
5. Return the issue URL(s) to the user.

**GATE:** Confirm the issue(s) were created successfully and the URL is correct.

---

## Guardrails

- Never create an issue until the user has given explicit approval in Phase 4.
- Never invent acceptance criteria the description doesn't support — flag the
  gap in Phase 1 or ask at the Phase 1 gate.
- Never create issues for Non-Goals or Future Enhancements from the spec —
  surface the concern and wait for the user's explicit override.
- Never create more than one issue per run without the user approving the split
  in Phase 4.
- If at any phase the description is too vague to draft against, stop and ask
  rather than guessing.
