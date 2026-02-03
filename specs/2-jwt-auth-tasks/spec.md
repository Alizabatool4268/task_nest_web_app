# Feature Specification: jwt-auth-tasks

**Feature Branch**: `2-jwt-auth-tasks`
**Created**: 2026-02-03
**Status**: Draft
**Input**: User description: "Build JWT-Based Authentication + User-Specific Task System for Hackathon App

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
- Compatible with Next.js frontend using fetch()"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Registration and Login (Priority: P1)

A new user visits the application and wants to create an account, then log in to access their personal task list. The user registers with their name and email, sets a password, receives authentication tokens, and can then securely access the application.

**Why this priority**: This is the foundational user journey that enables all other functionality - without authentication, users cannot access personalized tasks.

**Independent Test**: Can be fully tested by registering a new user, logging in, and verifying that valid JWT tokens are returned and accepted by protected endpoints.

**Acceptance Scenarios**:

1. **Given** user is not registered, **When** user submits registration form with valid name, email, and password, **Then** new account is created and user receives JWT access token
2. **Given** user has valid account credentials, **When** user submits login form with correct email and password, **Then** user receives valid JWT access token

---

### User Story 2 - Secure Task Management (Priority: P1)

An authenticated user wants to create, view, update, and delete their personal tasks. The user can only see and modify tasks that belong to them, ensuring data privacy and isolation between users.

**Why this priority**: This is the core functionality that provides value to users - the ability to manage their personal tasks securely.

**Independent Test**: Can be fully tested by authenticating a user, creating tasks, viewing the user's tasks, updating and deleting them, while verifying that other users cannot access these tasks.

**Acceptance Scenarios**:

1. **Given** user is authenticated with valid JWT, **When** user creates a new task, **Then** task is saved with user association and accessible only to that user
2. **Given** user is authenticated with valid JWT, **When** user requests their task list, **Then** only tasks belonging to that user are returned
3. **Given** user is authenticated with valid JWT, **When** user attempts to access another user's task, **Then** access is denied with appropriate error

---

### User Story 3 - User Profile Access (Priority: P2)

An authenticated user wants to view their profile information to confirm their account details are correct. The user can access their profile using their authentication token.

**Why this priority**: This enhances user experience by allowing users to verify their account information, though it's secondary to core task management.

**Independent Test**: Can be fully tested by authenticating a user and retrieving their profile information through the protected endpoint.

**Acceptance Scenarios**:

1. **Given** user is authenticated with valid JWT, **When** user requests their profile information, **Then** user's account details (name, email) are returned

---

### Edge Cases

- What happens when a user tries to register with an email that already exists?
- How does system handle expired JWT tokens?
- What happens when a user tries to access a task that doesn't exist?
- How does the system handle malformed JWT tokens?
- What occurs when a user tries to update another user's task?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to register with name, email, and password
- **FR-002**: System MUST hash passwords using bcrypt or passlib before storing
- **FR-003**: System MUST allow users to log in with email and password
- **FR-004**: System MUST return JWT access tokens upon successful authentication
- **FR-005**: System MUST validate JWT tokens for all protected endpoints
- **FR-006**: System MUST store user data (id, name, email, password_hash, created_at) in Neon PostgreSQL database
- **FR-007**: System MUST store task data (id, title, description, completed, user_id) in Neon PostgreSQL database
- **FR-008**: System MUST allow authenticated users to create tasks associated with their account
- **FR-009**: System MUST allow authenticated users to view only their own tasks
- **FR-010**: System MUST allow authenticated users to update their own tasks
- **FR-011**: System MUST allow authenticated users to delete their own tasks
- **FR-012**: System MUST prevent users from accessing tasks that belong to other users
- **FR-013**: System MUST allow authenticated users to retrieve their profile information
- **FR-014**: System MUST ensure JWT tokens contain user_id and expiration information
- **FR-015**: System MUST return tokens in JSON format with access_token and token_type fields

### Key Entities *(include if feature involves data)*

- **User**: Represents an authenticated user of the system with personal account information; contains id, name, email (unique), password_hash, and created_at timestamp
- **Task**: Represents a user's personal task item; contains id, title, description, completed status boolean, and user_id foreign key linking to User entity

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully register and receive valid JWT authentication tokens within 5 seconds
- **SC-002**: Users can log in and receive JWT authentication tokens within 3 seconds
- **SC-003**: Authenticated users can create, read, update, and delete their own tasks with 99% success rate
- **SC-004**: Users can only access tasks that belong to them - zero cross-user data access occurs
- **SC-005**: JWT tokens expire appropriately according to configured duration and reject invalid/expired tokens
- **SC-006**: System handles at least 100 concurrent authenticated users without performance degradation

