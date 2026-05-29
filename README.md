# EIHA Hockey Registration

Web application for the England Ice Hockey Association's recreational hockey player and team registration system.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- A PostgreSQL database (local or managed — [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app) all have free tiers)

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/bradleyplater/hockey-registration.git
cd hockey-registration
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_URL` | Public base URL of the app (e.g. `http://localhost:3000` locally) |
| `AUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `EMAIL_FROM` | Sender address for magic-link emails |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (use test-mode keys for local dev) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

### 3. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run typecheck` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run check` | Run typecheck, lint, and format:check in one pass |

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth / Auth.js magic-link (passwordless)
- **Payments:** Stripe (test mode for POC)
