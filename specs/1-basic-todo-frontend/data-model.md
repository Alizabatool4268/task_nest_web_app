# Task Data Model

## Entity Definition

### Task
Represents a single todo item with properties supporting both current frontend requirements and future backend integration.

#### Fields
- **id**: `string` (required) - Unique identifier for the task
- **title**: `string` (required) - The main text of the task
- **description**: `string` (optional) - Additional details about the task
- **completed**: `boolean` (required) - Whether the task is completed
- **priority**: `string` (optional) - Priority level (e.g., "low", "medium", "high")
- **tags**: `string[]` (optional) - Array of tags associated with the task
- **due_date**: `string` (optional) - Due date in ISO string format
- **recurring**: `string` (optional) - Recurrence pattern (e.g., "daily", "weekly", "monthly")
- **created_at**: `string` (required) - Timestamp when the task was created in ISO format

## Validation Rules
- `title` must not be empty or consist only of whitespace
- `id` must be unique within the user's task list
- `completed` defaults to `false` when creating new tasks
- `created_at` is automatically set to current timestamp when creating new tasks

## State Transitions
- **New Task**: `completed: false`, `created_at: current_timestamp`
- **Toggle Completion**: `completed: !previous_completed_state`
- **Update**: Individual fields can be modified while preserving others
- **Delete**: Task is removed from the collection

## Future Compatibility
This data model is designed to be compatible with the backend Task model that will use:
- Same field names and types
- SQLModel/Pydantic schema alignment
- User ID scoping for multi-user support