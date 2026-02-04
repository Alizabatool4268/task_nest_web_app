# Data Model: Authentication Integration

## Overview
This document defines the data entities and relationships for the authentication system.

## User Entity
- **Entity Name**: User
- **Description**: Represents an authenticated user in the system
- **Fields**:
  - `id`: String (primary identifier from Better Auth)
  - `email`: String (user's email address, unique)
  - `created_at`: DateTime (timestamp when user was created)
  - `updated_at`: DateTime (timestamp when user was last updated)
- **Relationships**:
  - One-to-Many: User has many Tasks
- **Validation Rules**:
  - Email must be a valid email format
  - Email must be unique across all users

## Task Entity
- **Entity Name**: Task
- **Description**: Represents a user's personal task
- **Fields**:
  - `id`: Integer (auto-generated primary key)
  - `user_id`: String (foreign key referencing User.id)
  - `title`: String (task title, required)
  - `description`: String (optional task description)
  - `completed`: Boolean (task completion status, default: false)
  - `priority`: String (task priority level: low, medium, high, default: medium)
  - `tags`: JSON (optional array of tags for categorization)
  - `due_date`: DateTime (optional deadline for the task)
  - `recurring`: Boolean (whether task repeats, default: false)
  - `created_at`: DateTime (timestamp when task was created, UTC)
  - `updated_at`: DateTime (timestamp when task was last updated, UTC)
- **Relationships**:
  - Many-to-One: Task belongs to one User
- **Validation Rules**:
  - Title must be provided and not empty
  - Priority must be one of: 'low', 'medium', 'high'
  - User_id must reference an existing User

## JWT Token Structure
- **Entity Name**: JWT Token
- **Description**: Authentication token containing user identification
- **Claims**:
  - `user_id`: String (unique identifier for the user)
  - `email`: String (user's email address)
  - `exp`: Integer (Unix timestamp for token expiration)
  - `iat`: Integer (Unix timestamp for token issuance)
  - `sub`: String (subject identifier, same as user_id)
- **Validation Rules**:
  - Token must be properly signed with BETTER_AUTH_SECRET
  - Token must not be expired at time of verification
  - Token signature must be valid
  - All required claims (user_id, email, exp) must be present and properly typed
  - Token must not be malformed or tampered with
  - Token must be properly formatted (header.payload.signature)

## State Transitions
- **User Authentication Flow**:
  1. User registers → User record created in system
  2. User logs in → JWT token issued
  3. Token attached to requests → User identity verified
  4. Token expires → User must re-authenticate

- **Task Lifecycle**:
  1. Task created → Assigned to authenticated user
  2. Task updated → Ownership verified via user_id
  3. Task completed → Status updated while maintaining ownership
  4. Task deleted → Only owner can delete their tasks

## Constraints
- All operations must be filtered by user_id to maintain data isolation
- User_id in JWT must match the user_id in database records
- Foreign key constraints must be enforced between User and Task entities
- JWT tokens must be validated for presence, type, and validity of all required claims
- Expired or malformed tokens must be rejected with 401 Unauthorized response