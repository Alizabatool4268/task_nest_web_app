# Data Model: JWT-Based Authentication + User-Specific Task System

## Entity Definitions

### User Entity
**Description**: Represents an authenticated user of the system with personal account information

**Fields**:
- `id`: UUID (primary key) - Unique identifier for the user
- `name`: String - User's display name
- `email`: String (unique) - User's email address for login
- `password_hash`: String - Hashed password using bcrypt
- `created_at`: DateTime - Timestamp when user account was created

**Relationships**:
- One-to-Many: User has many Tasks (relationship: "tasks", back_populates: "owner")

### Task Entity
**Description**: Represents a user's personal task item

**Fields**:
- `id`: Integer (primary key) - Unique identifier for the task
- `title`: String - Title of the task
- `description`: String (optional) - Detailed description of the task
- `completed`: Boolean - Whether the task is completed or not
- `user_id`: UUID (foreign key) - Reference to the owning user
- `created_at`: DateTime - Timestamp when task was created
- `updated_at`: DateTime - Timestamp when task was last updated

**Relationships**:
- Many-to-One: Task belongs to one User (relationship: "owner", back_populates: "tasks")

## Database Schema

### Tables

#### users
```
id: UUID (PRIMARY KEY)
name: VARCHAR(255) NOT NULL
email: VARCHAR(255) UNIQUE NOT NULL
password_hash: TEXT NOT NULL
created_at: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
```

#### tasks
```
id: INTEGER (PRIMARY KEY, AUTO_INCREMENT)
title: VARCHAR(255) NOT NULL
description: TEXT
completed: BOOLEAN DEFAULT FALSE
user_id: UUID (FOREIGN KEY REFERENCES users.id)
created_at: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
updated_at: TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
```

## Validation Rules

### User Validation
- Email must be a valid email format
- Email must be unique across all users
- Name must not be empty
- Password must be hashed before storage

### Task Validation
- Title must not be empty
- User_id must reference an existing user
- Completed field defaults to False

## State Transitions

### Task State Transitions
- `completed = False` → `completed = True` (when task is marked as done)
- `completed = True` → `completed = False` (when task is marked as undone)

## Indexes
- Index on `users.email` for efficient login lookups
- Index on `tasks.user_id` for efficient user task queries
- Index on `tasks.completed` if filtering by completion status is common