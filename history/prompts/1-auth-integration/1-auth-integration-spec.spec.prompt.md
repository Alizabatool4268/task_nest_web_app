---
id: 1
title: auth-integration-spec
stage: spec
date: 2026-01-22
surface: agent
model: claude-sonnet-4-5-20250929
feature: auth-integration
branch: 1-auth-integration
user: user
command: /sp.specify
labels: [authentication, jwt, security, specification]
links:
  spec: specs/1-auth-integration/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/1-auth-integration/spec.md
 - specs/1-auth-integration/checklists/requirements.md
tests:
 - None yet
---

## Prompt

# Authentication Spec (Next.js + Better Auth + FastAPI)

## Goal
Add real user authentication using Better Auth on the frontend and JWT verification on the FastAPI backend. Users must sign up, sign in, receive a JWT, and all backend routes must validate the token and isolate data by user_id. Backend work should be done in a separate backend folder and frontend work should be done on frontend.


## Requirements

### Frontend (Next.js)
- Install and configure **Better Auth** in `/frontend`.
- Enable **JWT plugin** so login returns a signed JWT.
- JWT must contain: `user_id`, `email`, `exp`.
- Store JWT on the client (Better Auth handles this).
- Send JWT with every backend request using:

  `Authorization: Bearer <token>`

### Shared Secret
- Same `BETTER_AUTH_SECRET` must exist in:
  - .env`

### Backend (FastAPI)
- use UV package manager for backend work (compulsory)
- Add JWT verification middleware:
  - Extract token from header.
  - Verify signature using `BETTER_AUTH_SECRET`.
  - Decode token → attach `user_id` to request.
  - Invalid token → `401 Unauthorized`.
- All task routes must require JWT.
- Filter all DB operations by the authenticated `user_id`.
- Backend does NOT handle signup/signin—only token verification.

## Acceptance Criteria
- User can sign up/sign in.
- Frontend receives and sends JWT correctly.
- Backend validates JWT and extracts `user_id`.
- Each user only sees and modifies their own tasks.
- Requests without valid JWT fail with `401`.

## Constraints
- Auth logic lives ONLY in the frontend.
- Backend remains stateless; no sessions.

## Response snapshot

Created comprehensive specification for authentication integration feature including:
- User scenarios for registration/login, protected task access, and unauthorized access prevention
- Functional requirements covering JWT handling, user isolation, and security
- Success criteria with measurable outcomes
- Non-functional requirements for security and scalability
- Clear scope definition with inclusions and exclusions

## Outcome

- ✅ Impact: Created complete feature specification ready for planning and implementation
- 🧪 Tests: None yet
- 📁 Files: specs/1-auth-integration/spec.md, specs/1-auth-integration/checklists/requirements.md
- 🔁 Next prompts: /sp.plan to create implementation plan
- 🧠 Reflection: Specification covers all aspects of the authentication integration with clear requirements and success criteria

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): Proceed to planning phase