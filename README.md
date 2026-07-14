# TaskFlow — Project & Team Task Management Platform

A full-stack project and task management platform with three roles — **Administrator**,
**Project Manager**, and **Team Member** — built with Next.js, Node.js/Express, Prisma, and
PostgreSQL.

- 📄 [Feature completion report](docs/Feature_Completion_Report.md)
- 🗂️ [Entity Relationship Diagram](docs/ERD.md)
- 🧭 [Use Case Diagram](docs/UseCaseDiagram.md)
- 🏗️ [System architecture](docs/Architecture.md)
- 📚 [API documentation](docs/API_Documentation.md) · [Postman collection](docs/postman_collection.json)
- ⚙️ [CI/CD explanation](docs/CI_CD_Explanation.md)

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| ORM / Database | Prisma + PostgreSQL |
| Auth | JWT (bcrypt password hashing), role-based access control |
| Validation | Zod |
| CI/CD | GitHub Actions (lint, type-check, test, build) |

## Project structure

```
taskflow/
├── backend/           Express + Prisma REST API
│   ├── prisma/        schema.prisma, seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/   (auth, RBAC, validation, error handling)
│   │   ├── routes/
│   │   ├── validators/   Zod schemas
│   │   └── utils/        JWT + password helpers
│   └── tests/          Jest + Supertest
├── frontend/          Next.js App Router UI
│   ├── app/
│   │   ├── (login) page.tsx, register/
│   │   └── dashboard/    overview, projects, tasks, users
│   ├── components/
│   ├── lib/              API client, auth context
│   └── types/
├── docs/              ERD, use case diagram, architecture, API docs, reports
└── .github/workflows/ci.yml
```

## Prerequisites

- Node.js 20+
- npm 10+
- A PostgreSQL 14+ database (local install, Docker, or a hosted instance e.g. Supabase/Neon/Railway)

## 1. Clone & install

```bash
git clone <your-repo-url>
cd taskflow
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set DATABASE_URL to your Postgres connection string, and a JWT_SECRET
```

If you don't already have Postgres running locally, the quickest option is Docker:

```bash
docker run --name taskflow-db -e POSTGRES_USER=taskflow -e POSTGRES_PASSWORD=taskflow \
  -e POSTGRES_DB=taskflow -p 5432:5432 -d postgres:16
```

Then, with `DATABASE_URL="postgresql://taskflow:taskflow@localhost:5432/taskflow?schema=public"`:

```bash
npm run prisma:generate     # generate the Prisma client
npm run prisma:migrate      # create tables (prompts for a migration name, e.g. "init")
npm run prisma:seed         # optional: seed demo accounts + a sample project
npm run dev                 # starts the API on http://localhost:4000
```

Demo accounts created by the seed script (password for all: `Password123!`):

| Role | Email |
|---|---|
| Administrator | `admin@taskflow.dev` |
| Project Manager | `pm@taskflow.dev` |
| Team Member | `member1@taskflow.dev` / `member2@taskflow.dev` |

### Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
# NEXT_PUBLIC_API_URL should point at the backend, e.g. http://localhost:4000/api
npm run dev                 # starts the app on http://localhost:3000
```

Open `http://localhost:3000`, sign in with one of the demo accounts above (or click the demo
account buttons on the login page to autofill), and explore.

## 2. Running tests & linting

```bash
# Backend
cd backend
npm run lint
npm run build        # type-check + compile
npm test             # Jest + Supertest (health check, validation, RBAC enforcement)

# Frontend
cd frontend
npm run lint
npm run build         # type-checks every page and produces a production build
```

## 3. Production build

```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm start
```

Set `CORS_ORIGIN` in the backend `.env` to your deployed frontend URL, and `NEXT_PUBLIC_API_URL`
in the frontend to your deployed backend URL, before building for production.

## 4. Deployment notes

- **Backend**: deployable to Railway, Render, Fly.io, or any Node host with a PostgreSQL add-on.
  Run `npm run prisma:migrate deploy` (or `prisma:push` for a quick schema sync) as part of your
  deploy step.
- **Frontend**: deployable to Vercel (recommended for Next.js) or any Node host. Set
  `NEXT_PUBLIC_API_URL` as an environment variable at build time.
- **Live deployment link**: add here once deployed — `<your-live-url>`

## 5. Roles & permissions summary

| Action | Admin | Project Manager | Team Member |
|---|:---:|:---:|:---:|
| Manage user accounts & roles | ✅ | ❌ | ❌ |
| Create / edit / delete any project | ✅ | Own projects only | ❌ |
| Add / remove project members | ✅ | Own projects only | ❌ |
| Create / assign / edit / delete tasks | ✅ | Within own projects | ❌ |
| Update task status & comment | ✅ | ✅ | Own tasks only |
| View dashboard | System-wide | Own projects | Own tasks |

See [docs/UseCaseDiagram.md](docs/UseCaseDiagram.md) for the full breakdown.

## AI tool usage

This project was built with the assistance of **Claude** (Anthropic) — see
[docs/Feature_Completion_Report.md](docs/Feature_Completion_Report.md#ai-tool-usage-disclosure)
for details on which parts were AI-assisted.

## Submission checklist

- [x] GitHub repository (push this folder and make it public)
- [ ] Short screen recording of the full app flow
- [x] README with setup/run instructions (this file)
- [x] `.env.example` for both backend and frontend
- [ ] Live deployment link
- [x] AI tool usage disclosed
- [x] Entity Relationship Diagram
- [x] Use Case Diagram
- [x] System architecture diagram
- [x] API documentation + Postman collection
- [x] Feature completion report
- [x] CI/CD workflow explanation
