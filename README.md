# TaskPro — Microtask Platform

Full-stack Next.js 14 app where workers complete microtasks (surveys, Reddit posts, data collection) and earn money. Admins upload tasks, set quotas, and review submissions.

---

## Quick Start

### Step 1 — Install dependencies
```bash
npm install
```
> This installs Next.js, Prisma, NextAuth and everything else. Must be done first.

### Step 2 — Set up the database
```bash
npx prisma db push
```
> Creates `prisma/dev.db` (SQLite file). No external database needed.

### Step 3 — Seed demo data
```bash
npm run db:seed
```
> Creates 2 demo accounts, 6 tasks, and sample submissions.

### Step 4 — Run the app
```bash
npm run dev
```
> Open http://localhost:3000

---

**Or run all steps at once:**
```bash
bash setup.sh
```

---

## Demo Logins

| Role   | Email                  | Password   |
|--------|------------------------|------------|
| Worker | worker@taskpro.com     | worker123  |
| Admin  | admin@taskpro.com      | admin123   |

---

## Features

### Worker Portal
- Register & login
- Browse available tasks with instructions
- Submit proof (URL link, text data, or screenshot)
- View submission history with status & rejection notes
- Earnings wallet (pending / approved / withdrawn)
- Withdraw funds (min $5)
- Profile page with stats

### Admin Panel
- Platform dashboard — live stats, submission feed, task progress
- Create tasks — type, reward, required quantity, proof format, instructions
- Edit tasks — update any field, change status
- Task detail — per-task submission list with inline approve/reject
- Bulk upload — CSV upload to create many tasks at once
- Submissions review — filterable queue, one-click approve/reject with notes
- Workers table — per-worker earnings breakdown
- Analytics — approval rate, payouts, task breakdown, top workers

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Framework  | Next.js 14 (App Router)           |
| Database   | SQLite via Prisma ORM             |
| Auth       | NextAuth.js (JWT sessions)        |
| Styling    | Tailwind CSS                      |
| Validation | Zod                               |
| Icons      | Lucide React                      |

> Note: SQLite is used for demo simplicity. For production, change `DATABASE_URL` to a PostgreSQL connection string in `.env` and update `provider = "postgresql"` in `prisma/schema.prisma`.

---

## Payment Flow

```
Worker submits proof → status: PENDING  (+pending balance)
        ↓
Admin approves  → status: APPROVED  (pending → approved balance)
Admin rejects   → status: REJECTED  (pending balance reversed)
        ↓
Worker withdraws → approved balance → withdrawn (clears approved)
```

---

## Project Structure

```
app/
├── page.tsx                          Landing page
├── auth/login / register             Auth pages
├── worker/
│   ├── dashboard                     Earnings overview
│   ├── tasks                         Browse & submit tasks
│   ├── submissions                   History
│   ├── earnings                      Wallet & withdrawal
│   └── profile                       Stats
├── admin/
│   ├── dashboard                     Platform overview
│   ├── tasks / tasks/new / tasks/[id]/edit
│   ├── tasks/bulk                    CSV upload
│   ├── submissions                   Review queue
│   ├── workers                       Worker list
│   └── analytics                     Charts & KPIs
└── api/
    ├── auth/[...nextauth]
    ├── register
    ├── tasks / tasks/[id] / tasks/bulk
    ├── submissions / submissions/[id]
    └── earnings
```
