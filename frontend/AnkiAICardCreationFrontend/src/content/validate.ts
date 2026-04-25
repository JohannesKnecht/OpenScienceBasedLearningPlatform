import type { CurriculumDocument, Skill } from './model'

function assertUniqueIds<T extends { id: string }>(items: T[], label: string): void {
  const seen = new Set<string>()

  items.forEach((item) => {
    if (seen.has(item.id)) {
      throw new Error(`Duplicate ${label} id: ${item.id}`)
    }

    seen.add(item.id)
  })
}

function assertReferences(
  sourceIds: string[],
  targetIds: Set<string>,
  label: string,
  sourceLabel: string,
): void {
  sourceIds.forEach((id) => {
    if (!targetIds.has(id)) {
      throw new Error(`${sourceLabel} references missing ${label}: ${id}`)
    }
  })
}

function validateSkillCycles(skills: Skill[]): void {
  const skillMap = new Map(skills.map((skill) => [skill.id, skill]))
  const visiting = new Set<string>()
  const visited = new Set<string>()

  function dfs(skillId: string): void {
    if (visited.has(skillId)) {
      return
    }

    if (visiting.has(skillId)) {
      throw new Error(`Prerequisite cycle detected at skill: ${skillId}`)
    }

    visiting.add(skillId)
    const skill = skillMap.get(skillId)
    skill?.prerequisiteSkillIds.forEach(dfs)
    visiting.delete(skillId)
    visited.add(skillId)
  }

  skills.forEach((skill) => dfs(skill.id))
}

export function validateCurriculum(document: CurriculumDocument): void {
  assertUniqueIds(document.tracks, 'track')
  assertUniqueIds(document.courses, 'course')
  assertUniqueIds(document.modules, 'module')
  assertUniqueIds(document.skills, 'skill')
  assertUniqueIds(document.lessons, 'lesson')
  assertUniqueIds(document.assessments, 'assessment')
  assertUniqueIds(document.reviews, 'review')

  const courseIds = new Set(document.courses.map((item) => item.id))
  const moduleIds = new Set(document.modules.map((item) => item.id))
  const skillIds = new Set(document.skills.map((item) => item.id))
  const lessonIds = new Set(document.lessons.map((item) => item.id))
  const assessmentIds = new Set(document.assessments.map((item) => item.id))
  const reviewIds = new Set(document.reviews.map((item) => item.id))

  document.tracks.forEach((track) => {
    assertReferences(track.courseIds, courseIds, 'course', `Track ${track.id}`)
  })

  document.courses.forEach((course) => {
    assertReferences(course.moduleIds, moduleIds, 'module', `Course ${course.id}`)

    if (!assessmentIds.has(course.entryAssessmentId)) {
      throw new Error(`Course ${course.id} references missing entry assessment: ${course.entryAssessmentId}`)
    }
  })

  document.modules.forEach((module) => {
    assertReferences(module.lessonIds, lessonIds, 'lesson', `Module ${module.id}`)
    assertReferences(module.skillIds, skillIds, 'skill', `Module ${module.id}`)
  })

  document.skills.forEach((skill) => {
    assertReferences(skill.prerequisiteSkillIds, skillIds, 'skill', `Skill ${skill.id}`)
    assertReferences(skill.lessonIds, lessonIds, 'lesson', `Skill ${skill.id}`)
    assertReferences(skill.masteryAssessmentIds, assessmentIds, 'assessment', `Skill ${skill.id}`)
    assertReferences(skill.reviewIds, reviewIds, 'review', `Skill ${skill.id}`)
  })

  document.lessons.forEach((lesson) => {
    if (!moduleIds.has(lesson.moduleId)) {
      throw new Error(`Lesson ${lesson.id} references missing module: ${lesson.moduleId}`)
    }

    assertReferences(lesson.skillIds, skillIds, 'skill', `Lesson ${lesson.id}`)
    assertReferences(lesson.prerequisiteSkillIds, skillIds, 'skill', `Lesson ${lesson.id}`)

    if (!assessmentIds.has(lesson.assessmentId)) {
      throw new Error(`Lesson ${lesson.id} references missing assessment: ${lesson.assessmentId}`)
    }

    if (lesson.sections.length !== 1 || lesson.sections[0]?.title !== 'Lesson') {
      throw new Error(`Lesson ${lesson.id} must use exactly one section titled Lesson`)
    }

    if (lesson.sections[0].body.length !== 1 || lesson.sections[0].body[0].trim().length === 0) {
      throw new Error(`Lesson ${lesson.id} must have exactly one Lesson body`)
    }

    if (!lesson.sections[0].body[0].includes('To solve')) {
      throw new Error(`Lesson ${lesson.id} must teach the solving procedure needed for its question`)
    }

    if (lesson.sections[0].checkpoint) {
      throw new Error(`Lesson ${lesson.id} must not include checkpoints in the exact lesson format`)
    }

    if (lesson.workedExamples.length !== 1) {
      throw new Error(`Lesson ${lesson.id} must include exactly one worked example`)
    }

    if (lesson.workedExamples[0].prompt.trim().length === 0 || lesson.workedExamples[0].steps.length !== 1 || lesson.workedExamples[0].steps[0].trim().length === 0) {
      throw new Error(`Lesson ${lesson.id} must include exactly one worked example solution`)
    }
  })

  document.assessments.forEach((assessment) => {
    assertReferences(assessment.skillIds, skillIds, 'skill', `Assessment ${assessment.id}`)

    if (assessment.lessonId && !lessonIds.has(assessment.lessonId)) {
      throw new Error(`Assessment ${assessment.id} references missing lesson: ${assessment.lessonId}`)
    }

    if (assessment.type === 'lesson-check') {
      if (!assessment.lessonId || assessment.items.length !== 1) {
        throw new Error(`Lesson check ${assessment.id} must be linked to a lesson and include exactly one question`)
      }

      const item = assessment.items[0]
      if (item.type !== 'multiple-choice' || item.prompt.trim().length === 0 || item.explanation.trim().length === 0) {
        throw new Error(`Lesson check ${assessment.id} must use a multiple-choice Question with a Solution explanation`)
      }

      if (item.options.length < 3 || !item.options.includes(item.correctAnswer)) {
        throw new Error(`Lesson check ${assessment.id} must include at least three options and one correct answer`)
      }
    }

    assessment.items.forEach((item) => {
      if (!skillIds.has(item.skillId)) {
        throw new Error(`Assessment item ${item.id} references missing skill: ${item.skillId}`)
      }
    })
  })

  document.reviews.forEach((review) => {
    if (!skillIds.has(review.skillId)) {
      throw new Error(`Review ${review.id} references missing skill: ${review.skillId}`)
    }

    if (!assessmentIds.has(review.assessmentId)) {
      throw new Error(`Review ${review.id} references missing assessment: ${review.assessmentId}`)
    }
  })

  validateSkillCycles(document.skills)
}
