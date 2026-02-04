# Research: Backend Task Feature Expansion

## Decision: Field Types for New Task Attributes
**Rationale**: Need to determine appropriate data types for the new fields that align with SQLModel/FastAPI conventions and requirements.
**Alternatives considered**:
- tags: JSON field vs Array field vs Text field with delimiters
- due_date: datetime vs date vs string
- priority: enum vs string with validation
- recurrence: enum vs string with validation

**Chosen approach**:
- tags: List[str] with JSON serialization in SQLModel
- due_date: datetime.datetime field
- priority: String field with Pydantic validator for enum-like behavior
- recurrence: String field with Pydantic validator for enum-like behavior

## Decision: Validation Approach
**Rationale**: Need to enforce constraints on priority and recurrence values without using database-level enums which may be more difficult to modify later.
**Alternatives considered**:
- Database-level enums vs Application-level validation
- Pydantic validators vs SQLModel Field constraints

**Chosen approach**: Use Pydantic validators in combination with SQLModel Field constraints for maximum flexibility and proper API validation.

## Decision: Default Values and Nullability
**Rationale**: Need to determine which fields are required vs optional, and what default values to use.
**Alternatives considered**:
- All fields required vs selective required fields
- Different default values for priority

**Chosen approach**:
- priority: defaults to "medium" (required field)
- tags: optional, defaults to empty list
- due_date: optional, defaults to None
- recurrence: optional, defaults to None

## Decision: JSON Serialization for Tags
**Rationale**: Need to store an array of tags efficiently in the database.
**Alternatives considered**:
- Separate tags table with many-to-many relationship
- JSON field in the same table
- Comma-separated string field

**Chosen approach**: JSON field in the same table using SQLModel's JSON column type with Pydantic List[str] type hint for proper serialization.

## Decision: Service Layer Updates
**Rationale**: Need to update existing service methods to properly handle new fields.
**Alternatives considered**:
- Major refactoring vs minimal changes
- Separate service methods vs extending existing ones

**Chosen approach**: Extend existing service methods minimally to handle new fields, maintaining backward compatibility.

## Decision: Schema Recreation Strategy
**Rationale**: The spec requires full schema recreation on startup.
**Alternatives considered**:
- Alembic migrations vs full recreation
- Partial recreation vs full table recreation

**Chosen approach**: Maintain the existing approach of SQLModel.metadata.create_all(engine) which recreates tables if they don't exist or recreates them entirely in development.