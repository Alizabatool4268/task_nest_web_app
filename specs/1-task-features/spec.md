# Feature Specification: Expand Task Features + Recreate Task Tables

**Feature Branch**: `1-task-features`
**Created**: 2026-02-04
**Status**: Draft
**Input**: User description: "Expand Task Features + recreate Task Tables (Backend Only)
Target system: FastAPI + SQLModel backend located in the /src folder
 Focus: Expand task model fields and rebuild task tables without touching authentication or frontend
Objective:
 Add new task features (tags, due_date, priority, recurrence) and fully rebuild the task table by dropping the previous one. Ensure all CRUD endpoints remain unchanged but support the new fields.
Success criteria:
Task model (Task, TaskBase, TaskCreate, TaskRead, TaskUpdate) includes:
- tags
- due_date
- priority
- recurrence

No changes are made to:
- Authentication logic
- Auth endpoints
- Frontend code
- Existing task endpoint routes

Database schema is fully recreated on backend restart using SQLModel.metadata.create_all(engine)
CRUD logic correctly creates, updates, reads, and returns new fields
Validation rules enforce:
- priority ∈ {low, medium, high}
- recurrence ∈ {daily, weekly, monthly, yearly}

Implementation lives exclusively inside the src/ backend folder

Constraints:
Only modify backend code inside /src
Do not refactor unrelated code or restructure the backend
Do not introduce new dependencies
Do not change existing task paths (e.g., POST /tasks/, PATCH /tasks/{id}, etc.)
Make sure that the endpoints work properly
 - POST /tasks        → create task for logged-in user
 - GET /tasks         → list tasks for logged-in user
 - GET /tasks/{id}    → only if task belongs to user
 - PUT /tasks/{id}
 - DELETE /tasks/{id}

Not building:
No modifications to authentication endpoints or JWT logic
No frontend changes
No Alembic migrations or complex schema evolution
No new task recurrence engine (store value only)
No redesign of overall project architecture
No new routes or route renaming
No scheduler/cron jobs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enhanced Task Management (Priority: P1)

As a user, I want to create tasks with additional metadata including tags, due dates, priority levels, and recurrence patterns so that I can better organize and manage my tasks effectively.

**Why this priority**: This provides immediate value by allowing users to categorize, prioritize, and schedule their tasks with more precision, improving productivity.

**Independent Test**: Can be fully tested by creating a task with all new fields and verifying they are stored and retrieved correctly without affecting existing functionality.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** creating a new task with tags, due date, priority, and recurrence, **Then** the task is saved with all provided metadata and accessible through the existing endpoints
2. **Given** a user with existing tasks, **When** updating a task with new metadata fields, **Then** the task is updated successfully with the new information preserved
3. **Given** a user with tasks containing various priority levels, **When** listing tasks, **Then** all tasks display their priority information correctly

---

### User Story 2 - Filter and Sort Tasks by New Attributes (Priority: P2)

As a user, I want to be able to view my tasks filtered and sorted by priority, due date, tags, and recurrence so that I can focus on the most important and time-sensitive items.

**Why this priority**: This enhances the usability of the task management system by enabling better organization and prioritization of tasks.

**Independent Test**: Can be tested by retrieving tasks and verifying that they contain the new fields with correct values.

**Acceptance Scenarios**:

1. **Given** a user with tasks of different priorities, **When** viewing the task list, **Then** tasks display their priority level for easy identification
2. **Given** a user with recurring tasks, **When** viewing tasks, **Then** the recurrence pattern is visible to help with planning

---

### User Story 3 - Validate Task Metadata (Priority: P3)

As a system administrator, I want the system to validate task metadata to ensure data integrity and prevent invalid values from being stored.

**Why this priority**: This ensures data quality and prevents system errors caused by invalid input values.

**Independent Test**: Can be tested by attempting to create/update tasks with invalid values and verifying appropriate validation errors.

**Acceptance Scenarios**:

1. **Given** a user attempting to create a task, **When** providing an invalid priority level, **Then** the system returns an appropriate validation error
2. **Given** a user attempting to create a task, **When** providing an invalid recurrence pattern, **Then** the system returns an appropriate validation error

---

### Edge Cases

- What happens when a user provides a due date in the past?
- How does the system handle invalid priority values (not low, medium, or high)?
- How does the system handle invalid recurrence values (not daily, weekly, monthly, or yearly)?
- What occurs when tags exceed a reasonable length or contain special characters?
- How does the system handle tasks with empty or null values for the new fields?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support adding tags to tasks as an array of string values
- **FR-002**: System MUST support setting a due date for tasks as a date/time value
- **FR-003**: System MUST support setting priority level for tasks with values limited to low, medium, or high
- **FR-004**: System MUST support setting recurrence pattern for tasks with values limited to daily, weekly, monthly, or yearly
- **FR-005**: System MUST validate that priority values are restricted to {low, medium, high}
- **FR-006**: System MUST validate that recurrence values are restricted to {daily, weekly, monthly, yearly}
- **FR-007**: System MUST persist all new task fields in the database
- **FR-008**: System MUST return all new task fields when retrieving tasks via existing endpoints
- **FR-009**: System MUST allow updating individual task fields without affecting others
- **FR-010**: System MUST recreate the entire task table schema on backend restart
- **FR-011**: System MUST maintain all existing task endpoint routes without changes
- **FR-012**: System MUST ensure that only the task owner can access their tasks
- **FR-013**: System MUST maintain existing authentication logic for task endpoints

### Key Entities *(include if feature involves data)*

- **Task**: Represents a user's task with title, description, completion status, user relationship, and new fields (tags, due_date, priority, recurrence)
- **Tags**: Array of string values used to categorize and group tasks
- **Due Date**: Date/time value indicating when the task should be completed
- **Priority**: Enumerated value (low, medium, high) indicating task importance
- **Recurrence**: Enumerated value (daily, weekly, monthly, yearly) indicating task repetition pattern

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create tasks with all four new metadata fields (tags, due_date, priority, recurrence) through existing endpoints
- **SC-002**: System validates priority values and rejects any values outside the allowed set {low, medium, high}
- **SC-003**: System validates recurrence values and rejects any values outside the allowed set {daily, weekly, monthly, yearly}
- **SC-004**: All new task fields are properly persisted in the database and returned when retrieving tasks
- **SC-005**: Database schema recreation on backend restart successfully creates the updated task table with all new fields
- **SC-006**: Existing task functionality remains unchanged and all current endpoints continue to work as expected
- **SC-007**: 100% of existing task-related API endpoints continue to function with the enhanced task model