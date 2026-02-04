# Data Model: Enhanced Task System

## Entity Definitions

### Task
Represents a user's task with enhanced metadata capabilities.

**Fields**:
- `id`: Integer (Primary Key) - Unique identifier for the task
- `title`: String (Required) - Title of the task
- `description`: String (Optional) - Description of the task
- `completed`: Boolean (Default: false) - Completion status of the task
- `created_at`: DateTime (Default: current timestamp) - Timestamp when task was created
- `updated_at`: DateTime (Default: current timestamp) - Timestamp when task was last updated
- `user_id`: String (Foreign Key) - Reference to the user who owns the task
- `tags`: JSON (Optional) - Array of string tags for categorizing the task
- `due_date`: DateTime (Optional) - Deadline for completing the task
- `priority`: String (Default: "medium", Constraint: "low"|"medium"|"high") - Priority level of the task
- `recurrence`: String (Optional, Constraint: "daily"|"weekly"|"monthly"|"yearly") - Recurrence pattern for recurring tasks

**Relationships**:
- Belongs to one User (via user_id foreign key)
- User has many Tasks

### TaskBase
Base model containing common fields shared across all task operations.

**Fields**:
- `title`: String (Required) - Title of the task
- `description`: String (Optional) - Description of the task
- `completed`: Boolean (Default: false) - Completion status of the task
- `created_at`: DateTime (Default: current timestamp) - Timestamp when task was created
- `updated_at`: DateTime (Default: current timestamp) - Timestamp when task was last updated
- `tags`: List[str] (Optional, Default: []) - Array of string tags for categorizing the task
- `due_date`: DateTime (Optional) - Deadline for completing the task
- `priority`: String (Default: "medium") - Priority level of the task (constrained to "low", "medium", "high")
- `recurrence`: String (Optional) - Recurrence pattern for recurring tasks (constrained to "daily", "weekly", "monthly", "yearly")

### TaskCreate
Model for creating new tasks.

**Fields**:
- All fields from TaskBase
- `user_id`: String (Required) - Reference to the user creating the task

### TaskUpdate
Model for updating existing tasks.

**Fields**:
- `title`: String (Optional) - Updated title of the task
- `description`: String (Optional) - Updated description of the task
- `completed`: Boolean (Optional) - Updated completion status of the task
- `updated_at`: DateTime (Default: current timestamp) - Updated timestamp when task was last modified
- `tags`: List[str] (Optional) - Updated array of string tags for categorizing the task
- `due_date`: DateTime (Optional) - Updated deadline for completing the task
- `priority`: String (Optional) - Updated priority level of the task (constrained to "low", "medium", "high")
- `recurrence`: String (Optional) - Updated recurrence pattern for recurring tasks (constrained to "daily", "weekly", "monthly", "yearly")

### TaskRead
Model for reading task data.

**Fields**:
- All fields from TaskBase
- `id`: Integer - Unique identifier for the task
- `user_id`: String - Reference to the user who owns the task

## Validation Rules

### Priority Validation
- Must be one of: "low", "medium", "high"
- Case-sensitive string matching
- Required field with default value "medium"

### Recurrence Validation
- Must be one of: "daily", "weekly", "monthly", "yearly"
- Case-sensitive string matching
- Optional field

### Tags Validation
- Must be an array of strings
- Individual tag strings should not exceed 50 characters
- Maximum of 10 tags per task

### Due Date Validation
- Must be a valid ISO 8601 datetime string
- Can be in the past, present, or future
- Optional field

## State Transitions

### Task Creation
1. User initiates task creation with required fields
2. System validates all input fields according to rules
3. System assigns current timestamp to created_at and updated_at
4. System sets default priority to "medium" if not provided
5. System creates the task record linked to the user

### Task Update
1. User initiates task update with optional fields
2. System validates any provided fields according to rules
3. System updates only the fields that are provided
4. System updates the updated_at timestamp
5. System saves the changes to the task record

### Task Completion
1. User toggles completion status
2. System updates the completed field
3. System updates the updated_at timestamp
4. System saves the changes to the task record

## Indexes

### Required Indexes
- Index on user_id for efficient user-based queries
- Composite index on (user_id, completed) for efficient filtering
- Index on due_date for efficient date-based queries (optional, based on usage patterns)