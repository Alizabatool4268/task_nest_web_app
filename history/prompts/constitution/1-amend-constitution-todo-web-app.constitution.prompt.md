---
id: 1
title: "amend-constitution-todo-web-app"
stage: "constitution"
date_iso: "2026-01-09"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "master"
user: "user"
command: "/sp.constitution"
labels: ["constitution", "setup", "todo-app"]
spec: null
ticket: null
adr: null
pr: null
files:
  - ".specify/memory/constitution.md"
tests: []
prompt_text: |
  ## Project
  Full-Stack Todo Web App
  Stack: Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth (JWT), Spec-Kit Plus

  ## Core Principles
  - Security first (JWT required for all API access)
  - User data isolation (each user sees only their own tasks)
  - Clean separation: UI / API / DB
  - Consistent naming, structure, and REST patterns
  - Scalable codebase (monorepo architecture)

  ## Required Features

  ### Basic (Must-Have)
  - Add task
  - Update task
  - Delete task
  - View task list
  - Toggle completed

  ### Intermediate
  - Priority (low/medium/high)
  - Tags / Categories
  - Search by keyword
  - Filters: status, priority, date
  - Sorting: due date, priority, alphabetical

  ### Advanced
  - Recurring tasks (daily/weekly/monthly)
  - Due date + time picker
  - Browser notifications for reminders
  - Auto-reschedule recurring tasks
  - Backend-side filtering, search, and sorting

  ## Authentication Rules
  - Better Auth issues JWT on frontend
  - FastAPI verifies JWT using shared secret
  - Every backend request must include:
    `Authorization: Bearer <token>`
  - Missing token → 401
  - Token user_id ≠ URL user_id → 403
  - All DB queries scoped to `token.user_id`

  ## Monorepo Structure

  /frontend → Next.js + Better Auth
  /backend → FastAPI + SQLModel + JWT middleware
  /shared → Types, OpenAPI spec, schemas


  ## Database (Neon + SQLModel)
  Task model fields:
  - id
  - user_id
  - title
  - description
  - completed
  - priority
  - tags
  - due_date
  - recurring
  - created_at (UTC)

  ## REST API Endpoints
  - GET `/api/{user_id}/tasks`
  - POST `/api/{user_id}/tasks`
  - GET `/api/{user_id}/tasks/{id}`
  - PUT `/api/{user_id}/tasks/{id}`
  - DELETE `/api/{user_id}/tasks/{id}`
  - PATCH `/api/{user_id}/tasks/{id}/complete`

  ## Frontend Requirements
  - Must be responsive
  - Must attach JWT to every request
  - UI must support:
    - Create/edit forms
    - Priority + tags
    - Search, filter, sort
    - Recurring selector
    - Due-date picker
    - Notification permissions

  ## Developer Standards
  - TypeScript strict mode
  - Clean, consistent structure
  - No unused code

  ## Success Criteria
  - All required features implemented
  - Secure JWT auth fully integrated
  - User isolation enforced globally
  - Recurring tasks and reminders functional
response_text: |
  Created a comprehensive constitution file for the Full-Stack Todo Web App project based on the provided specifications. The constitution includes core principles (Security First, Clean Separation, Minimal Viable Implementation, Type Safety, Authentication Enforcement, Monorepo Organization), additional constraints (Database Requirements, REST API Standards, Frontend Requirements), development workflow guidelines, and governance rules. The file was written to .specify/memory/constitution.md with version 1.0.0, ratified on 2026-01-09.
outcome: "Successfully created the project constitution file with all specified principles and requirements."
evaluation: "The constitution accurately reflects all the requirements provided by the user and follows the template structure."
---

# Constitution Update for Todo Web App

## Summary
Created a comprehensive constitution file for the Full-Stack Todo Web App project based on the provided specifications. The constitution includes core principles (Security First, Clean Separation, Minimal Viable Implementation, Type Safety, Authentication Enforcement, Monorepo Organization), additional constraints (Database Requirements, REST API Standards, Frontend Requirements), development workflow guidelines, and governance rules.

## Details
- Created constitution file at `.specify/memory/constitution.md`
- Added 6 core principles covering security, architecture, implementation approach, type safety, authentication, and monorepo organization
- Included additional constraints for database, API, and frontend requirements
- Defined development workflow with implementation priorities and quality standards
- Added governance section with compliance requirements
- Set version to 1.0.0 with ratification date of 2026-01-09