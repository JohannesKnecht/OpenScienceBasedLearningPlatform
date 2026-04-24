# Contributing Content

## Goal

Content should eventually enter this repository through pull requests.

The most important working file is currently:

- `frontend/AnkiAICardCreationFrontend/src/content/curriculum.json`

For larger curriculum changes, also read:

- `docs/curriculum-workflow.md`

## Ground Rules

1. Do not submit copied proprietary content.
2. Do not reuse brand or product text from other platforms.
3. Content must be original or otherwise usable in this repository.
4. Model prerequisites at the skill level.
5. Lessons explain, assessments test, and reviews reinforce.

## Expected Quality For New Content

New content should:

- have clear IDs
- be subject-matter atomic
- have a sensible prerequisite structure
- reference the existing curriculum correctly
- avoid broken references

## Recommended Contribution Flow

1. Review the relevant existing skills and modules.
2. Define new skill IDs.
3. Set `prerequisiteSkillIds`.
4. Add the lesson.
5. Add the assessment.
6. Add the review.
7. Keep all cross-references consistent.

## Editing The Central JSON File

Because the curriculum currently lives in one large file:

- change only one coherent content area per pull request
- keep IDs consistent
- respect the existing ordering
- avoid unnecessary reformatting
- do not use very large JSON patches or long inline heredocs
- for all registered generators, run `npm run content:generate` and then `npm run content:validate` from the frontend directory
- for CS1-only generator changes, `npm run content:generate-cs1` can be used directly
- for ML1-only generator changes, `npm run content:generate-ml1` can be used directly
- new domains should get their own generators or small patch sequences, not one giant JSON patch

## Content Questions For Contributors

Before opening a PR, be clear about:

- which skills are being introduced
- which existing skills are prerequisites
- how the system can later recognize mastery
- which review mechanism is appropriate for these skills

## Open Infrastructure For Community Contributions

These items should be added later:

- JSON Schema for CI
- automated graph checks in GitHub Actions
- PR template for confirming content origin
- style guide for tone and instructional depth
- moderation process for larger content packages
