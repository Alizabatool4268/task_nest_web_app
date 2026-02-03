---
id: 1
title: create-spec
stage: spec
date: 2026-02-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: jwt-auth-tasks
branch: 2-jwt-auth-tasks
user: DELL
command: /sp.specify
labels: ["specification", "authentication", "jwt", "tasks"]
links:
  spec: ../spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/2-jwt-auth-tasks/spec.md
  - specs/2-jwt-auth-tasks/checklists/requirements.md
tests:
  - specs/2-jwt-auth-tasks/spec.md validated
  - checklists/requirements.md created
---

## Prompt

```text
Build JWT-Based Authentication + User-Specific Task System for Hackathon App

Objective:
Create a complete authentication system using FastAPI + SQLModel + Neon PostgreSQL.
All code must be generated inside the backend/src folder following the existing structure.
Authentication should use JWT access tokens.

Target:
Full-stack developer integrating a secure, modern backend with a Next.js frontend.

Core Requirements:
1. Implement full JWT authentication flow:
   - POST /auth/signup
   - POST /auth/login
   - GET /auth/me (requires valid JWT)
   - POST /auth/logout (optional token blacklist or frontend-side removal)
2. Password hashing must use bcrypt or passlib.
3. JWT tokens must include:
   - user_id
   - expiration
4. Tokens returned to client as JSON:
   {
     access_token: "...",
     token_type: "bearer"
   }

Database Requirements:
1. Use Neon PostgreSQL through SQLModel.
2. Create a User model with fields:
   - id (UUID or int)
   - name
   - email (unique)
   - password_hash
   - created_at
3. Create a Task model with:
   - id
   - title
   - description
   - completed (bool)
   - user_id (foreign key → User)

Task Behavior Requirements:
1. Users can only access their own tasks.
2. Implement CRUD routes under /tasks:
   - POST /tasks        → create task for logged-in user
   - GET /tasks         → list tasks for logged-in user
   - GET /tasks/{id}    → only if task belongs to user
   - PUT /tasks/{id}
   - DELETE /tasks/{id}
3. All task routes must require valid JWT.

Folder Structure Constraints:
All code must follow the existing backend layout:
backend/src/
   api/v1/endpoints/
   models/
   services/
   utils/
   database.py
   main.py

Place new components as:
- backend/src/api/v1/endpoints/auth.py         (auth routes)
- backend/src/api/v1/endpoints/tasks.py        (modify to enforce ownership)
- backend/src/models/user.py                   (User model)
- backend/src/models/task.py                   (Task model if not already)
- backend/src/services/auth_service.py         (login/signup/password hashing/JWT)
- backend/src/utils/jwt.py                     (token creation/verification)

Success Criteria:
- JWT auth fully functional
- User data persisted in Neon PostgreSQL
- Each logged-in user sees ONLY their own tasks
- Fully documented and clean code
- Compatible with Next.js frontend using fetch()
```

## Response snapshot

Created a comprehensive feature specification for JWT-based authentication and user-specific task system. The specification includes:

- User Scenarios & Testing with 3 prioritized user stories
- 15 functional requirements covering authentication, task management, and security
- 2 key entities (User and Task) defined
- 6 measurable success criteria
- Edge cases identified
- A validation checklist confirming specification quality

The spec addresses all core requirements from the original request including JWT authentication flow, password hashing, user isolation for tasks, and database requirements.

## Outcome

- ✅ Impact: Created complete feature specification for JWT authentication and user-specific tasks
- 🧪 Tests: spec.md validated and requirements checklist created
- 📁 Files: specs/2-jwt-auth-tasks/spec.md, specs/2-jwt-auth-tasks/checklists/requirements.md
- 🔁 Next prompts: Ready for planning phase (/sp.plan)
- 🧠 Reflection: Specification covers all requirements from user input with clear acceptance criteria

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to planning phase