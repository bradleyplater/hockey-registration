---
name: council-mr-review
description: Convene a multi-persona council to review a merge request / PR / current diff. Spawns backend, frontend, data, security, and QA voices in parallel, then synthesizes their findings into a single review.
---

# Council — MR Review

Run a parallel multi-persona review of a code change and produce a single,
synthesized report. Personas are read-only advisors; the main session
synthesizes and (if asked) acts.

Shared council rules:

- Persona charter: @.claude/rules/persona-charter.md
- Response protocol: @.claude/rules/council-protocol.md

## Inputs to resolve before convening

1. **What is under review?** One of:
   - The current uncommitted diff (`git diff`)
   - A branch vs `main` (`git diff main...HEAD`)
   - A GitHub PR number — fetch with `gh pr diff <n>`
2. **The story / issue the change is supposed to satisfy** (if any). Pull
   acceptance criteria from the linked issue when available — QA needs them.
3. **Scope hints** from the user (e.g. "focus on auth only").

If the diff is empty, stop and say so. Do not convene a council over nothing.

## Panel composition

**Default panel** (always convened):

- `backend-engineer`
- `frontend-engineer`
- `security-engineer`
- `qa-engineer`

**Conditionally added** based on what the diff touches:

- `data-modeler` — if `prisma/schema.prisma` or any migration changed.
- `ux-designer` — if UI files changed (`app/**`, `components/**`, copy).
- `devx-engineer` — if `package.json`, scripts, CI, tooling, or env config
  changed.
- `product-manager` — if the diff appears to add/expand behavior beyond the
  linked issue's acceptance criteria (possible scope drift).

State the final panel to the user in one line before spawning.

## Briefing template — sent to each council member

Each Agent call must include this briefing so the member can act without prior
context. Spawn all members in **parallel** in a single message.

```
You are convened as a council member to review a code change.

ARTIFACT UNDER REVIEW
<paste the diff, or the path/command that produced it, plus a list of changed files>

LINKED ISSUE / ACCEPTANCE CRITERIA
<paste the AC from the linked issue, or "none provided">

SCOPE HINTS FROM USER
<verbatim from user, or "none">

YOUR LENS
You are the <persona-name>. Apply the lens defined in your system prompt and
the persona charter. Respond strictly in the council response protocol format.
```

## Synthesis

After all members have reported:

1. **Tally verdicts.** Count APPROVE / APPROVE-WITH-CHANGES / REQUEST-CHANGES
   / BLOCK. Any BLOCK from any member blocks the synthesized verdict.
2. **Group findings by file**, not by persona. A reader of the review wants to
   know "what's wrong in `app/foo/page.tsx`", not "what did the frontend
   engineer say". Annotate each finding with which persona raised it.
3. **Surface conflicts explicitly.** If two personas disagree (e.g. backend
   says "use server action", frontend says "needs to be route handler for
   progressive enhancement"), call it out as a decision the user must make —
   don't paper over it.
4. **Drop the noise.** Nits are dropped from the synthesized report unless
   the same nit was raised by two personas. Each member's full report is
   still available — but the synthesis is signal.
5. **Recommended next actions.** A short ordered list of what to do, by
   severity. Each action cites file:line where possible.

## Output to user

```
# Council Review — <short title>

**Panel:** backend, frontend, security, qa, ...
**Synthesized verdict:** REQUEST-CHANGES (1 BLOCK, 2 REQUEST-CHANGES)
**Headline:** <one sentence>

## Blockers
- [<persona>] <file:line> — <issue> — <why>
...

## Majors (grouped by file)
### app/foo/page.tsx
- [<persona>] line 42 — <issue>
- [<persona>] line 88 — <issue>

## Conflicts requiring your call
- <persona A says X / persona B says Y / context>

## Recommended next actions
1. ...
2. ...

## Full per-persona reports
<collapsible / linked — keep available for the user but out of the top summary>
```

## Guardrails

- Personas advise — the main session never auto-applies their recommendations.
  Ask the user before editing code based on the review.
- Never spawn a council over a change set you haven't actually fetched. If
  `gh pr diff` fails, stop and report the failure.
