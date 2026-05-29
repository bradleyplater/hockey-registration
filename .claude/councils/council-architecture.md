---
name: council-architecture
description: Convene an architecture-focused council when a change involves cross-layer structural decisions — how data, server, and UI fit together, where a boundary should sit, or how the work positions the project for the extension hooks the spec calls out. Use for system-level questions, NOT single-layer tactical work.
---

# Council — Architecture

Convene the architecture-focused panel when a change involves cross-layer
structural decisions: how the data shape, server logic, and UI fit together,
how this work positions the project for future extension, or where a
boundary should sit.

This council is NOT for "add a CRUD endpoint" or "tweak this component" — use
`council-backend.md` or `council-frontend.md` for those. Convene this one
when the decision will outlive the issue.

Shared council rules:
- Persona charter: @.claude/rules/persona-charter.md
- Response protocol: @.claude/rules/council-protocol.md

## When to use this council

**Strong signals:**
- Touches data model + server + UI together with a non-trivial design choice.
- Implicates one of the extensibility hooks the spec calls out (role model,
  team-admin permission model, season retention queries — see Section 7.4
  of the MVP doc).
- Two layer councils have already convened and produced conflicting
  recommendations — bring the disagreement up a level.
- The decision sets a precedent the project will live with.

**Weak signals (use a layer council instead):**
- Single-layer work, even if it's significant.
- "Where should this file live" or naming questions.

## Inputs to resolve before convening

1. **The architectural question** — framed in one paragraph, not as a list
   of tasks. "Where does registration state live?" is good. "Build the
   approval workflow" is too narrow for this council and too broad for
   backend alone.
2. **The shape of the affected surface.** Which layers? Which files would
   change? Which extensibility points does it touch?
3. **Relevant spec sections** that bear on the decision — especially Section
   7.4 (Extensibility Considerations) and any sections the affected workflow
   touches.

## Panel composition

The framing is the value, not the headcount. Convene the layer voices
together and brief them to think in cross-layer terms.

**Default panel:**
- `backend-engineer`
- `frontend-engineer`
- `data-modeler`
- `product-manager`

**Conditionally added:**
- `security-engineer` — if the decision moves a trust boundary or changes
  who-can-do-what.
- `devx-engineer` — if the decision shapes build, type generation, or how
  new contributors interact with this part of the codebase.

State the final panel and the system-level question in one line before
spawning.

## Briefing template — sent to each member

Spawn all members in **parallel** in a single message.

```
You are convened as an architecture-council member.

THE ARCHITECTURAL QUESTION
<one-paragraph framing of the decision>

AFFECTED SURFACE
<which layers, which files, which extensibility points>

RELEVANT SPEC SECTIONS
<paste the relevant section(s), especially 7.4 if applicable>

WHY THIS IS AN ARCHITECTURE QUESTION (not a layer question)
<one or two sentences>

YOUR LENS
You are the <persona-name>. Apply your domain expertise BUT FRAME YOUR
RESPONSE IN SYSTEM TERMS — how the decision affects layers beyond yours,
which future extensions it enables or forecloses, what coupling it
introduces. Cite spec sections where applicable. Respond strictly in the
council response protocol format.
```

## Synthesis

1. **Tally verdicts.** Any BLOCK from any member blocks the direction.
2. **Group by structural concern**, not by persona: boundary placement,
   extensibility, coupling, precedent, conformance to spec extension hooks.
3. **Surface conflicts explicitly.** Architecture councils exist to make
   conflicts visible — backend wanting denormalization vs data-modeler
   wanting normalization, frontend wanting a single endpoint vs backend
   wanting two. Name the trade-off and recommend a default with reasoning.
4. **Default recommendation.** At the end, propose one direction with a
   one-paragraph rationale. The user decides; you do not.

## Output to user

```
# Architecture Council — <short title>

**Panel:** backend, frontend, data, product, ...
**Synthesized verdict:** APPROVE-WITH-CHANGES
**Headline:** <one sentence — the decision in one line>

## The question
<the architectural question being decided>

## Structural concerns
- <boundary / extensibility / coupling / precedent> — <synthesized view>

## Conflicts requiring your call
- <option A vs option B with context>

## Recommended direction
<one paragraph — the default with rationale>

## Implications to revisit later
- <decision X will need revisiting if Y happens>

## Full per-persona reports
<kept available but out of the top summary>
```

## Guardrails

- This council recommends, doesn't decide. Architectural choices are the
  user's to make.
- If the question is too narrow for this council (single-layer), say so and
  redirect to `council-backend.md` or `council-frontend.md`.
- If two layer councils already disagreed and this council can't reconcile
  them, surface the irreconcilable choice cleanly — don't fake consensus.
