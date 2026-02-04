# API Contract: Enhanced Task Operations

## Overview
This document defines the API contracts for the enhanced task system with additional metadata fields.

## Base URL
`http://localhost:8000/api/v1`

## Authentication
All endpoints require JWT authentication in the Authorization header:
`Authorization: Bearer <JWT_TOKEN>`

## Task Models

### Task Object
```json
{
  "id": 1,
  "user_id": "user-uuid-string",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "2024-01-01T10:00:00",
  "updated_at": "2024-01-01T10:00:00",
  "tags": ["tag1", "tag2"],
  "due_date": "2024-12-31T23:59:59",
  "priority": "medium",
  "recurrence": "weekly"
}
```

#### Fields
- `id` (integer): Unique identifier for the task
- `user_id` (string): ID of the user who owns the task
- `title` (string, required): Title of the task
- `description` (string, optional): Description of the task
- `completed` (boolean): Whether the task is completed
- `created_at` (string, datetime): When the task was created
- `updated_at` (string, datetime): When the task was last updated
- `tags` (array of strings, optional): Tags associated with the task
- `due_date` (string, datetime, optional): Due date of the task
- `priority` (string, required): Priority level - one of "low", "medium", "high"
- `recurrence` (string, optional): Recurrence pattern - one of "daily", "weekly", "monthly", "yearly"

## Endpoints

### Create Task
`POST /tasks/`

Creates a new task for the authenticated user.

#### Request
```json
{
  "title": "New task",
  "description": "Task description",
  "tags": ["work", "important"],
  "due_date": "2024-12-31T23:59:59",
  "priority": "high",
  "recurrence": "weekly"
}
```

#### Response - 200 OK
Returns the created Task object.

#### Response - 400 Bad Request
Invalid input data.

#### Response - 401 Unauthorized
Invalid or missing authentication token.

#### Response - 403 Forbidden
User attempting to create task for another user.

### Get All Tasks
`GET /tasks/`

Retrieves all tasks for the authenticated user.

#### Response - 200 OK
```json
[
  {
    "id": 1,
    "user_id": "user-uuid-string",
    "title": "Task 1",
    "description": "Description",
    "completed": false,
    "created_at": "2024-01-01T10:00:00",
    "updated_at": "2024-01-01T10:00:00",
    "tags": ["personal"],
    "due_date": "2024-12-31T23:59:59",
    "priority": "medium",
    "recurrence": null
  }
]
```

#### Response - 401 Unauthorized
Invalid or missing authentication token.

### Get Task by ID
`GET /tasks/{task_id}`

Retrieves a specific task for the authenticated user.

#### Parameters
- `task_id` (integer): ID of the task to retrieve

#### Response - 200 OK
Returns the Task object.

#### Response - 401 Unauthorized
Invalid or missing authentication token.

#### Response - 404 Not Found
Task not found or does not belong to the user.

### Update Task
`PUT /tasks/{task_id}`

Updates a specific task for the authenticated user.

#### Parameters
- `task_id` (integer): ID of the task to update

#### Request
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "tags": ["updated", "tags"],
  "due_date": "2024-11-30T15:30:00",
  "priority": "low",
  "recurrence": "monthly"
}
```

All fields are optional - only provided fields will be updated.

#### Response - 200 OK
Returns the updated Task object.

#### Response - 400 Bad Request
Invalid input data.

#### Response - 401 Unauthorized
Invalid or missing authentication token.

#### Response - 404 Not Found
Task not found or does not belong to the user.

### Delete Task
`DELETE /tasks/{task_id}`

Deletes a specific task for the authenticated user.

#### Parameters
- `task_id` (integer): ID of the task to delete

#### Response - 200 OK
```json
{
  "message": "Task deleted successfully"
}
```

#### Response - 401 Unauthorized
Invalid or missing authentication token.

#### Response - 404 Not Found
Task not found or does not belong to the user.

## Validation Rules

### Priority Field
- Must be one of: "low", "medium", "high"
- Case-sensitive
- Required field with default "medium" when creating

### Recurrence Field
- Must be one of: "daily", "weekly", "monthly", "yearly"
- Case-sensitive
- Optional field

### Tags Field
- Must be an array of strings
- Each tag should be a valid string

### Due Date Field
- Must be a valid ISO 8601 datetime string
- Optional field

### Title Field
- Required field
- Must be a non-empty string

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Validation error: priority must be one of 'low', 'medium', 'high'"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Cannot create task for another user"
}
```

### 404 Not Found
```json
{
  "detail": "Task not found or does not belong to user"
}
```