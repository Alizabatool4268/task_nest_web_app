# Quickstart Guide: Enhanced Task System

## Overview
This guide explains how to implement the enhanced task system with new metadata fields (tags, due_date, priority, recurrence) while maintaining existing functionality.

## Implementation Steps

### Step 1: Update Task Models
Update the task model files to include new fields and validation:

1. Modify the Task model in `backend/src/models/task.py` to include:
   - tags field (JSON type, optional)
   - due_date field (DateTime type, optional)
   - priority field (String type with validation, default "medium")
   - recurrence field (String type with validation, optional)

2. Add Pydantic validators for priority and recurrence constraints

### Step 2: Update Pydantic Schemas
Update the Pydantic schemas (TaskBase, TaskCreate, TaskUpdate, TaskRead) to include new fields:
- TaskBase: Add new fields with appropriate defaults
- TaskCreate: Include new fields (tags, due_date, priority, recurrence)
- TaskUpdate: Make new fields optional for partial updates
- TaskRead: Include all fields for read operations

### Step 3: Update Service Layer
Update the TaskService in `backend/src/services/task_service.py` to handle new fields:
- Ensure create_task method handles new fields
- Ensure update_task method handles new fields properly
- Maintain existing functionality for backward compatibility

### Step 4: Update API Endpoints
Verify that the task endpoints in `backend/src/api/v1/endpoints/tasks.py` work with updated models:
- No changes needed to endpoint routes
- Ensure request/response validation works with new schemas

### Step 5: Test Schema Recreation
Verify that the database schema recreates properly with new fields:
- The existing `SQLModel.metadata.create_all(engine)` in main.py will handle this
- Test that new fields are created in the database

## Environment Setup

### Prerequisites
- Python 3.11+
- PostgreSQL database
- FastAPI and SQLModel dependencies

### Configuration
No special configuration needed beyond existing setup. The system will recreate the database schema on startup.

## Running the Enhanced System

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export DATABASE_URL="postgresql://user:password@localhost/dbname"
export JWT_SECRET_KEY="your-secret-key"
```

3. Start the application:
```bash
python -m uvicorn src.main:app --reload
```

4. The database schema will be recreated with new fields on startup

## API Usage Examples

### Creating a Task with New Fields
```bash
curl -X POST "http://localhost:8000/api/v1/tasks/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New task with metadata",
    "description": "Task description",
    "tags": ["work", "important"],
    "due_date": "2024-12-31T23:59:59",
    "priority": "high",
    "recurrence": "weekly"
  }'
```

### Updating a Task with New Fields
```bash
curl -X PUT "http://localhost:8000/api/v1/tasks/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "medium",
    "due_date": "2024-11-30T10:00:00"
  }'
```

### Retrieving Tasks with New Fields
```bash
curl -X GET "http://localhost:8000/api/v1/tasks/" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Validation Rules

### Priority Field
- Must be one of: "low", "medium", "high"
- Case-sensitive
- Defaults to "medium" if not provided

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

## Troubleshooting

### Schema Recreation Issues
If you encounter issues with schema recreation:
1. Verify database connectivity
2. Check that SQLModel models are properly defined
3. Ensure all dependencies are installed

### Validation Errors
If validation is not working as expected:
1. Check Pydantic validator implementations
2. Verify that API endpoints are using the correct schemas
3. Test with valid sample data

### Field Not Found Errors
If new fields are not appearing in the database:
1. Confirm that the application recreates the schema on startup
2. Check that model definitions are properly imported
3. Verify database connection and permissions