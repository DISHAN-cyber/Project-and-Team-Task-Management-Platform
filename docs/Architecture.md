# System Architecture — TaskFlow

```mermaid
flowchart TB
    subgraph Client["Client (Browser)"]
        UI["Next.js 14 App Router + TypeScript<br/>Tailwind CSS UI, React Context (auth)"]
    end

    subgraph Server["API Server"]
        MW["Express Middleware<br/>Helmet · CORS · Rate limiting · Morgan logging"]
        AUTH["Auth Middleware<br/>JWT verification"]
        RBAC["RBAC Middleware<br/>Role checks (Admin / PM / Member)"]
        VAL["Validation Middleware<br/>Zod schemas"]
        CTRL["Controllers<br/>auth · users · projects · tasks · comments · dashboard"]
        ORM["Prisma ORM Client"]
    end

    subgraph Data["Data Layer"]
        DB[("PostgreSQL Database")]
    end

    subgraph CI["CI/CD"]
        GH["GitHub Actions<br/>Lint → Type-check → Test → Build"]
    end

    UI -- "REST API calls (HTTPS + Bearer JWT)" --> MW
    MW --> AUTH --> RBAC --> VAL --> CTRL --> ORM --> DB

    GH -. "on push / PR" .-> UI
    GH -. "on push / PR" .-> MW

    style UI fill:#EEF0FF,stroke:#5B5FEF
    style DB fill:#EAFBF1,stroke:#22A566
    style GH fill:#FFF7E6,stroke:#E08E0B
```

## Component overview

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS | Renders role-aware dashboards, project/task views, forms, and modals. Talks to the API over `fetch` using a JWT stored in `localStorage`. |
| API Server | Node.js, Express, TypeScript | Exposes a versioned-free REST API under `/api`. Applies security middleware (Helmet, CORS, rate limiting), authentication, RBAC, and request validation before reaching controllers. |
| ORM | Prisma | Type-safe query layer and schema/migration management for PostgreSQL. |
| Database | PostgreSQL | Stores users, projects, project membership, tasks, comments, and an activity log. |
| CI/CD | GitHub Actions | Runs lint, type-check, automated tests, and a production build for both the backend and frontend on every push/PR. |

## Request flow example — "Team member updates a task's status"

1. Browser sends `PATCH /api/tasks/:id` with `Authorization: Bearer <jwt>` and `{ "status": "IN_REVIEW" }`.
2. `authenticate` middleware verifies the JWT and attaches `{ sub, role, email }` to the request.
3. `validate(updateTaskSchema)` checks the request body shape.
4. `task.controller.updateTask` loads the task, confirms the caller is either the assignee or a
   manager (Admin / the project's PM), and restricts which fields a Team Member may change
   (status, description only).
5. Prisma persists the change and an `ActivityLog` row is written if the status changed.
6. The updated task is returned as JSON; the frontend updates its local state.
