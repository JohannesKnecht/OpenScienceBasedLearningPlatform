# Content Model

## Goal

The curriculum should be loaded entirely from one central JSON file over time.

The file is not just a content container. It is the production description of the learning graph.

## Core Principles

1. Skills are the core unit.
2. Lessons explain skills.
3. Assessments test skills.
4. Reviews stabilize skills over time.
5. Modules and courses are curated views of the same skill graph.

## Top-Level Structure

```json
{
  "schemaVersion": "1.0",
  "metadata": {},
  "tracks": [],
  "courses": [],
  "modules": [],
  "skills": [],
  "lessons": [],
  "assessments": [],
  "reviews": [],
  "xp": {}
}
```

## Entities

### tracks

The highest curated level.

Examples:

- Computer Science Foundations
- Data Structures
- Algorithms

### courses

A coherent learning path inside a track.

Examples:

- Computational Thinking Core
- Python Foundations
- Data Structures I

### modules

Instructional groups inside a course.

Examples:

- Program State
- Control Flow
- Debugging Mindset

### skills

The most important subject-matter unit.

Every skill needs:

- `id`
- `title`
- `description`
- `prerequisiteSkillIds`
- references to matching lessons, assessments, and reviews

### lessons

Lessons explain a small cluster of skills and should usually be tightly focused.

Every lesson should contain:

- a learning objective
- `prerequisiteSkillIds`
- explanatory sections
- worked examples
- exactly one entry point into an assessment

### assessments

Assessments explicitly test skills.

Current types:

- `diagnostic`
- `lesson-check`
- `review`

Possible future types:

- `module-check`
- `course-exam`
- `mixed-review`

### reviews

Reviews connect one skill to one review assessment and one interval.

This makes the retention loop explicit in the curriculum.

## Prerequisites

Prerequisites are always modeled at the skill level.

Not recommended:

- Lesson A as a prerequisite for Lesson B

Recommended:

- Skill X as a prerequisite for Skill Y
- Lesson B references Skill Y

This is more stable and reusable.

## IDs

IDs must be:

- stable
- unique
- slug-like
- never reused for different content

## Validation

The curriculum is currently validated when it is loaded.

Checks include:

- duplicate IDs
- missing references
- prerequisite cycles

Validation lives in:

- `frontend/AnkiAICardCreationFrontend/src/content/validate.ts`

## Future Model Work

The model should eventually be extended with:

- localized text
- difficulty metadata per item
- multi-step hints
- misconceptions and error patterns
- rich content blocks
- mathematical or code-based answer types
- versioning and review metadata for contributors
