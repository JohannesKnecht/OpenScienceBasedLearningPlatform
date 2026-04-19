import { computed, reactive } from 'vue'
import {
  allLessons,
  allSkills,
  getAssessment,
  getEntryAssessmentForCourse,
  getLesson,
  getReviewForSkill,
  getReviewAssessmentForSkill,
  getSkill,
  primaryCourse,
  xpConfig,
} from '../content'
import type { AssessmentRunResult, LessonState, SkillState } from '../content/model'

export interface SkillProgress {
  state: SkillState
  masteryCount: number
  masteryAchievedAt: string | null
  reviewDueAt: string | null
  reviewCount: number
  lastAssessedAt: string | null
}

export interface AssessmentProgress {
  attempts: number
  lastScore: number
  passed: boolean
  lastAttemptedAt: string | null
}

export interface LearningProgress {
  xp: number
  streak: number
  lastActiveDate: string | null
  lastLessonId: string | null
  diagnosticCompleted: boolean
  skillProgress: Record<string, SkillProgress>
  assessmentProgress: Record<string, AssessmentProgress>
}

const STORAGE_KEY = 'open-mastery-graph-progress'

const defaultProgress: LearningProgress = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  lastLessonId: null,
  diagnosticCompleted: false,
  skillProgress: {},
  assessmentProgress: {},
}

let memoryStorage = ''

function canUseLocalStorage(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined' &&
    typeof window.localStorage.getItem === 'function' &&
    typeof window.localStorage.setItem === 'function'
  )
}

function readStorage(): string | null {
  return canUseLocalStorage() ? window.localStorage.getItem(STORAGE_KEY) : memoryStorage || null
}

function writeStorage(value: string): void {
  if (canUseLocalStorage()) {
    window.localStorage.setItem(STORAGE_KEY, value)
    return
  }

  memoryStorage = value
}

function createDefaultSkillProgress(): SkillProgress {
  return {
    state: 'not_started',
    masteryCount: 0,
    masteryAchievedAt: null,
    reviewDueAt: null,
    reviewCount: 0,
    lastAssessedAt: null,
  }
}

function loadProgress(): LearningProgress {
  const raw = readStorage()
  if (!raw) {
    return structuredClone(defaultProgress)
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LearningProgress>
    return {
      xp: parsed.xp ?? defaultProgress.xp,
      streak: parsed.streak ?? defaultProgress.streak,
      lastActiveDate: parsed.lastActiveDate ?? defaultProgress.lastActiveDate,
      lastLessonId: parsed.lastLessonId ?? defaultProgress.lastLessonId,
      diagnosticCompleted: parsed.diagnosticCompleted ?? defaultProgress.diagnosticCompleted,
      skillProgress: parsed.skillProgress ?? {},
      assessmentProgress: parsed.assessmentProgress ?? {},
    }
  } catch {
    return structuredClone(defaultProgress)
  }
}

const progressState = reactive<LearningProgress>(loadProgress())

function persist(): void {
  writeStorage(JSON.stringify(progressState))
}

function getSkillProgressRecord(skillId: string): SkillProgress {
  if (!progressState.skillProgress[skillId]) {
    progressState.skillProgress[skillId] = createDefaultSkillProgress()
  }

  return progressState.skillProgress[skillId]
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function markActiveDay(): void {
  const today = getTodayKey()

  if (!progressState.lastActiveDate) {
    progressState.lastActiveDate = today
    progressState.streak = 1
    return
  }

  if (progressState.lastActiveDate === today) {
    return
  }

  const previous = new Date(`${progressState.lastActiveDate}T00:00:00Z`)
  const current = new Date(`${today}T00:00:00Z`)
  const dayDifference = Math.round((current.getTime() - previous.getTime()) / 86400000)

  progressState.streak = dayDifference === 1 ? progressState.streak + 1 : 1
  progressState.lastActiveDate = today
}

function addXp(amount: number): void {
  progressState.xp += amount
}

function scheduleReview(skillId: string, multiplier = 1): void {
  const review = getReviewForSkill(skillId)
  const record = getSkillProgressRecord(skillId)
  const intervalDays = Math.max(1, Math.round((review?.initialIntervalDays ?? 2) * multiplier))
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + intervalDays)
  record.reviewDueAt = dueDate.toISOString()
}

