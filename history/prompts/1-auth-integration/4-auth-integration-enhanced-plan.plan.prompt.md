---
id: 4
title: auth-integration-enhanced-plan
stage: plan
date: 2026-01-22
surface: agent
model: claude-sonnet-4-5-20250929
feature: auth-integration
branch: 1-auth-integration
user: user
command: /sp.plan
labels: [authentication, jwt, security, planning, enhancement]
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
 - specs/1-auth-integration/tasks.md
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

## JWT Structure & Validation
- JWT **must include**: `user_id`, `email`, `exp`.
- System must **validate presence + type** of each claim.
- Reject tokens with **missing, malformed, or expired** claims.
- Enforce strict **expiration handling** to prevent reuse of stale tokens.
- Implement **JWT verification** using Better Auth JWT plugin with strengthened claim checks.

## Error & Malformed Token Handling
- Detect and handle:
  - Tampered signatures
  - Missing `Authorization` header
  - Invalid token format
  - Tokens signed with wrong secret
- Return consistent error responses.

## Performance Requirements
- Token verification should be **optimized** to avoid slowing API routes.
- Cache public keys (if used) or reuse verification instance.

## Security Requirements
- Use secure, long, rotated secrets.
- Follow constitution rules for claims and signing.
- Prevent token replay through expiration + optional rotation.
## Implementing requirements
- Add task for **verifying claim presence + type**.
- Add task for **malformed token detection**.
- Add task for **expiration logic & tests**.
- Add task for **performance verification** around JWT validation.

## Response snapshot

Enhanced the authentication implementation plan to address security requirements identified in the analysis. Updates include:

- Enhanced plan.md with stricter JWT validation and security requirements
- Updated research.md with detailed security considerations for JWT handling
- Enhanced data-model.md with detailed JWT validation rules
- Updated API contracts with specific error responses for security scenarios
- Modified quickstart.md with security-focused testing examples
- Expanded tasks.md with 46 specific tasks including security-focused implementations

## Outcome

- ✅ Impact: Strengthened security posture of authentication system with enhanced JWT validation
- 🧪 Tests: None yet
- 📁 Files: specs/1-auth-integration/plan.md, research.md, data-model.md, contracts/api-contract.yaml, quickstart.md, tasks.md
- 🔁 Next prompts: /sp.implement to begin implementation of tasks
- 🧠 Reflection: Plan now addresses all critical security requirements identified in analysis

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Begin implementation with Phase 1 tasks