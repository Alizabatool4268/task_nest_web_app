# Implementation Plan: Backend Task Feature Expansion

**Branch**: `1-task-features` | **Date**: 2026-02-04 | **Spec**: [link to spec](spec.md)
**Input**: Feature specification from `/specs/1-task-features/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enhance the task management system by adding four new metadata fields (tags, due_date, priority, recurrence) to the Task model while maintaining all existing functionality. The database schema will be recreated on startup using SQLModel.metadata.create_all(engine), and all CRUD operations will be updated to support the new fields without changing existing endpoint routes.

## Technical Context

### Current State
- FastAPI backend with SQLModel ORM
- Task model currently has: id, title, description, completed, created_at, updated_at, user_id
- CRUD endpoints for tasks already implemented
- JWT authentication in place for user isolation
- Database schema recreated on startup using SQLModel.metadata.create_all(engine)

### Requirements
- Add tags field to Task model (array of strings)
- Add due_date field to Task model (datetime)
- Add priority field to Task model (enum: low, medium, high with default "medium")
- Add recurrence field to Task model (enum: daily, weekly, monthly, yearly, optional)
- Maintain all existing task functionality
- Preserve existing endpoint routes and authentication
- Implement proper validation for new fields

### Constraints
- Must not change existing authentication logic
- Must not modify frontend code
- Must not change existing endpoint routes
- Must not introduce new dependencies
- Database schema must be fully recreated on startup
- Implementation must be contained within /backend/src directory

### Unknowns
- Data types for new fields: tags (JSON/Text), due_date (datetime), priority (string enum), recurrence (string enum)
- Default values: priority="medium", other fields optional
- Validation approach: Pydantic validators for enum constraints

## Constitution Check

### Relevant Principles
- Security First: Authentication will be maintained, user data isolation preserved
- Clean Separation: Will maintain clear separation between API and database layers
- Minimal Viable Implementation: Building on existing task features
- Type Safety: Using Pydantic models with proper typing
- Authentication Enforcement: JWT authentication will remain unchanged
- Monorepo Organization: Will maintain existing structure in /backend/src

### Compliance Verification
- ✅ Security First: Authentication will be maintained, user data isolation preserved
- ✅ Clean Separation: Will maintain clear separation between API and database layers
- ✅ Minimal Viable Implementation: Building on existing task features
- ✅ Type Safety: Using Pydantic models with proper typing
- ✅ Authentication Enforcement: JWT authentication will remain unchanged
- ✅ Monorepo Organization: Will maintain existing structure in /backend/src

### Potential Violations
- Schema Recreation: Required by spec - full table rebuild instead of incremental migration

## Research & Discovery (Phase 0 Complete)

### Research Outcomes
- Field types determined: tags (JSON/List[str]), due_date (datetime), priority (string with validation), recurrence (string with validation)
- Validation approach confirmed: Pydantic validators combined with SQLModel Field constraints
- Default values established: priority="medium", others optional
- JSON serialization approach for tags confirmed

### Resolved Unknowns
- Data types for new fields: tags (JSON/Text), due_date (datetime), priority (string enum), recurrence (string enum)
- Default values: priority="medium", other fields optional
- Validation approach: Pydantic validators for enum constraints

## Design & Architecture (Phase 1 Complete)

### Phase 1: Design Deliverables
- ✅ Updated Task model with new fields and validation (data-model.md)
- ✅ Updated TaskCreate, TaskUpdate, TaskRead schemas (data-model.md)
- ✅ API contracts for enhanced task operations (contracts/task-api-contract.md)
- ✅ Data model documentation (data-model.md)
- ✅ Quickstart guide (quickstart.md)

### Data Model
- Task entity extended with: tags (JSON/Array), due_date (DateTime), priority (String with enum constraint), recurrence (String with enum constraint)
- Priority defaults to "medium", other fields optional
- Proper foreign key relationship maintained with User

### API Contracts
- Existing endpoints maintained with enhanced request/response schemas
- Request validation for new field constraints (priority, recurrence enums)
- Response includes all new fields when present

### Architecture Decisions
- Use SQLModel's Field constraints for validation where possible
- Use Pydantic validators for enum-style validation
- Leverage existing service layer architecture
- Maintain database recreation approach per spec requirements

## Implementation Plan (Phase 2 Pending)

### Phase 2: Implementation Tasks
- [ ] Update Task model with new fields and validation
- [ ] Update TaskBase, TaskCreate, TaskUpdate, TaskRead classes
- [ ] Update task service methods to handle new fields
- [ ] Test all CRUD operations with new fields
- [ ] Verify database schema recreation works with new structure

### Dependencies
- Update models first, then services, then endpoints
- Schema recreation must work after model changes
- Validation must be implemented before full testing

### Success Criteria
- [ ] All new fields properly stored and retrieved
- [ ] Validation constraints enforced correctly
- [ ] Existing functionality remains unchanged
- [ ] Database schema recreates properly with new fields
- [ ] All endpoints work as expected with enhanced models

## Risk Assessment

### Identified Risks
- Data loss during schema recreation (mitigated by accepting it per spec)
- Validation complexity with string enums
- Compatibility issues with existing service layer methods

### Mitigation Strategies
- Accept data loss as part of spec requirements
- Use established Pydantic validation patterns
- Extend existing service methods rather than rewriting
