# Repository Instructions For Copilot Coding Agents

- Open pull requests against `dev`, not `main`.
- Make the smallest correct change. Do not refactor unrelated files.
- Read `AGENTS.md` as the canonical agent workflow reference; keep this file aligned with it when changing workflow rules.
- The main frontend lives in `frontend/AnkiAICardCreationFrontend`.
- The curriculum source of truth is `frontend/AnkiAICardCreationFrontend/src/content/curriculum.json`.
- The current generated CS1 curriculum helper is `frontend/AnkiAICardCreationFrontend/scripts/generate-cs1-curriculum.mjs`.
- For curriculum edits in any domain, prefer editing a domain-specific generator or making small JSON patches. Do not paste one massive JSON patch or a long inline heredoc.
- Oversized curriculum payloads previously broke the tool/approval UI and made the accept button inaccessible. Use short commands such as `npm run content:generate` or a domain-specific command such as `npm run content:generate-cs1` instead.
- Future domains such as ML should get their own generator or small patch sequence; do not overload the CS1 generator with unrelated course content.
- After curriculum or generator edits, run `npm run content:validate` from `frontend/AnkiAICardCreationFrontend`.
- Curriculum content must be original. External syllabi may be used only for topic coverage and sequencing research; do not copy lesson text, examples, exercises, prompts, or proprietary material.
- Do not add curriculum-level licensing metadata such as `contentLicense` unless explicitly requested.
