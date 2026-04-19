# Content Model

## Ziel

Das Curriculum soll langfristig vollstaendig aus einer zentralen JSON-Datei geladen werden.

Die Datei ist nicht nur ein Inhaltscontainer, sondern die produktive Beschreibung des Lern-Graphs.

## Grundprinzipien

1. Skills sind die Kerneinheit.
2. Lessons erklaeren Skills.
3. Assessments pruefen Skills.
4. Reviews stabilisieren Skills ueber Zeit.
5. Modules und Courses sind kuratierte Perspektiven auf denselben Skill-Graph.

## Top-Level-Struktur

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

## Entitaeten

### tracks

Oberste kuratierte Ebene.

Beispiel:

- Informatik Grundlagen
- Datenstrukturen
- Algorithmen

### courses

Ein zusammenhaengender Lernpfad innerhalb eines Tracks.

Beispiel:

- Computational Thinking Core
- Python Foundations
- Data Structures I

### modules

Didaktische Gruppen innerhalb eines Kurses.

Beispiel:

- Program State
- Control Flow
- Debugging Mindset

### skills

Die wichtigste fachliche Einheit.

Jeder Skill braucht:

- `id`
- `title`
- `description`
- `prerequisiteSkillIds`
- Referenzen auf passende Lessons, Assessments und Reviews

### lessons

Lessons erklaeren ein kleines Cluster aus Skills, idealerweise sehr fokussiert.

Jede Lesson sollte enthalten:

- Lernziel
- prerequisiteSkillIds
- erklaerende Abschnitte
- Worked Examples
- genau einen Einstiegspunkt in ein Assessment

### assessments

Assessments pruefen Skills explizit.

Aktuelle Typen:

- `diagnostic`
- `lesson-check`
- `review`

Spaeter moeglich:

- `module-check`
- `course-exam`
- `mixed-review`

### reviews

Reviews verbinden einen Skill mit einem Review-Assessment und einem Intervall.

Das macht den Retention-Loop explizit im Curriculum sichtbar.

## Prerequisites

Prerequisites werden immer auf Skill-Ebene modelliert.

Nicht empfohlen:

- Lesson A prerequisite fuer Lesson B

Empfohlen:

- Skill X prerequisite fuer Skill Y
- Lesson B referenziert Skill Y

Das ist stabiler und wiederverwendbarer.

## IDs

IDs muessen:

- stabil sein
- eindeutig sein
- slug-artig sein
- nie fuer andere Inhalte wiederverwendet werden

## Validierung

Aktuell wird das Curriculum beim Laden validiert.

Geprueft werden unter anderem:

- doppelte IDs
- fehlende Referenzen
- prerequisite-Zyklen

Die Validierung liegt in:

- `frontend/AnkiAICardCreationFrontend/src/content/validate.ts`

## Weiterentwicklung

Langfristig sollte das Modell um diese Felder erweitert werden:

- lokalisierte Texte
- Schwierigkeitsmetadaten pro Item
- Hints in mehreren Stufen
- Fehlermuster / misconceptions
- Rich content blocks
- mathematische oder codebasierte Antworttypen
- Versionierung und Review-Metadaten fuer Contributor
