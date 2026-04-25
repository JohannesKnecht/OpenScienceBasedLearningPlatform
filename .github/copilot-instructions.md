# Repository Instructions For Copilot Coding Agents

- Open pull requests against `dev`, not `main`.
- Make the smallest correct change. Do not refactor unrelated files.
- Read `AGENTS.md` as the canonical agent workflow reference; keep this file aligned with it when changing workflow rules.
- The main frontend lives in `frontend/AnkiAICardCreationFrontend`.
- The curriculum source of truth is `frontend/AnkiAICardCreationFrontend/src/content/curriculum.json`.
- The current generated curriculum helpers are `frontend/AnkiAICardCreationFrontend/scripts/generate-cs1-curriculum.mjs` and `frontend/AnkiAICardCreationFrontend/scripts/generate-ml1-curriculum.mjs`.
- For curriculum edits in any domain, prefer editing a domain-specific generator or making small JSON patches. Do not paste one massive JSON patch or a long inline heredoc.
- Oversized curriculum payloads previously broke the tool/approval UI and made the accept button inaccessible. Use short commands such as `npm run content:generate`, `npm run content:generate-cs1`, or `npm run content:generate-ml1` instead.
- Future domains should get their own generator or small patch sequence; do not overload existing course generators with unrelated course content.
- After curriculum or generator edits, run `npm run content:validate` from `frontend/AnkiAICardCreationFrontend`.
- Curriculum content must be original. External syllabi may be used only for topic coverage and sequencing research; do not copy lesson text, examples, exercises, prompts, or proprietary material.
- Do not add curriculum-level licensing metadata such as `contentLicense` unless explicitly requested.
- Every lesson must use exactly this format and must not deviate: `Lesson: <instructional content>`, `Worked example: <example question>`, `Solution: <worked solution>`, `Question: <multiple-choice user question>`, `Solution: <correct answer explanation>`. The lesson must explicitly teach the procedure needed to solve the multiple-choice question, and the lesson, worked example, question, and both solutions must all address the same objective and reasoning chain. Do not use exact-match freeform text inputs for generated lesson checks.
