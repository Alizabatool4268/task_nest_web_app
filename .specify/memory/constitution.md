<!-- SYNC IMPACT REPORT:
Version change: N/A -> 1.0.0
Modified principles: None (new constitution)
Added sections: All sections
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ⚠ pending review
Follow-up TODOs: None
-->

# Full-Stack Todo Web App Constitution

## Core Principles

### Security First
All API access must be secured with JWT authentication; user data must be isolated so each user sees only their own tasks; sensitive operations require proper authorization checks.

### Clean Separation
Maintain clear separation between UI (frontend), API (backend), and database layers; follow consistent naming conventions and REST patterns throughout the application; ensure scalable monorepo architecture.

### Minimal Viable Implementation
Implement features incrementally following the priority order: basic features first (CRUD operations), then intermediate features (priority, tags, filters), then advanced features (recurring tasks, notifications).

### Type Safety
Use TypeScript strict mode throughout the codebase; maintain clean, consistent structure; eliminate unused code and dependencies; ensure all interfaces are properly typed.

### Authentication Enforcement
Better Auth must issue JWT tokens on frontend; FastAPI must verify JWT using shared secret; every backend request must include Authorization header; enforce user_id scoping on all database queries.

### Monorepo Organization
Structure the codebase with /frontend for Next.js + Better Auth, /backend for FastAPI + SQLModel + JWT middleware, and /shared for types, OpenAPI spec, and schemas.

## Additional Constraints

### Database Requirements
Use Neon PostgreSQL with SQLModel ORM; Task model must include fields: id, user_id, title, description, completed, priority, tags, due_date, recurring, created_at (UTC).

### REST API Standards
Implement endpoints: GET /api/{user_id}/tasks, POST /api/{user_id}/tasks, GET /api/{user_id}/tasks/{id}, PUT /api/{user_id}/tasks/{id}, DELETE /api/{user_id}/tasks/{id}, PATCH /api/{user_id}/tasks/{id}/complete; All endpoints must validate JWT and enforce user_id matching.

### Frontend Requirements
Implement responsive UI that attaches JWT to every request; Support create/edit forms, priority/tags selection, search/filters/sorting, recurring task selector, due-date picker, and notification permissions.

## Development Workflow

### Implementation Priorities
Complete basic features first (Add task, Update task, Delete task, View task list, Toggle completed), then intermediate features (Priority, Tags/Categories, Search, Filters, Sorting), then advanced features (Recurring tasks, Due date/time picker, Browser notifications, Auto-reschedule, Backend-side filtering/search/sorting).

### Quality Standards
Maintain TypeScript strict mode compliance; Follow clean, consistent structure; Remove unused code; Ensure all features meet security requirements; Test authentication integration thoroughly.

### Success Criteria
All required features must be implemented; Secure JWT authentication must be fully integrated; User isolation must be enforced globally; Recurring tasks and reminders must be functional.

## Governance

All code changes must comply with these constitutional principles; Any deviation from these principles requires explicit amendment to this document; All pull requests must verify compliance with security and architectural requirements; New features must follow the specified priority order and maintain the clean separation of concerns.

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09