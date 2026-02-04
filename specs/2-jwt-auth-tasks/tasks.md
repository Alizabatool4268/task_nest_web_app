# Implementation Tasks: JWT-Based Authentication + User-Specific Task System

## Phase 1: Setup and Project Structure

- [X] T001 Create backend/src directory structure if it doesn't exist
- [X] T002 [P] Create backend/src/models directory
- [X] T003 [P] Create backend/src/services directory
- [X] T004 [P] Create backend/src/utils directory
- [X] T005 [P] Create backend/src/api/v1/endpoints directory
- [X] T006 Install required dependencies: fastapi, sqlmodel, bcrypt, python-jose[cryptography], python-dotenv
- [X] T007 Create .env file with JWT_SECRET_KEY, JWT_ALGORITHM, JWT_ACCESS_TOKEN_EXPIRE_MINUTES, DATABASE_URL

## Phase 2: Foundational Components

- [X] T008 Create backend/src/database.py with SQLModel engine and session setup
- [X] T009 [P] Create backend/src/models/__init__.py to register models
- [X] T010 [P] Create backend/src/services/__init__.py
- [X] T011 [P] Create backend/src/utils/__init__.py
- [X] T012 [P] Create backend/src/api/v1/__init__.py
- [X] T013 [P] Create backend/src/api/v1/endpoints/__init__.py

## Phase 3: User Story 1 - User Registration and Login [US1]

### Goal
Enable new users to register with name, email, and password, and existing users to log in to receive JWT tokens.

### Independent Test Criteria
Can register a new user, log in, and verify that valid JWT tokens are returned and accepted by protected endpoints.

### Implementation Tasks

- [X] T014 [P] [US1] Create User model in backend/src/models/user.py with id, name, email (unique), password_hash, created_at
- [X] T015 [P] [US1] Create JWT utility functions in backend/src/utils/jwt.py for token creation and verification
- [X] T016 [P] [US1] Create password hashing utilities in backend/src/utils/security.py using bcrypt
- [X] T017 [US1] Create Auth service in backend/src/services/auth_service.py with signup, login, password validation
- [X] T018 [US1] Create auth endpoints in backend/src/api/v1/endpoints/auth.py with signup and login routes
- [X] T019 [US1] Implement POST /auth/signup endpoint that creates user and returns JWT
- [X] T020 [US1] Implement POST /auth/login endpoint that validates credentials and returns JWT
- [X] T021 [US1] Configure JWT dependency for extracting current user from token

## Phase 4: User Story 2 - Secure Task Management [US2]

### Goal
Allow authenticated users to create, view, update, and delete their personal tasks with proper user isolation.

### Independent Test Criteria
Can authenticate a user, create tasks, view user's tasks, update and delete them, while verifying that other users cannot access these tasks.

### Implementation Tasks

- [X] T022 [P] [US2] Create Task model in backend/src/models/task.py with id, title, description, completed, user_id (foreign key)
- [X] T023 [US2] Update database.py to include User and Task models in the registry
- [X] T024 [US2] Create task endpoints in backend/src/api/v1/endpoints/tasks.py with CRUD operations
- [X] T025 [US2] Implement GET /tasks endpoint to return only authenticated user's tasks
- [X] T026 [US2] Implement POST /tasks endpoint to create tasks for authenticated user
- [X] T027 [US2] Implement GET /tasks/{id} endpoint with user ownership validation
- [X] T028 [US2] Implement PUT /tasks/{id} endpoint with user ownership validation
- [X] T029 [US2] Implement DELETE /tasks/{id} endpoint with user ownership validation
- [X] T030 [US2] Create Task service in backend/src/services/task_service.py for user-specific operations

## Phase 5: User Story 3 - User Profile Access [US3]

### Goal
Allow authenticated users to retrieve their profile information through the protected /auth/me endpoint.

### Independent Test Criteria
Can authenticate a user and retrieve their profile information through the protected endpoint.

### Implementation Tasks

- [X] T031 [US3] Implement GET /auth/me endpoint that returns user profile using JWT
- [X] T032 [US3] Add proper response models for user profile data

## Phase 6: Integration and Security

### Goal
Integrate all components and ensure proper security measures are in place.

### Implementation Tasks

- [X] T033 Register auth and tasks routers in backend/src/main.py
- [X] T034 Add database session dependency injection to endpoints
- [X] T035 Implement proper error handling for authentication and authorization
- [X] T036 Add validation for duplicate email during registration
- [X] T037 Add validation for user ownership on task operations
- [X] T038 Add proper HTTP status codes and error responses
- [X] T039 Implement refresh token functionality (optional - skipped as not required for MVP)

## Phase 7: Polish and Cross-Cutting Concerns

### Goal
Final touches, documentation, and testing setup.

### Implementation Tasks

- [X] T040 Add proper logging throughout the application
- [X] T041 Add input validation for all endpoints
- [X] T042 Add rate limiting to authentication endpoints
- [X] T043 Add database indexes for efficient queries (email, user_id)
- [X] T044 Add proper documentation with Swagger/OpenAPI
- [X] T045 Update main.py with proper configuration and startup events
- [X] T046 Add proper shutdown events for database connection cleanup
- [X] T047 Add comprehensive error messages for all edge cases

## Dependencies

- T008 (database setup) must complete before T014, T022 (models)
- T014, T022 (models) must complete before T023 (registry update)
- T015, T016 (utils) must complete before T017 (auth service)
- T017 (auth service) must complete before T018, T019, T020, T031 (auth endpoints)
- T023 (database models) must complete before T024 (task endpoints)
- T024 (task endpoints) must complete before T033 (router registration)

## Parallel Execution Opportunities

- T002-T005: All directory creation tasks can run in parallel
- T009-T013: All __init__.py creation tasks can run in parallel
- T014, T015, T016: User model, JWT utils, and security utils can be developed in parallel
- T022, T024: Task model and task endpoints can be developed in parallel (after auth setup)

## Implementation Strategy

1. **MVP Scope**: Complete User Story 1 (T001-T021) for basic authentication functionality
2. **Incremental Delivery**: Add User Story 2 (T022-T029) for task management
3. **Enhancement**: Add User Story 3 (T030-T031) for profile access
4. **Polish**: Complete integration and polish phases (T032-T047)