#!/bin/bash

FEATURE_DESC="$1"
NUMBER="$2"
SHORT_NAME="$3"

# Create specs directory if it doesn't exist
mkdir -p specs

# Create feature directory
FEATURE_DIR="specs/$NUMBER-$SHORT_NAME"
mkdir -p "$FEATURE_DIR"

# Create spec file
SPEC_PATH="$FEATURE_DIR/spec.md"
if [ ! -f "$SPEC_PATH" ]; then
    cat > "$SPEC_PATH" << 'EOL'
# [SHORT_NAME_PLACEHOLDER]

## Overview

[Overview of the feature]

## User Scenarios & Testing

[Scenarios for how users will interact with the feature]

## Functional Requirements

[Detailed requirements for the feature]

## Success Criteria

[Measurable outcomes that indicate the feature is successful]

## Non-Functional Requirements

[Performance, security, usability, etc. requirements]

## Key Entities

[Data models or entities involved in the feature]

## Assumptions

[Any assumptions made during specification]

## Dependencies

[Any dependencies on other features, systems, or resources]

## Scope

[What is included and what is not included in this feature]

EOL
fi

# Replace placeholder with actual short name
sed -i.bak "s/\[SHORT_NAME_PLACEHOLDER\]/$SHORT_NAME/g" "$SPEC_PATH"

# Create and checkout branch
BRANCH_NAME="$NUMBER-$SHORT_NAME"
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout -B "$BRANCH_NAME"

# Output JSON with branch name and spec file path
cat << EOL
{
    "BRANCH_NAME": "$BRANCH_NAME",
    "SPEC_FILE": "$SPEC_PATH"
}
EOL