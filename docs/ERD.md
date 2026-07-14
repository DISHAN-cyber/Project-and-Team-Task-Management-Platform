# Entity Relationship Diagram — TaskFlow

This reflects the Prisma schema at `backend/prisma/schema.prisma`. Paste the block below into
[mermaid.live](https://mermaid.live) or view it directly on GitHub (which renders Mermaid natively).

```mermaid
erDiagram
    USER ||--o{ PROJECT : "manages (as PM)"
    USER ||--o{ PROJECT_MEMBER : "belongs to"
    USER ||--o{ TASK : "is assigned"
    USER ||--o{ TASK : "creates"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ ACTIVITY_LOG : "performs"

    PROJECT ||--o{ PROJECT_MEMBER : "has"
    PROJECT ||--o{ TASK : "contains"
    PROJECT ||--o{ ACTIVITY_LOG : "logs"

    TASK ||--o{ COMMENT : "has"
    TASK ||--o{ ACTIVITY_LOG : "logs"

    USER {
        string id PK
        string name
        string email UK
        string passwordHash
        enum role "ADMIN | PROJECT_MANAGER | TEAM_MEMBER"
        boolean isActive
        string avatarColor
        datetime createdAt
        datetime updatedAt
    }

    PROJECT {
        string id PK
        string name
        string description
        enum status "PLANNED | ACTIVE | ON_HOLD | COMPLETED | ARCHIVED"
        datetime startDate
        datetime endDate
        string managerId FK
        datetime createdAt
        datetime updatedAt
    }

    PROJECT_MEMBER {
        string id PK
        string projectId FK
        string userId FK
        datetime joinedAt
    }

    TASK {
        string id PK
        string title
        string description
        enum status "TODO | IN_PROGRESS | IN_REVIEW | DONE"
        enum priority "LOW | MEDIUM | HIGH | URGENT"
        datetime dueDate
        string projectId FK
        string assigneeId FK
        string creatorId FK
        datetime createdAt
        datetime updatedAt
    }

    COMMENT {
        string id PK
        string content
        string taskId FK
        string authorId FK
        datetime createdAt
        datetime updatedAt
    }

    ACTIVITY_LOG {
        string id PK
        string action
        string details
        string userId FK
        string projectId FK
        string taskId FK
        datetime createdAt
    }
```

## Notes on the design

- **`PROJECT_MEMBER`** is a join table modelling the many-to-many relationship between `USER` and
  `PROJECT`, with a unique constraint on `(projectId, userId)` to prevent duplicate membership.
- **`PROJECT.managerId`** is a direct foreign key to `USER` — every project has exactly one
  Project Manager, enforced at the database level (`onDelete: Cascade`).
- **`TASK.assigneeId`** is nullable (`onDelete: SetNull`) — a task can be unassigned, and deleting
  a user does not delete their previously assigned tasks, just clears the assignment.
- **`ACTIVITY_LOG`** is an append-only audit trail used to power the "Recent activity" panel on the
  dashboard and can back an admin audit view.
- All foreign keys are indexed to keep common queries (tasks by project, tasks by assignee, etc.)
  efficient.
