# API Documentation — TaskFlow

Base URL (local): `http://localhost:4000/api`

All endpoints except `POST /auth/register` and `POST /auth/login` require an `Authorization: Bearer <token>` header. A Postman collection with all of these requests pre-built is available at `docs/postman_collection.json`.

Roles: `ADMIN`, `PROJECT_MANAGER`, `TEAM_MEMBER`.

---

## Auth

### `POST /auth/register`
Public self-registration. Always creates a `TEAM_MEMBER` account.

Body:
```json
{ "name": "Jordan Rivera", "email": "jordan@example.com", "password": "at-least-8-chars" }
```
Response `201`: `{ "user": { ... }, "token": "<jwt>" }`

### `POST /auth/login`
Body: `{ "email": "...", "password": "..." }`
Response `200`: `{ "user": { ... }, "token": "<jwt>" }`

### `GET /auth/me`
Returns the currently authenticated user. Requires auth.

---

## Users — `/users` (Admin, unless noted)

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin, PM | List all user accounts (PM needs this to assign tasks/members) |
| POST | `/users` | Admin | Create a user with any role |
| GET | `/users/:id` | Admin, PM | Get a single user |
| PATCH | `/users/:id` | Admin | Update name, role, or active status |
| DELETE | `/users/:id` | Admin | Delete a user (cannot delete yourself) |

`PATCH` body (all optional): `{ "name": "...", "role": "PROJECT_MANAGER", "isActive": false }`

---

## Projects — `/projects`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/projects` | All roles | Admin sees all; PM sees projects they manage; Team Member sees projects they belong to |
| POST | `/projects` | Admin, PM | Create a project (creator becomes manager, unless Admin sets `managerId`) |
| GET | `/projects/:id` | Manager, members, Admin | Project details incl. members and task count |
| PATCH | `/projects/:id` | Admin, managing PM | Update name/description/status/dates/manager |
| DELETE | `/projects/:id` | Admin, managing PM | Delete a project (cascades to tasks) |
| POST | `/projects/:id/members` | Admin, managing PM | Add a team member — body: `{ "userId": "..." }` |
| DELETE | `/projects/:id/members/:userId` | Admin, managing PM | Remove a team member |

`POST /projects` body:
```json
{
  "name": "Website Relaunch",
  "description": "Optional",
  "status": "PLANNED",
  "memberIds": ["userId1", "userId2"]
}
```

---

## Tasks — `/tasks`

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/tasks?projectId=&status=&assigneeId=` | All roles | Admin sees all (filterable); PM sees tasks in projects they manage; Team Member sees only tasks assigned to them |
| POST | `/tasks` | Admin, managing PM | Create a task in a project they manage |
| GET | `/tasks/:id` | Assignee, managing PM, Admin | Task details |
| PATCH | `/tasks/:id` | Assignee (status/description only), managing PM / Admin (all fields) | Update a task |
| DELETE | `/tasks/:id` | Admin, managing PM | Delete a task |

`POST /tasks` body:
```json
{
  "title": "Design homepage",
  "description": "Optional",
  "priority": "HIGH",
  "dueDate": "2026-08-01T00:00:00.000Z",
  "assigneeId": "userId-or-omit",
  "projectId": "required"
}
```

`PATCH /tasks/:id` body (any subset): `{ "status": "DONE", "priority": "URGENT", "assigneeId": null }`

---

## Comments — nested under tasks

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/tasks/:taskId/comments` | Anyone with task access | List comments oldest-first |
| POST | `/tasks/:taskId/comments` | Anyone with task access | Add a comment — body: `{ "content": "..." }` |
| DELETE | `/tasks/:taskId/comments/:id` | Author, managing PM, Admin | Delete a comment |

---

## Dashboard

### `GET /dashboard/summary`
Returns role-scoped counts and a recent-activity feed:
```json
{
  "totalProjects": 4,
  "activeProjects": 2,
  "totalTasks": 15,
  "tasksByStatus": [{ "status": "TODO", "_count": 5 }],
  "overdueTasks": 1,
  "recentActivity": [{ "id": "...", "action": "TASK_CREATED", "details": "...", "createdAt": "...", "user": { "name": "...", "avatarColor": "..." } }],
  "totalUsers": 12
}
```
`totalUsers` is only included for Admins.

---

## Error format

All errors follow the shape:
```json
{ "error": "Human readable message" }
```
Validation errors additionally include:
```json
{ "error": "Validation failed", "details": [{ "path": "body.email", "message": "Invalid email" }] }
```

## Status codes used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 204 | Success, no content (deletes) |
| 400 | Validation error |
| 401 | Missing/invalid/expired token |
| 403 | Authenticated but not permitted (RBAC) |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Unexpected server error |
