---
name: council-issue-creation
description: Convene a council to pressure-test a draft GitHub issue (or set of issues) before creating it — product fit, technical feasibility, acceptance-criteria coverage, scope discipline. Pairs naturally with the requirements-to-github skill.
---

# Council — Issue Creation

Convene a council to review one or more draft GitHub issues _before_ they are
created. The goal is to catch scope drift, gaps in acceptance criteria, and
technical naivety while changes are still cheap.

This council does NOT create GitHub issues — it advises on the drafts. Issue
creation itself lives in the `requirements-to-github` skill.

Shared council rules:

- Persona charter: @.claude/rules/persona-charter.md
- Response protocol: @.claude/rules/council-protocol.md

Authoring standards the council enforces: @.claude/rules/github-issue-standards.md

## When to use this council

- After `requirements-analyzer` has produced a breakdown and _before_ you ask
  the user to approve it for creation.
- When the user has hand-written one or more draft issues and wants a sanity
  check.
- When refining an existing open issue that the user feels isn't quite right.

## Inputs to resolve before convening

1. **The draft issue(s).** Either pasted by the user or the breakdown returned
   from `requirements-analyzer`. The council needs the full draft, not a
   summary.
2. **The source requirement** (spec section, doc, or linked epic) so members
   can judge fit.
3. **Scope hints.** What the user is and isn't trying to ship in this slice.

## Panel composition

**Default panel:**

- `product-manager` — scope, MVP fit, traceability to the spec.
- `backend-engineer` — server-side feasibility, hidden complexity, integration
  surface.
- `data-modeler` — schema/data implications hiding behind a user-friendly
  acceptance criterion.
- `qa-engineer` — AC coverage, missing edge cases, testability.

**Conditionally added:**

- `frontend-engineer` — if the issue is UI-heavy or has user-facing flow ACs.
- `ux-designer` — if the issue has copy, journey, or accessibility concerns.
- `security-engineer` — if the issue touches auth, payments, PII, or new
  endpoints.
- `devx-engineer` — if the issue requires new scripts, env vars, or tooling.

State the final panel in one line before spawning.

## Briefing template — sent to each member

Spawn all members in **parallel** in a single message.

```
You are convened as an issue-creation council member.

DRAFT ISSUE(S)
<paste the full draft — title, narrative, story points, acceptance criteria,
technical notes, labels — exactly as it would be created>

SOURCE REQUIREMENT
<paste the spec section / linked doc reference>

SCOPE HINTS FROM USER
<verbatim, or "none">

AUTHORING STANDARDS
The issue must comply with .claude/rules/github-issue-standards.md.
Smallest-sensible-ticket is the core principle.

YOUR LENS
You are the <persona-name>. Apply the lens defined in your system prompt and
the persona charter. Respond strictly in the council response protocol format.
```

## Specific things every member should check (regardless of lens)

These are issue-quality concerns the standards file demands. Surface them in
findings:

- **Is the ticket too big?** If a leaf issue can't be one small MR, it should
  be split. 5+ points means decompose.
- **Are ACs verifiable?** Each Given/When/Then must be objectively testable —
  no "works well".
- **Are non-happy paths covered?** Rejection-and-resubmit, dual-approval
  parallelism, returning-player edge cases — call out gaps.
- **Are Non-Goals / Future Enhancements creeping in?** Flag any AC that
  implements something the spec marks out of scope.
- **Are technical notes grounded in the project stack?** Next.js App Router,
  Prisma, NextAuth magic-link, Stripe.

## Synthesis

1. **Tally verdicts.** Any BLOCK blocks creation as drafted.
2. **Group findings by issue**, not by persona. For each draft issue: what's
   missing, what's mis-sized, what's out of scope.
3. **Propose a concrete rewrite or split** where the panel recommends one —
   not just "this is too big" but "split into A and B with these ACs".
4. **Explicit OK list.** If some draft issues passed cleanly, name them — the
   user shouldn't have to infer.

## Output to user

```
# Issue Creation Council — <short title>

**Panel:** product, backend, data, qa, ...
**Synthesized verdict:** REQUEST-CHANGES (2 of 5 issues need rework)
**Headline:** <one sentence>

## Issues that need changes
### <issue title>
- [<persona>] <finding>
- [<persona>] <finding>
**Recommended rewrite / split:** ...

## Issues approved as drafted
- <issue title>
- <issue title>

## Recommended next steps
1. Revise the named issues per the recommendations.
2. Re-run this council on the revised drafts (optional).
3. Hand off to `requirements-to-github` for creation.

## Full per-persona reports
<kept available but out of the top summary>
```

## Guardrails

- This council never creates GitHub issues. Creation goes through
  `requirements-to-github` after the user approves the revised drafts.
- Treat the spec doc as authoritative on scope. If the draft conflicts with
  the spec, the draft is wrong, not the spec.
