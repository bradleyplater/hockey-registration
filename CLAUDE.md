# EIHA Recreational Hockey Registration

Web app to replace EIHA's legacy recreational hockey registration system.
MVP scope and full context: @docs/eiha-rec-hockey-registration-mvp.md

## Stack

- TypeScript, Next.js (App Router) — single full-stack codebase
- PostgreSQL + Prisma
- NextAuth / Auth.js magic-link (passwordless) authentication
- Stripe (test mode for POC) for the flat registration fee

## Working with requirements & GitHub issues

When turning a requirement document into GitHub work items, use the
`requirements-to-github` skill. Issue structure and quality standards are
defined here: @.claude/rules/github-issue-standards.md
