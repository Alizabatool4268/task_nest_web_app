# Implementation Plan: JWT-Based Authentication + User-Specific Task System

## Technical Context

### Current State
- FastAPI + SQLModel backend framework exists in backend/src/
- Neon PostgreSQL database available for use
- Existing folder structure with api/v1/endpoints/, models/, services/, utils/, database.py, main.py
- Need to implement JWT-based authentication and user-specific task isolation

### Requirements
- Implement JWT authentication flow (signup, login, me, logout endpoints)
- Password hashing using bcrypt or passlib
- JWT tokens containing user_id and expiration
- User model with id, name, email (unique), password_hash, created_at
- Task model with id, title, description, completed, user_id (foreign key)
- All task routes must require valid JWT and enforce user ownership
- Neon PostgreSQL database integration using SQLModel

### Constraints
- All code must be placed in backend/src/ folder following existing structure
- Must use FastAPI + SQLModel + Neon PostgreSQL
- JWT authentication must be enforced on all task endpoints
- Users can only access their own tasks
- Passwords must be hashed using bcrypt or passlib
- Follow existing code patterns and folder structure

### Unknowns
- JWT secret key configuration approach
- Token expiration duration
- Database connection setup details

## Constitution Check

### Relevant Principles
- Security First: All API access must be secured with JWT authentication; user data must be isolated so each user sees only their own tasks
- Clean Separation: Maintain clear separation between API endpoints, services, models, and utility functions
- Authentication Enforcement: FastAPI must verify JWT using shared secret; every backend request must include Authorization header; enforce user_id scoping on all database queries

### Compliance Verification
- JWT authentication will be implemented on all protected endpoints
- User data isolation will be enforced by checking user_id in all task operations
- Passwords will be properly hashed using bcrypt/passlib
- Clear separation of concerns will be maintained with dedicated files for auth, models, services, and utils

### Potential Violations
- None identified - all implementation will comply with constitutional principles

## Research & Discovery

### Phase 0: Research Tasks
- Research JWT best practices for FastAPI applications
- Research SQLModel relationship patterns for user-task associations
- Research bcrypt/passlib integration with FastAPI and password hashing
- Research database connection patterns with Neon PostgreSQL

### Expected Outcomes
- Clear understanding of JWT implementation patterns in FastAPI
- Proper SQLModel relationship setup between User and Task models
- Secure password hashing implementation using bcrypt
- Proper database connection configuration

## Design & Architecture

### Phase 1: Design Deliverables
- Complete User and Task models with proper relationships
- JWT utility functions for token creation and verification
- Auth service layer with signup, login, password hashing logic
- API endpoints for authentication and task management
- Database configuration and connection setup

### Data Model
- **User Model**: id (UUID/int), name, email (unique), password_hash, created_at
- **Task Model**: id, title, description, completed (bool), user_id (foreign key to User)
- Relationship: One User to Many Tasks (one-to-many)

### API Contracts
- **Auth Endpoints**:
  - POST /auth/signup → Create new user account
  - POST /auth/login → Authenticate user and return JWT
  - GET /auth/me → Get current user profile (requires JWT)
  - POST /auth/logout → Logout user (optional token blacklisting)
- **Task Endpoints**:
  - POST /tasks → Create new task for authenticated user
  - GET /tasks → Get all tasks for authenticated user
  - GET /tasks/{id} → Get specific task (must belong to user)
  - PUT /tasks/{id} → Update specific task (must belong to user)
  - DELETE /tasks/{id} → Delete specific task (must belong to user)

### Architecture Decisions
- Use dependency injection for current user retrieval from JWT
- Separate concerns: models for data, services for business logic, utils for utilities, endpoints for API
- Implement custom exception handlers for authentication errors
- Use SQLModel relationships for proper data modeling

## Implementation Plan

