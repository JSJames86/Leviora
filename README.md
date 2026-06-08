# Leviora Ventures — Client Portal

A Supabase-backed Next.js application for Leviora Ventures, a business consulting
firm. It serves two kinds of users:

- **Admins** (internal team) — invite clients, manage engagements, track milestones
  and deliverables, review generated documents, and message clients.
- **Clients** (external) — complete an onboarding questionnaire, track engagement
  progress, view deliverables, message their consultant, and download generated
  documents.

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated visitors are
redirected to `/login`; authenticated users are routed to `/admin` or `/portal`
based on their role.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project API URL and anon key (client + server). |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — required for admin actions (inviting clients, sending notifications, generating documents) that need to bypass RLS. |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Transactional email (invites, milestone updates, document-ready notices) via [Resend](https://resend.com). |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe billing + webhook handling. |
| `NEXT_PUBLIC_SITE_URL` | Base URL used to build links in emails and auth redirects (e.g. `http://localhost:3000` locally). |

### Database

The schema lives in `supabase/migrations/0001_init.sql` — clients, engagements,
milestones, deliverables, notes, documents, notifications, and the
`auth.users` → `public.users` sync trigger. Apply it to a Supabase project with
the Supabase CLI or the SQL editor before running the app.

## Demo accounts

The connected Supabase project is seeded with one account of each role:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@levioraventures.com` | `LevioraAdmin!2026` |
| Client | `maya@brightpathconsulting.com` | `LevioraClient!2026` |

Sign in at `/login` — admins land on `/admin` (dashboard, clients, engagements,
documents queue), clients land on `/portal` (onboarding, engagement progress,
deliverables, notes).

## Project structure

- `src/app/(auth)` — login, invite/password-set, and forgot-password flows
- `src/app/admin` — admin dashboard, client roster + invite wizard, engagement
  management (milestones, deliverables, notes), and the document review queue
- `src/app/portal` — client dashboard, onboarding questionnaire, and engagement
  detail views
- `src/app/api` — invite issuance, document generation/review, Stripe webhooks,
  and notifications
- `src/lib/data` — typed Supabase data-access helpers and server actions
- `src/lib/resend` — transactional email templates and the notification trigger
  system
- `src/components` — shared UI primitives plus admin/portal/shared feature
  components

## Learn more

This project is built with [Next.js](https://nextjs.org) (App Router, Turbopack)
and [Supabase](https://supabase.com) (Postgres, Auth, Storage). See the
[Next.js documentation](https://nextjs.org/docs) and
[Supabase documentation](https://supabase.com/docs) for more.
