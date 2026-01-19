#!/bin/bash

# Bash script to check prerequisites for analysis
# Returns JSON with feature directory and available docs

BRANCH=$(git branch --show-current)
FEATURE_DIR="specs/$BRANCH"

# Check which docs exist
SPEC_EXISTS="false"
PLAN_EXISTS="false"
TASKS_EXISTS="false"

if [ -f "$FEATURE_DIR/spec.md" ]; then
    SPEC_EXISTS="true"
fi

if [ -f "$FEATURE_DIR/plan.md" ]; then
    PLAN_EXISTS="true"
fi

if [ -f "$FEATURE_DIR/tasks.md" ]; then
    TASKS_EXISTS="true"
fi

# Output JSON
cat << EOL
{
    "FEATURE_DIR": "$FEATURE_DIR",
    "AVAILABLE_DOCS": {
        "SPEC": $SPEC_EXISTS,
        "PLAN": $PLAN_EXISTS,
        "TASKS": $TASKS_EXISTS
    }
}
EOL