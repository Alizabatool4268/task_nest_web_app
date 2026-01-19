#!/bin/bash

# Bash script to setup planning environment
# Returns JSON with feature spec path, implementation plan path, specs dir, and branch

BRANCH=$(git branch --show-current)
FEATURE_NUMBER=$(echo $BRANCH | sed 's/^\([0-9]*\).*/\1/')
FEATURE_NAME=$(echo $BRANCH | sed 's/^[0-9]*-\(.*\)$/\1/')

FEATURE_SPEC="specs/$BRANCH/spec.md"
IMPL_PLAN="specs/$BRANCH/plan.md"
SPECS_DIR="specs"

# Create the plan directory if it doesn't exist
PLAN_DIR=$(dirname "$IMPL_PLAN")
mkdir -p "$PLAN_DIR"

# Create a basic plan template if it doesn't exist
if [ ! -f "$IMPL_PLAN" ]; then
    cat > "$IMPL_PLAN" << 'EOL'
# Implementation Plan: [FEATURE_NAME]

## Technical Context

### Current State
- [NEEDS CLARIFICATION: What is the current state of the system?]

### Requirements
- [NEEDS CLARIFICATION: What are the specific technical requirements?]

### Constraints
- [NEEDS CLARIFICATION: What are the technical constraints?]

### Unknowns
- [NEEDS CLARIFICATION: What technical decisions need to be made?]

## Constitution Check

### Relevant Principles
- [List applicable constitution principles]

### Compliance Verification
- [Verify compliance with each principle]

### Potential Violations
- [Note any potential conflicts with constitution]

## Research & Discovery

### Phase 0: Research Tasks
- [Research tasks to resolve unknowns]

### Expected Outcomes
- [What will be learned from research]

## Design & Architecture

### Phase 1: Design Deliverables
- [Design artifacts to be created]

### Data Model
- [Entity definitions and relationships]

### API Contracts
- [Interface definitions]

### Architecture Decisions
- [Technical architecture choices]

## Implementation Plan

### Phase 2: Implementation Tasks
- [Implementation tasks to be completed]

### Dependencies
- [Order of implementation tasks]

### Success Criteria
- [How to verify implementation success]

## Risk Assessment

### Identified Risks
- [Potential technical risks]

### Mitigation Strategies
- [How to mitigate identified risks]
EOL
fi

# Output JSON
cat << EOL
{
    "FEATURE_SPEC": "$FEATURE_SPEC",
    "IMPL_PLAN": "$IMPL_PLAN",
    "SPECS_DIR": "$SPECS_DIR",
    "BRANCH": "$BRANCH",
    "FEATURE_NUMBER": "$FEATURE_NUMBER",
    "FEATURE_NAME": "$FEATURE_NAME"
}
EOL