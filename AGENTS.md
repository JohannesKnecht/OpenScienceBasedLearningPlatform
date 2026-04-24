# Instructions

- Always create PRs to the 'dev' branch, and not to main.
- Make the smallest possible change; do not refactor files unless explicitly requested.
- GitHub Copilot cloud/coding agents should also read `.github/copilot-instructions.md`; keep that file and this file aligned when changing agent workflow rules.
- When working on the JSON curriculum, work iteratively to avoid context-window, tool-payload, and review-UI failures.
- For large curriculum expansions in any domain, never paste one massive JSON patch or a long inline shell heredoc. Earlier attempts failed because the tool/approval UI could not reliably handle oversized payloads and the accept button could become inaccessible.
- Prefer small patches, or edit domain-specific generator/script files and run short commands. The current generators are `frontend/AnkiAICardCreationFrontend/scripts/generate-cs1-curriculum.mjs` and `frontend/AnkiAICardCreationFrontend/scripts/generate-ml1-curriculum.mjs`; future domains should get their own generator or small content patch sequence instead of being appended through a huge prompt.
- From `frontend/AnkiAICardCreationFrontend`, use `npm run content:generate` for all registered curriculum generators, `npm run content:generate-cs1` for only CS1, or `npm run content:generate-ml1` for only ML1.
- After each major curriculum section or generator change, run `npm run content:validate` from `frontend/AnkiAICardCreationFrontend`. This runs registered generation, build/type-check/runtime content validation, and unit tests.
- The curriculum must remain original. Do not copy text, exercises, problem statements, or proprietary course material from external syllabi or websites. Use external research only to understand topic coverage and sequencing, then write new content.
- Do not add curriculum-level licensing metadata such as `contentLicense` unless explicitly requested.
