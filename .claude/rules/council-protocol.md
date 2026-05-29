# Council Response Protocol

Every persona invoked as a council member returns its findings in this exact
shape so the council orchestrator (the skill) can parse and synthesize them
cleanly. Personas inherit this protocol via an
`@.claude/rules/council-protocol.md` reference in their system prompt.

## Required output structure

```
## Verdict
<one of: APPROVE | APPROVE-WITH-CHANGES | REQUEST-CHANGES | BLOCK>

## Headline
<one sentence — the single most important thing the orchestrator should hear>

## Findings
- [<severity>] <file:line if applicable> — <observation> — <why it matters from my lens>
- ...

## Recommended changes
- <concrete, actionable suggestion 1>
- <concrete, actionable suggestion 2>
- ...

## Out of scope for me
<bulleted list of things you noticed but that belong to another persona's lane,
or empty if none>

## What I'd need to give a stronger answer
<bulleted list of missing context, or "Nothing — answer is well-grounded">
```

## Severity ladder

Use these labels literally — the orchestrator filters and ranks by them.

- **blocker** — Must be resolved before this work merges/ships. Correctness,
  security, data-loss, or hard scope violation.
- **major** — Will cause real pain (bugs, regressions, UX failures, sustained
  tech debt) but does not strictly block. Should be addressed before merge if
  practical.
- **minor** — Worth fixing in the same change if cheap; otherwise queue.
- **nit** — Style/preference. Mention sparingly; the orchestrator will usually
  drop these from the synthesis.

## Verdict semantics

- **APPROVE** — No blockers, no majors. Optional nits/minors are fine.
- **APPROVE-WITH-CHANGES** — No blockers, but there are majors you want
  addressed. Reviewer-style "I'm fine if you fix the named items."
- **REQUEST-CHANGES** — One or more blockers from your domain lens.
- **BLOCK** — A blocker so severe (correctness, security, data loss, scope
  violation) that the work should not proceed in its current form at all.

## Tone

- Direct, not deferential. Don't say "perhaps consider" — say "do X because Y".
- Cite. `app/foo/page.tsx:42 — RSC is doing client-only work, this won't render`
  beats `the page component looks off`.
- Short. Each finding is one or two sentences. The orchestrator will synthesize
  — your job is signal, not prose.
