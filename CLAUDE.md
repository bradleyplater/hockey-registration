# EIHA Recreational Hockey Registration

Web app to replace EIHA's legacy recreational hockey registration system.
MVP scope and full context: @docs/eiha-rec-hockey-registration-mvp.md

## Stack

- TypeScript, Next.js (App Router) — single full-stack codebase
- PostgreSQL + Prisma
- NextAuth / Auth.js magic-link (passwordless) authentication
- Stripe (test mode for POC) for the flat registration fee

## Tooling prerequisites

### GitHub CLI (`gh`) scopes

The `/complete-issue` and `/create-issue` skills use `gh` to read issues,
manage GitHub Projects, and open PRs. Ensure your token has these scopes:

```
gh auth refresh -s read:project,project
```

| Scope | Why it's needed |
|---|---|
| `repo` | Read/write issues, PRs, branches (granted by default on login) |
| `read:project` | List projects and read item/field data |
| `project` | Add items to a project and update field values (e.g. Status) |

Run `gh auth status` to check your current scopes.

---

## Working with requirements & GitHub issues

When turning a requirement document into GitHub work items, use the
`requirements-to-github` skill. Issue structure and quality standards are
defined here: @.claude/rules/github-issue-standards.md
