# 0001 — Prisma 7 configuration and driver adapter pattern

**Date:** 2026-05-30
**Status:** Accepted

## Context

Prisma 7 changed how database connections are configured relative to earlier
versions. In Prisma 5/6 the `datasource` block in `schema.prisma` held the
`url` (and optionally `directUrl`) connection strings. In Prisma 7 both
properties were removed from the schema file.

## Decision

### CLI connection (migrations, generate, studio)

A `prisma.config.ts` file at the project root provides the connection URL to
the Prisma CLI. This file is only used by CLI commands — it is not imported
at runtime.

```ts
// prisma.config.ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: process.env.DATABASE_URL },
});
```

`prisma.config.ts` explicitly loads `.env.local` via `dotenv` because:

- Next.js loads `.env.local` automatically at runtime, but the Prisma CLI
  is not a Next.js process and does not know about this convention.
- Using `.env.local` (gitignored) rather than `.env` (also gitignored but
  closer to the Prisma default) keeps the environment-variable story
  consistent with the rest of the Next.js project.

### Runtime connection (application code)

The `PrismaClient` in Prisma 7 no longer reads `DATABASE_URL` from the
schema — it requires a driver adapter. We use `@prisma/adapter-pg` (the
official Postgres adapter):

```ts
// lib/prisma.ts
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

The singleton is stored on `globalThis` to survive Next.js HMR cycles in
development and avoid connection pool exhaustion.

## Consequences

- Two packages are needed that were not required in older Prisma versions:
  `@prisma/adapter-pg` and `pg`.
- The `schema.prisma` `datasource` block contains only `provider` — the
  absence of a `url` is intentional and correct for Prisma 7.
- Any future migration to a different Postgres driver (e.g. `neon/serverless`)
  requires changing the adapter in `lib/prisma.ts` and the `datasource.url`
  in `prisma.config.ts` — both in one place each.
- The `DIRECT_URL` pattern (for managed providers with connection poolers)
  is documented in `.env.example` but not yet wired into `prisma.config.ts`.
  When a managed provider is adopted, add `directUrl` to the `datasource`
  block in `prisma.config.ts` and pass it to the adapter if required.
