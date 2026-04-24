# Curriculum Workflow

The current course is CS1, but the platform is intended to grow into additional domains such as machine learning. Treat every large domain expansion as a generated or chunked content workflow, not as one massive JSON edit.

## Source Files

- Curriculum JSON: `frontend/AnkiAICardCreationFrontend/src/content/curriculum.json`
- Current CS1 generator: `frontend/AnkiAICardCreationFrontend/scripts/generate-cs1-curriculum.mjs`
- Content model: `frontend/AnkiAICardCreationFrontend/src/content/model.ts`
- Runtime validation: `frontend/AnkiAICardCreationFrontend/src/content/validate.ts`

## Safe Editing Rules

- Do not paste one massive JSON patch or a long inline shell heredoc.
- Large curriculum payloads can break agent tool UIs and make approval controls inaccessible.
- Prefer small patches, or edit a domain-specific generator and run a short npm command.
- Future domains such as ML should get their own generator, for example `scripts/generate-ml-curriculum.mjs`, or a small sequence of content patches.
- Keep domain generators focused. Do not put ML or other future-domain content into the CS1 generator.
- Keep content original. Do not copy wording, examples, exercises, or prompts from external courses.
- External course research is only for topic coverage and sequencing.
- Do not add curriculum-level licensing metadata such as `contentLicense` unless explicitly requested.

## Generator Behavior

Domain generators read `src/content/curriculum.json`, then regenerate or append their owned sections. The current CS1 generator regenerates:

- `lessons`
- `assessments`
- `reviews`

The CS1 generator depends on the existing CS1 `modules` and `skills` already present in `curriculum.json`.

If you manually edit generated lessons, assessments, or reviews owned by a generator, running that generator may overwrite those edits. For durable generated-content changes, update the relevant generator instead.

## Commands

Run these from `frontend/AnkiAICardCreationFrontend`:

```sh
npm run content:generate-cs1
```

Run all registered curriculum generators:

```sh
npm run content:generate
```

```sh
npm run content:validate
```

`content:validate` runs all registered generation, the production build/type-check/runtime content validation, and unit tests.

## Recommended Workflow For Future Agents

1. Decide which domain/course owns the change.
2. Inspect the relevant modules and skills in `curriculum.json`.
3. Make a small change to either the JSON structure or the domain generator.
4. Run `npm run content:validate`.
5. If validation fails, fix the smallest failing section before adding more content.
6. Repeat in chunks rather than batching a whole course expansion into one edit.
