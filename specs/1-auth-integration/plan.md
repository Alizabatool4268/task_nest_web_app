# Implementation Plan: Authentication Integration

**Branch**: `1-auth-integration` | **Date**: 2026-01-22 | **Spec**: [specs/1-auth-integration/spec.md](../specs/1-auth-integration/spec.md)
**Input**: Feature specification from `/specs/1-auth-integration/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement full user authentication in a Next.js + FastAPI multi-service app using Better Auth for frontend authentication and JWT verification on the backend. Users must sign up, sign in, receive a JWT token, and all backend routes must verify the token and isolate data per user. Backend work will be done in a separate backend folder and frontend work will be done in the frontend folder. Enhanced security requirements include strict JWT claim validation, malformed token handling, and performance optimization.

## Technical Context

**Language/Version**: Python 3.11 (FastAPI), Node.js 18+ (Next.js)
**Primary Dependencies**: Better Auth, FastAPI, SQLModel, PyJWT, uv (package manager)
**Storage**: PostgreSQL via SQLModel ORM
**Testing**: pytest for backend, Jest/React Testing Library for frontend
**Target Platform**: Web application (browser + server)
**Project Type**: Web (determines source structure)
**Performance Goals**: JWT validation under 100ms, authentication requests under 30 seconds, ensure API routes remain performant with token verification
**Constraints**: Must be stateless (no session storage), user data must be isolated by user_id, all endpoints must be protected, JWTs must include user_id, email, exp with strict validation
**Scale/Scope**: Per-user data isolation, 401 Unauthorized for invalid tokens, secure token handling with proper expiration and error handling

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Security First**: All API access must be secured with JWT authentication ✓
2. **Clean Separation**: Maintain clear separation between UI (frontend), API (backend), and database layers ✓
3. **Authentication Enforcement**: Better Auth must issue JWT tokens on frontend; FastAPI must verify JWT using shared secret ✓
4. **Monorepo Organization**: Structure the codebase with /frontend for Next.js + Better Auth, /backend for FastAPI + SQLModel + JWT middleware ✓
5. **Database Requirements**: Use Neon PostgreSQL with SQLModel ORM ✓
6. **REST API Standards**: All endpoints must validate JWT and enforce user_id matching ✓

## Project Structure

### Documentation (this feature)

```text
specs/1-auth-integration/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── task.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── jwt_middleware.py
│   └── api/
│       ├── __init__.py
│       └── v1/
│           ├── __init__.py
│           └── endpoints/
│               ├── __init__.py
│               └── tasks.py
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   └── tasks/
│   │       └── index.tsx
│   ├── services/
│   │   └── api.ts
│   └── lib/
│       └── auth.ts
└── tests/
```

**Structure Decision**: Selected the web application structure with separate backend and frontend directories to maintain clean separation between UI (frontend), API (backend), and database layers as required by the constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
|           |            |                                     |
