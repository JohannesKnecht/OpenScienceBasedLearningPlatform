# Contributing Content

## Ziel

Inhalte sollen langfristig ueber Pull Requests in dieses Repository einfliessen.

Die wichtigste Arbeitsflaeche dafuer ist aktuell:

- `frontend/AnkiAICardCreationFrontend/src/content/curriculum.json`

Fuer groessere Curriculum-Aenderungen bitte auch lesen:

- `docs/curriculum-workflow.md`

## Grundregeln

1. Keine kopierten proprietaeren Inhalte einreichen.
2. Keine Marken oder Produkttexte anderer Plattformen uebernehmen.
3. Inhalte muessen originell oder kompatibel lizenziert sein.
4. Prerequisites immer auf Skill-Ebene modellieren.
5. Lessons erklaeren, Assessments pruefen, Reviews wiederholen.

## Erwartete Qualitaet fuer neue Inhalte

Neue Inhalte sollten:

- klare IDs haben
- fachlich atomar sein
- eine sinnvolle prerequisite-Struktur haben
- auf das bestehende Curriculum referenzieren koennen
- keine kaputten Referenzen einfuehren

## Empfohlener Ablauf fuer einen Beitrag

1. Passende bestehende Skills und Modules ansehen.
2. Neue Skill-IDs definieren.
3. prerequisiteSkillIds festlegen.
4. Lesson anlegen.
5. Assessment anlegen.
6. Review anlegen.
7. Referenzen gegenseitig sauber verbinden.

## Beim Bearbeiten der zentralen JSON-Datei beachten

Da aktuell alles in einer grossen Datei liegt, bitte:

- nur einen zusammenhaengenden Inhaltsbereich pro Pull Request aendern
- IDs konsistent benennen
- bestehende Sortierung respektieren
- keine unnoetigen Umformatierungen machen
- keine sehr grossen JSON-Patches oder langen Inline-Heredocs verwenden
- fuer alle registrierten Generatoren `npm run content:generate` und danach `npm run content:validate` im Frontend-Verzeichnis ausfuehren
- fuer reine CS1-Generatoraenderungen kann gezielt `npm run content:generate-cs1` verwendet werden
- neue Domaenen wie ML sollen eigene Generatoren oder kleine Patch-Sequenzen bekommen, nicht einen riesigen JSON-Patch

## Inhaltliche Leitfragen fuer Contributor

Vor einem PR sollte klar sein:

- Welche Skills werden neu eingefuehrt?
- Welche bestehenden Skills sind prerequisites?
- Woran erkennt das System spaeter Mastery?
- Welcher Review-Mechanismus ist fuer diese Skills sinnvoll?

## Noch offene Infrastruktur fuer Community-Beitraege

Diese Dinge sollten spaeter ergaenzt werden:

- JSON-Schema fuer CI
- automatisierte Graph-Checks in GitHub Actions
- PR-Template zur Herkunftsbestaetigung von Inhalten
- Style Guide fuer Sprachstil und didaktische Tiefe
- Moderationsprozess fuer groessere Content-Pakete
