---
name: review-mr
description: Convene a multi-perspective council to review an open GitHub PR and post findings as inline comments prefixed with "CLAUDE -". Use when asked to review a PR, check a diff with AI, or run /review-mr [PR#].
---

# /review-mr — Council PR Review

Convene the `council-mr-review` panel against a GitHub PR and post each
finding as an inline comment (or general comment as a fallback). Every posted
comment is prefixed with `CLAUDE -`.

---

## Step 1 — Resolve the PR

**If an argument was supplied** (a PR number or URL), parse the number from it.

**If no argument was supplied**, run:
```
gh pr view --json number,state
```
- If the result has `"state": "OPEN"`, use that PR number.
- If the command fails, or the PR is not open, surface:
  `No open PR found for this branch.` and exit without posting any comments.

---

## Step 2 — Fetch diff and metadata

Run both in parallel:
```
gh pr diff <PR#>
gh pr view <PR#> --json number,title,headRefOid,files,body
gh repo view --json owner,name
```

If `gh pr diff` fails (auth error, network, bad scope), surface the error and
exit. Do not post any comments.

**If the diff is empty** (zero lines), surface:
`No reviewable diff found on PR #<n>.` and exit.

**If the diff exceeds 500 lines:**
- Truncate to the first 500 lines.
- Continue the review with the truncated diff.
- After posting findings, also post a general PR comment:
  `CLAUDE - This review is partial. The diff exceeded 500 lines and was truncated; lines beyond 500 were not reviewed.`

---

## Step 3 — Check for existing CLAUDE - comments

Fetch both comment streams for the PR:
```
gh api repos/{owner}/{repo}/pulls/<PR#>/comments
gh api repos/{owner}/{repo}/issues/<PR#>/comments
```
Resolve `{owner}` and `{repo}` from the `gh repo view` result in Step 2.

Collect the body of every comment that starts with `CLAUDE -`. You will use
this list in Step 6 to skip duplicates.

---

## Step 4 — Convene the council

Read `.claude/councils/council-mr-review.md` for the panel composition rules.
Apply them to the diff (data-modeler if schema changed, ux-designer if UI
files changed, etc.).

State the final panel to the user in one line before spawning.

Spawn **all** council members **in parallel** using the Agent tool, each with
`subagent_type` matching the agent name. Use the briefing template from
`council-mr-review.md`, substituting:

- **ARTIFACT UNDER REVIEW** — the (possibly truncated) diff plus the list of
  changed files from `gh pr view`.
- **LINKED ISSUE / ACCEPTANCE CRITERIA** — extract from the PR body if
  present, otherwise "none provided".
- **SCOPE HINTS FROM USER** — any extra text the user passed beyond the PR
  number, or "none".

---

## Step 5 — Process council output

For each council member response:

1. **Malformed / crashed** (output does not contain a `## Verdict` section):
   note which agent failed. Skip it. Continue with the rest.

2. **Valid response:**
   - Parse all `## Findings` entries.
   - **Drop nit-severity findings** — do not post them.
   - Keep blocker, major, and minor findings.

If every agent returned APPROVE with no blocker/major/minor findings (or
returned only nit findings), skip to Step 6b.

---

## Step 6a — Post findings as comments

For each finding to post:

### Build the comment body

```
CLAUDE - [<severity>] [<persona>] <observation> — <why it matters>
```

### Determine if it can be line-anchored

A finding can be line-anchored when:
- It cites a specific file and line number.
- That file appears in the PR's changed files list.
- That line falls within a diff hunk (parse `@@ -l,s +l,s @@` headers from the
  diff to identify valid ranges).

**To compute the correct `line` for the GitHub API:**
Parse each `@@ -<old_start>,<old_count> +<new_start>,<new_count> @@` hunk
header. For additions/context lines, track the running new-file line number.
Use `side: "RIGHT"` for added lines, `side: "LEFT"` for deleted lines.

### Check for duplicates

Before posting, check whether a comment with identical text already exists in
the list collected in Step 3. If so, skip it.

### Post inline comment (anchored case)

```
gh api repos/{owner}/{repo}/pulls/<PR#>/comments \
  --method POST \
  --field body="CLAUDE - [<severity>] [<persona>] <finding>" \
  --field commit_id="<headRefOid>" \
  --field path="<file>" \
  --field line=<line> \
  --field side="RIGHT"
```

### Fallback: general PR comment (unanchored case)

When line-anchoring is not possible (deleted line, outside hunk, unparseable):
```
gh api repos/{owner}/{repo}/issues/<PR#>/comments \
  --method POST \
  --field body="CLAUDE - [<severity>] [<persona>] <file> — <finding>"
```

---

## Step 6b — All-clear comment

If no blocker/major/minor findings exist across all agents (or all agents
returned APPROVE with findings only at nit level), check for an existing
all-clear comment. If none exists, post:

```
gh api repos/{owner}/{repo}/issues/<PR#>/comments \
  --method POST \
  --field body="CLAUDE - Council reviewed this PR and found no issues."
```

---

## Step 7 — Report to the user

Summarize what happened:
- Panel convened (which agents).
- Number of comments posted (inline vs general).
- Any agents that failed or returned malformed output.
- Whether the diff was truncated.
- PR URL for reference.
