---
name: requirements-to-github
description: Turn a requirements or specification document into GitHub milestones, issues, and sub-issues. Use when the user wants to break a requirement/spec/PRD doc into GitHub issues, generate a backlog from requirements, or create epics/stories from a spec. Orchestrates analysis, human review, and live creation in GitHub via the connected GitHub MCP.
---

# Requirements → GitHub

Turn a requirements document into a reviewed, then live-created, GitHub backlog.
Issue standards live in `.claude/rules/github-issue-standards.md` — read it.

The Epic/Story/Sub-task hierarchy maps onto GitHub as **Epic → Milestone**,
**Story → Issue (assigned to that milestone)**, **Sub-task → sub-issue of the
story's issue**. The standards file defines this in full.

**Core principle: smallest sensible ticket.** Each leaf issue (a story with no
sub-tasks, or a sub-task) should map to one small, easy-to-review merge request.
Favour decomposition — split stories into sub-issues rather than leaving them
large. Most leaf issues should be 1–3 points; treat 5+ as a signal to break the
work down further. See the rules file for the exact thresholds.

## Inputs to resolve first

- **Which document?** If the user named one, use it. Otherwise look in `docs/`
  and ask which to use if there's more than one candidate.
- **Target GitHub repository** (`owner/repo`). Ask if not provided; you can
  infer a default from the repo's `origin` remote but confirm it.

## Workflow

### 1. Analyze

Delegate to the `requirements-analyzer` agent with the document path. It returns
a structured milestone/issue breakdown (read-only — nothing is created yet).
Pass along any scope notes the user gave.

### 2. Review with the user — REQUIRED GATE

Present the breakdown summary (milestone/issue counts, total points, scope
exclusions) and the full breakdown. Ask the user to approve, edit, or reject.
Do NOT proceed to creation until the user explicitly approves. Incorporate any
requested changes and re-present.

### 3. Create in GitHub

Once approved, confirm a GitHub MCP is connected. If none is connected, guide
the user to add the **GitHub MCP** (`/mcp` or settings), then continue.
Delegate to the `github-issue-creator` agent with the approved breakdown and the
target `owner/repo`. It creates milestones → issues (assigned to milestone) →
sub-issues with correct parent links.

### 4. Report

Relay the creation report: a table of every item (type, number/URL, title,
parent milestone/issue) and any fields that couldn't be set (e.g. a label that
didn't exist and had to be created or skipped).

## Guardrails

- Never create GitHub issues before the user approves the breakdown.
- Never ticket Non-Goals / Future Enhancements from the source doc.
- If the GitHub MCP is unavailable, stop at a saved breakdown rather than
  inventing an alternative — the analysis is still useful on its own.