### Phase 0: Environment + Setup
- Create necessary directories if they don't exist (models, services, utils)
- Install required dependencies (fastapi, sqlmodel, bcrypt, python-jose[cryptography])
- Set up environment variables for JWT secret and database connection

### Phase 1: Models + Database Schema
- Create backend/src/models/user.py with User model containing id, name, email (unique), password_hash, created_at
- Create backend/src/models/task.py with Task model containing id, title, description, completed, user_id (foreign key)
- Define proper SQLModel relationships between User and Task
- Update database.py to include all models in the SQLModel registry

### Phase 2: JWT Utilities + Security Helpers
- Create backend/src/utils/jwt.py with functions for creating and verifying JWT tokens
- Implement functions for password hashing and verification using bcrypt
- Configure JWT secret key and algorithm constants
- Create reusable functions for token creation with user_id and expiration

### Phase 3: Auth Service Layer
- Create backend/src/services/auth_service.py with functions for user registration, login, password validation
- Implement user creation with password hashing
- Implement user authentication with password verification
- Handle duplicate email checking during registration
- Create helper functions for retrieving users by email

### Phase 4: Auth API Endpoints
- Create backend/src/api/v1/endpoints/auth.py with signup, login, me, logout endpoints
- Implement POST /auth/signup to create new users and return JWT tokens
- Implement POST /auth/login to authenticate users and return JWT tokens
- Implement GET /auth/me to return current user profile using JWT
- Implement JWT dependency to extract current user from token
- Return tokens in JSON format with access_token and token_type fields

### Phase 5: User-Owned Task Enforcement
- Update backend/src/api/v1/endpoints/tasks.py to require authentication on all endpoints
- Modify POST /tasks to associate new tasks with the authenticated user
- Modify GET /tasks to return only tasks belonging to the authenticated user
- Modify GET /tasks/{id}, PUT /tasks/{id}, DELETE /tasks/{id} to check task ownership before operations
- Implement ownership verification functions in services layer if needed

### Phase 6: Integration with main.py Router
- Register auth and tasks routers in backend/src/main.py
- Ensure proper APIRouter configuration with correct prefixes
- Verify all endpoints are accessible through the main application

### Phase 7: Testing Strategy
- Create test files for each component (models, services, endpoints)
- Test authentication flow (signup, login, token validation)
- Test task CRUD operations with proper user isolation
- Test edge cases (accessing other users' tasks, invalid tokens, duplicate emails)

### Phase 8: Final Verification Steps
- Test complete user flow: signup → login → create task → view tasks → update task → delete task
- Verify JWT token validation and expiration
- Confirm user isolation (users can't access other users' tasks)
- Validate all API contracts match the defined specifications

### Dependencies
- Phase 1 must be completed before Phase 2 (Models before JWT utilities)
- Phase 2 must be completed before Phase 3 (JWT utilities before Auth service)
- Phase 3 must be completed before Phase 4 (Auth service before Auth endpoints)
- Phase 4 must be completed before Phase 5 (Auth endpoints before Task enforcement)
- All previous phases must be completed before Phase 6 (Integration)

### Success Criteria
- Users can register and receive JWT tokens
- Users can login and receive JWT tokens
- Users can access their profile using JWT tokens
- Users can create tasks associated with their account
- Users can only view their own tasks
- Users can update and delete only their own tasks
- Attempts to access other users' tasks are properly rejected
- JWT tokens expire appropriately and reject invalid/expired tokens

## Risk Assessment

### Identified Risks
- JWT token security vulnerabilities if not implemented properly
- Database connection issues with Neon PostgreSQL
- Password security issues if bcrypt is not configured correctly
- User isolation failures leading to data exposure

### Mitigation Strategies
- Follow JWT best practices and use well-established libraries
- Test database connections thoroughly and handle connection errors gracefully
- Use proven bcrypt implementation patterns and verify password hashing
- Implement thorough user ID validation on all task operations
- Conduct security testing to verify user isolation