function markSkillMastered(skillId: string, recursivePrerequisites = false): void {
  const record = getSkillProgressRecord(skillId)
  const wasMastered = record.state === 'mastered'

  record.state = 'mastered'
  record.masteryAchievedAt = new Date().toISOString()
  record.lastAssessedAt = new Date().toISOString()
  record.masteryCount += 1
  scheduleReview(skillId, 1 + record.reviewCount)

  if (!wasMastered) {
    addXp(xpConfig.events.skillMastery)
  }

  if (recursivePrerequisites) {
    getSkill(skillId)?.prerequisiteSkillIds.forEach((prerequisiteId) => {
      markSkillMastered(prerequisiteId, true)
    })
  }
}

function markSkillLearning(skillId: string): void {
  const record = getSkillProgressRecord(skillId)
  if (record.state !== 'mastered') {
    record.state = 'learning'
  }

  record.lastAssessedAt = new Date().toISOString()
}

function isSkillMastered(skillId: string): boolean {
  return getSkillProgressRecord(skillId).state === 'mastered'
}

function isSkillUnlocked(skillId: string): boolean {
  const skill = getSkill(skillId)
  return skill ? skill.prerequisiteSkillIds.every(isSkillMastered) : false
}

function isLessonUnlocked(lessonId: string): boolean {
  const lesson = getLesson(lessonId)
  return lesson ? lesson.prerequisiteSkillIds.every(isSkillMastered) : false
}

function getLessonState(lessonId: string): LessonState {
  const lesson = getLesson(lessonId)
  if (!lesson) {
    return 'locked'
  }

  if (lesson.skillIds.every(isSkillMastered)) {
    return 'mastered'
  }

  if (!isLessonUnlocked(lessonId)) {
    return 'locked'
  }

  if (lesson.skillIds.some((skillId) => getSkillProgressRecord(skillId).state === 'learning')) {
    return 'learning'
  }

  return 'ready'
}

function initializeSkillRecords(): void {
  allSkills.forEach((skill) => {
    getSkillProgressRecord(skill.id)
  })
}

initializeSkillRecords()

