---
name: council-frontend
description: Convene a frontend-focused council to advise on a UI change, new page/component, form design, or frontend architecture question. Spawns frontend, UX, QA, and (conditionally) security and devx voices in parallel.
---

# Council — Frontend

Convene the frontend-focused panel for advice on UI work: new pages,
components, forms, client/server boundaries, accessibility, or design
direction.

Shared council rules:

- Persona charter: @.claude/rules/persona-charter.md
- Response protocol: @.claude/rules/council-protocol.md

## When to use this council vs `council-mr-review`

- Use **council-frontend** for design/direction questions, in-progress work, or
  pre-implementation thinking ("how should the player registration step look").
- Use **council-mr-review** when there is a finished diff to review.

## Inputs to resolve before convening

1. **The frontend artifact / question.** A page path, a component, a
   wireframe description, or a design question framed in one paragraph.
2. **Which user group(s) it serves.** Player, team manager, or association
   admin — they have different portals.
3. **The relevant section of the spec or linked issue**, if any.

## Panel composition

**Default panel:**

- `frontend-engineer`
- `ux-designer`
- `qa-engineer`

**Conditionally added:**

- `security-engineer` — anything touching auth UI, sign-in, session-bound
  views, or forms that submit PII.
- `devx-engineer` — anything touching the component conventions, design
  system scaffolding, or shared UI primitives.
- `product-manager` — anything that could expand player/manager/admin
  capabilities beyond the MVP spec.

State the final panel in one line before spawning.

## Briefing template — sent to each member

Spawn all members in **parallel** in a single message.

```
You are convened as a frontend-council member.

QUESTION / ARTIFACT
<paste the question, the component, the page, or the design described>

USER GROUP(S) AFFECTED
<player | team manager | association admin — one or more>

RELEVANT SPEC / ACCEPTANCE CRITERIA
<paste the linked AC or spec section, or "none provided">

YOUR LENS
You are the <persona-name>. Apply the lens defined in your system prompt and
the persona charter. Respond strictly in the council response protocol format.
```

## Synthesis

1. **Tally verdicts.** If any member returns BLOCK, the synthesized verdict
   does not approve the direction as proposed.
2. **Group by concern**, not by persona: rendering boundary, form ergonomics,
   accessibility, copy, scope.
3. **Surface conflicts explicitly.** UX and frontend-engineer often pull in
   different directions — name the trade-off rather than averaging them.
4. **Decision points for the user.** A short ordered list of choices the user
   must make to move forward.

## Output to user

```
# Frontend Council — <short title>

**Panel:** frontend, ux, qa, ...
**Synthesized verdict:** APPROVE-WITH-CHANGES
**Headline:** <one sentence>

## Direction notes
- <concern> — <synthesized view>
...

## Trade-offs requiring your call
- <option A vs option B with context>

## Recommended next steps
1. ...
2. ...

## Full per-persona reports
<kept available but out of the top summary>
```

## Guardrails

- This council advises on direction. It does not write the UI. The main
  session implements only after the user picks a direction.
