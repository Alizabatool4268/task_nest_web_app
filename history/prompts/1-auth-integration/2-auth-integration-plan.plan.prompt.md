---
id: 2
title: auth-integration-plan
stage: plan
date: 2026-01-22
surface: agent
model: claude-sonnet-4-5-20250929
feature: auth-integration
branch: 1-auth-integration
user: user
command: /sp.plan
labels: [authentication, jwt, security, planning]
links:
  spec: specs/1-auth-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-auth-integration/plan.md
 - specs/1-auth-integration/research.md
 - specs/1-auth-integration/data-model.md
 - specs/1-auth-integration/contracts/api-contract.yaml
 - specs/1-auth-integration/quickstart.md
 - .specify/memory/constitution.md
tests:
 - None yet
---

## Prompt

# Authentication plan prompt

## Objective
Implement full user authentication in a Next.js + FastAPI multi-service app. Users must sign up, sign in, receive a JWT token, and all backend routes must verify the token and isolate data per user. Backend work should be done in a separate backend folder and frontend work should be done on frontend. Use better auth documentation for best practices

## Technical Knowledge / Instructions

### 1. Frontend (Next.js + Better Auth)
- Install Better Auth in `/frontend`.
- Configure Better Auth to enable **JWT plugin**.
- Configure JWT to include `user_id`, `email`, `exp` and sign it with `BETTER_AUTH_SECRET`.
- Create signup and login pages using Better Auth hooks (`useAuth()`).
- Store the JWT on the frontend securely (Better Auth handles storage).
- Attach JWT to every API request:

Authorization: Bearer <token>
Ensure token is refreshed on page reloads.


2. Shared Secret
Define BETTER_AUTH_SECRET
.env


Must be the same secret for JWT signing and verification.


3. Backend (FastAPI + SQLModel)
    Use UV package manager for working (compulsory)
Create User model in PostgreSQL (via SQLModel) matching Better Auth users.


Implement JWT middleware:


Extract token from Authorization header.


Verify token using BETTER_AUTH_SECRET.


Decode token to get user_id and email.


Attach user_id to request.state.user.


Return 401 Unauthorized if token is missing or invalid.


Update all task routes to:


Require JWT.


Filter all queries by user_id.


Ensure users can only access their own tasks.


4. API Behavior
All endpoints are protected.


Requests without valid JWT return 401.


CRUD operations on tasks are per-user isolated.


5. Constraints
Backend does not handle signup/signin; Better Auth frontend only.


Backend remains stateless (no session tables).
Deliverables
Better Auth config with JWT enabled.


Frontend signup/login pages.


FastAPI JWT middleware.


User model in database.


Updated task routes filtered by user_id.

## Response snapshot

Created comprehensive implementation plan for authentication integration feature including:
- Technical context with language versions, dependencies, and constraints
- Constitution check verifying compliance with security and architectural principles
- Project structure defining frontend and backend directories
- Research document with technology decisions and alternatives
- Data model defining User, Task, and JWT token structures
- API contracts specifying endpoints and authentication requirements
- Quickstart guide for setting up and running the system
- Updated agent context with new technologies

## Outcome

- ✅ Impact: Created complete implementation plan ready for task breakdown and execution
- 🧪 Tests: None yet
- 📁 Files: specs/1-auth-integration/plan.md, research.md, data-model.md, contracts/api-contract.yaml, quickstart.md
- 🔁 Next prompts: /sp.tasks to break down implementation into executable tasks
- 🧠 Reflection: Plan comprehensively covers all aspects of authentication integration with clear technical direction

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Proceed to task breakdown phase