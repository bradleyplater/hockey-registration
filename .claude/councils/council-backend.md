---
name: council-backend
description: Convene a backend-focused council to advise on server-side work — server actions, route handlers, Prisma usage, transactions, Stripe and NextAuth integration, or backend architecture questions. Spawns backend, data, security, QA, and devx voices in parallel.
---

# Council — Backend

Convene the backend-focused panel for advice on server-side work: new
endpoints, server actions, query patterns, transactions, schema-adjacent
decisions, and integrations.

Shared council rules:
- Persona charter: @.claude/rules/persona-charter.md
- Response protocol: @.claude/rules/council-protocol.md

## When to use this council vs `council-mr-review`

- Use **council-backend** for design/direction on server-side work — pre-code
  or in-progress.
- Use **council-mr-review** when there is a finished diff to review.

## Inputs to resolve before convening

1. **The backend artifact / question.** A new endpoint, a server action, a
   query pattern, a transaction shape, or a one-paragraph design question.
2. **Workflow context.** Which user journey does this serve (player
   registration, team registration, approval, etc.)?
3. **The relevant spec section / linked issue and its acceptance criteria.**

## Panel composition

**Default panel:**
- `backend-engineer`
- `data-modeler`
- `security-engineer`
- `qa-engineer`

**Conditionally added:**
- `devx-engineer` — if it touches scripts, type generation, env, or build
  config.
- `frontend-engineer` — if the endpoint's contract or progressive-enhancement
  story directly shapes the UI.
- `product-manager` — if the proposal might enable behavior beyond the MVP
  spec.

State the final panel in one line before spawning.

## Briefing template — sent to each member

Spawn all members in **parallel** in a single message.

```
You are convened as a backend-council member.

QUESTION / ARTIFACT
<paste the design question, endpoint sketch, query pattern, or files involved>

WORKFLOW CONTEXT
<which user journey — player registration / team registration / approval / etc.>

RELEVANT SPEC / ACCEPTANCE CRITERIA
<paste the linked AC or spec section, or "none provided">

YOUR LENS
You are the <persona-name>. Apply the lens defined in your system prompt and
the persona charter. Respond strictly in the council response protocol format.
```

## Synthesis

1. **Tally verdicts.** Any BLOCK blocks the direction.
2. **Group by concern**: schema, transactions, authz, validation, error
   surfacing, scope. Not by persona.
3. **Surface conflicts.** Backend vs data-modeler often disagree on where
   denormalization belongs; backend vs security often disagree on how strict
   to be at the boundary. Name the trade-off rather than averaging.
4. **Decision points for the user.**

## Output to user

```
# Backend Council — <short title>

**Panel:** backend, data, security, qa, ...
**Synthesized verdict:** APPROVE-WITH-CHANGES
**Headline:** <one sentence>

## Design notes
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

- This council advises on direction. It does not write the code. The main
  session implements only after the user picks a direction.
