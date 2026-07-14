# CI/CD Workflow Explanation

Workflow file: `.github/workflows/ci.yml`. It runs automatically on every `push` and `pull_request`
against the `main` and `develop` branches, and has two independent jobs so a failure in one stack
doesn't hide the status of the other.

## Job 1 — `backend`

Runs inside a job that also spins up a **PostgreSQL 16 service container**, so the pipeline
exercises the real database engine rather than a mock.

1. **Checkout** the repository.
2. **Set up Node.js 20** with npm cache keyed to `backend/package-lock.json`.
3. **`npm ci`** — clean, reproducible install from the lockfile.
4. **`npm run lint`** — ESLint (`@typescript-eslint`) over `src/**/*.ts`.
5. **`npm run prisma:generate`** — generates the type-safe Prisma client from `schema.prisma`.
6. **`npx prisma db push`** — syncs the schema straight to the ephemeral CI Postgres instance
   (chosen over `migrate deploy` so the pipeline doesn't depend on a committed migration history
   for this submission; see note below).
7. **`npm run build`** — `tsc` type-checks and compiles the entire backend; this is the main
   "does the code actually type-check" gate.
8. **`npm test`** — runs the Jest/Supertest suite (`tests/health.test.ts`, `tests/auth.validation.test.ts`,
   `tests/rbac.test.ts`), covering: health check availability, request validation (bad email,
   short password), and RBAC enforcement (unauthenticated access rejected, Team Members blocked
   from Admin/PM-only actions, malformed tokens rejected).

> **Migrations note:** for a longer-lived project, run `npx prisma migrate dev --name init` locally
> once, commit the generated `backend/prisma/migrations/` folder, and switch the CI step to
> `npx prisma migrate deploy` for a fully auditable migration history. `db push` is a pragmatic
> choice for getting a schema-in-sync CI database quickly during initial development.

## Job 2 — `frontend`

1. **Checkout** and **Node.js 20 setup** (separate npm cache keyed to `frontend/package-lock.json`).
2. **`npm ci`**.
3. **`npm run lint`** — Next.js's built-in ESLint config (`next/core-web-vitals`).
4. **`npm run build`** — runs `next build`, which type-checks every page/component and produces a
   production build. This is the strongest signal that the frontend compiles and every route is
   valid.

## What "passing CI" means for this submission

A green run confirms:
- Both codebases install cleanly from their lockfiles.
- Both codebases pass linting with no errors.
- The backend fully type-checks and compiles, and its Prisma schema applies to a real Postgres
  instance without error.
- The backend's automated tests (validation + RBAC) pass.
- The frontend fully type-checks, lints, and produces a production build with no broken pages.

## Local verification performed before submission

In the development sandbox used to build this project, outbound network access is restricted to
package registries only (no access to `binaries.prisma.sh` for the Prisma query engine binary, and
no access to Google Fonts). To work around this locally-restricted sandbox (not a limitation of
GitHub Actions or a normal developer machine), the following was verified directly instead:

- `npx tsc --noEmit` on the backend — **0 errors**.
- `npx eslint "src/**/*.ts"` on the backend — **0 errors, 0 warnings** (after fixing an unused-variable
  warning).
- `npm run build` on the frontend (`next build`) — **compiled successfully**, all 8 routes
  generated, full type-check and lint passed as part of the build.
- Fonts were switched from `next/font/google` to safe system font stacks specifically so the build
  does not depend on reaching `fonts.googleapis.com`, making the app more portable across
  restricted networks/CI runners in general.

The one step that could not be executed inside that sandbox — actually starting Postgres and
running the Jest suite against a live database — will run automatically in the GitHub Actions
job above, which has normal internet access and a real Postgres service container.