export function useLearningProgress() {
  const entryAssessment = primaryCourse ? getEntryAssessmentForCourse(primaryCourse.id) : undefined

  const masteredSkillCount = computed(() => allSkills.filter((skill) => isSkillMastered(skill.id)).length)

  const completedLessonCount = computed(
    () => allLessons.filter((lesson) => getLessonState(lesson.id) === 'mastered').length,
  )

  const completionPercentage = computed(() =>
    allSkills.length === 0 ? 0 : Math.round((masteredSkillCount.value / allSkills.length) * 100),
  )

  const dueReviewSkillIds = computed(() => {
    const now = Date.now()

    return allSkills
      .filter((skill) => {
        const record = getSkillProgressRecord(skill.id)
        return record.state === 'mastered' && record.reviewDueAt !== null && new Date(record.reviewDueAt).getTime() <= now
      })
      .map((skill) => skill.id)
  })

  const dueReviewAssessments = computed(() =>
    dueReviewSkillIds.value
      .map((skillId) => getReviewAssessmentForSkill(skillId))
      .filter(Boolean),
  )

  const continueLesson = computed(() => {
    if (progressState.lastLessonId) {
      return getLesson(progressState.lastLessonId) ?? null
    }

    return allLessons.find((lesson) => getLessonState(lesson.id) === 'ready') ?? allLessons[0] ?? null
  })

  const nextRecommendedAction = computed(() => {
    if (!progressState.diagnosticCompleted && entryAssessment) {
      return {
        type: 'diagnostic' as const,
        title: 'Run the entry diagnostic',
        description: 'Place the learner on the right starting point before opening more advanced lessons.',
        route: '/diagnostic',
      }
    }

    if (dueReviewAssessments.value.length > 0) {
      return {
        type: 'review' as const,
        title: 'Review is due',
        description: `${dueReviewAssessments.value.length} skill review${dueReviewAssessments.value.length === 1 ? '' : 's'} are ready.`,
        route: '/review',
      }
    }

    const nextLesson = allLessons.find((lesson) => {
      const state = getLessonState(lesson.id)
      return state === 'ready' || state === 'learning'
    })

    if (nextLesson) {
      return {
        type: 'lesson' as const,
        title: nextLesson.title,
        description: nextLesson.summary,
        route: `/learn/${nextLesson.moduleId}/${nextLesson.id}`,
      }
    }

    return {
      type: 'complete' as const,
      title: 'Example curriculum completed',
      description: 'The sample JSON is done. The next step is adding more community-authored content.',
      route: '/learn',
    }
  })

  function touchLesson(lessonId: string): void {
    progressState.lastLessonId = lessonId
    persist()
  }

  function completeAssessment(assessmentId: string, result: AssessmentRunResult): void {
    const assessment = getAssessment(assessmentId)
    if (!assessment) {
      return
    }

    const previous = progressState.assessmentProgress[assessmentId]
    const firstPassingAttempt = !previous?.passed && result.passed

    progressState.assessmentProgress[assessmentId] = {
      attempts: (previous?.attempts ?? 0) + 1,
      lastScore: result.correctCount,
      passed: result.passed,
      lastAttemptedAt: new Date().toISOString(),
    }

    result.itemResults.forEach((itemResult) => {
      if (itemResult.correct) {
        getSkillProgressRecord(itemResult.skillId).lastAssessedAt = new Date().toISOString()
      }
    })

    if (assessment.type === 'diagnostic') {
      progressState.diagnosticCompleted = true

      result.itemResults.forEach((itemResult) => {
        if (itemResult.correct) {
          markSkillMastered(itemResult.skillId, true)
        } else {
          markSkillLearning(itemResult.skillId)
        }
      })

      if (!previous) {
        addXp(xpConfig.events.diagnosticComplete)
      }

      markActiveDay()
      persist()
      return
    }

    if (assessment.type === 'lesson-check') {
      if (assessment.lessonId) {
        progressState.lastLessonId = assessment.lessonId
      }

      if (result.passed) {
        if (firstPassingAttempt) {
          addXp(xpConfig.events.lessonComplete)
        }

        assessment.skillIds.forEach((skillId) => {
          markSkillMastered(skillId)
        })
      } else {
        assessment.skillIds.forEach((skillId) => {
          markSkillLearning(skillId)
        })
      }

      markActiveDay()
      persist()
      return
    }

    if (assessment.type === 'review') {
      if (result.passed) {
        assessment.skillIds.forEach((skillId) => {
          const record = getSkillProgressRecord(skillId)
          record.state = 'mastered'
          record.reviewCount += 1
          record.lastAssessedAt = new Date().toISOString()
          scheduleReview(skillId, 1 + record.reviewCount)
        })

        addXp(xpConfig.events.reviewSuccess * assessment.skillIds.length)
      } else {
        assessment.skillIds.forEach((skillId) => {
          const record = getSkillProgressRecord(skillId)
          record.state = 'learning'
          record.reviewDueAt = new Date().toISOString()
          record.lastAssessedAt = new Date().toISOString()
        })
      }

      markActiveDay()
      persist()
    }
  }

  function resetProgress(): void {
    progressState.xp = 0
    progressState.streak = 0
    progressState.lastActiveDate = null
    progressState.lastLessonId = null
    progressState.diagnosticCompleted = false
    progressState.skillProgress = {}
    progressState.assessmentProgress = {}
    initializeSkillRecords()
    persist()
  }

  return {
    progressState,
    completionPercentage,
    completedLessonCount,
    masteredSkillCount,
    dueReviewSkillIds,
    dueReviewAssessments,
    continueLesson,
    nextRecommendedAction,
    touchLesson,
    completeAssessment,
    resetProgress,
    isSkillMastered,
    isSkillUnlocked,
    isLessonUnlocked,
    getLessonState,
  }
}
