# EIHA Hockey Registration

Web application for the England Ice Hockey Association's recreational hockey player and team registration system.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the local Postgres instance)

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/bradleyplater/hockey-registration.git
cd hockey-registration
npm install
```

`npm install` runs `prisma generate` automatically via the `postinstall` hook.

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values:

| Variable                 | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| `DATABASE_URL`           | PostgreSQL connection string (default matches the local Docker setup below) |
| `AUTH_URL`               | Public base URL of the app (e.g. `http://localhost:3000` locally)           |
| `AUTH_SECRET`            | Random secret — generate with `openssl rand -base64 32`                     |
| `EMAIL_FROM`             | Sender address for magic-link emails                                        |
| `RESEND_API_KEY`         | API key from [Resend](https://resend.com)                                   |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (use test-mode keys for local dev)                   |
| `STRIPE_SECRET_KEY`      | Stripe secret key                                                           |
| `STRIPE_WEBHOOK_SECRET`  | Stripe webhook signing secret                                               |

### 3. Start the database

A `docker-compose.yml` is included for local development. It runs Postgres 16 on port 5432 with credentials that match the default `DATABASE_URL` in `.env.example` — no changes needed out of the box.

```bash
npm run db:start       # docker compose up -d
npm run db:migrate     # apply all pending migrations
npm run db:seed        # seed with the default empty scenario
```

> **Data persistence:** `docker compose down` (no flags) keeps your data. `docker compose down -v` wipes it.
>
> **Managed provider:** The local Docker database can be swapped for any managed Postgres provider. Update `DATABASE_URL` in `.env.local` with your provider's connection string. If your provider uses a connection pooler, also set `DIRECT_URL` to the direct (non-pooled) connection string — see `.env.example` for details.

### 4. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Database scripts

| Script                      | What it does                                                         |
| --------------------------- | -------------------------------------------------------------------- |
| `npm run db:start`          | Start the local Postgres container (`docker compose up -d`)          |
| `npm run db:stop`           | Stop the container (`docker compose down`)                           |
| `npm run db:migrate`        | Apply pending migrations (`prisma migrate dev`)                      |
| `npm run db:migrate:deploy` | Apply migrations non-interactively — use in CI/production            |
| `npm run db:generate`       | Regenerate the Prisma client after schema changes                    |
| `npm run db:seed`           | Seed the database (set `SEED_SCENARIO` env var to select a scenario) |
| `npm run db:reset`          | Drop, re-migrate, and re-seed — useful for a clean local slate       |
| `npm run db:studio`         | Open Prisma Studio to browse the database                            |

### Seed scenarios

| `SEED_SCENARIO`     | Contents                                 |
| ------------------- | ---------------------------------------- |
| `empty` _(default)_ | Clears all data — a clean starting point |

Run a specific scenario:

```bash
SEED_SCENARIO=empty npm run db:seed
```

Or reset the database and seed in one step:

```bash
npm run db:reset  # runs migrations then seeds with the default scenario
```

## Available scripts

| Script                 | What it does                                      |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Start the Next.js development server              |
| `npm run build`        | Build for production                              |
| `npm run start`        | Start the production server                       |
| `npm run typecheck`    | Run TypeScript type checking (`tsc --noEmit`)     |
| `npm run lint`         | Run ESLint                                        |
| `npm run format`       | Format all files with Prettier                    |
| `npm run format:check` | Check formatting without writing                  |
| `npm run check`        | Run typecheck, lint, and format:check in one pass |
| `npm run test`         | Run tests in watch mode (Vitest)                  |
| `npm run test:run`     | Run tests once                                    |

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth / Auth.js magic-link (passwordless)
- **Payments:** Stripe (test mode for POC)
