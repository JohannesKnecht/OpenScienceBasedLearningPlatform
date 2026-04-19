export type AssessmentItem =
  | {
      id: string
      skillId: string
      type: 'multiple-choice'
      prompt: string
      options: string[]
      correctAnswer: string
      explanation: string
    }
  | {
      id: string
      skillId: string
      type: 'order'
      prompt: string
      options: string[]
      correctOrder: string[]
      explanation: string
    }
  | {
      id: string
      skillId: string
      type: 'text'
      prompt: string
      placeholder: string
      acceptedAnswers: string[]
      explanation: string
    }

export interface WorkedExample {
  id: string
  prompt: string
  steps: string[]
}

export interface LessonSection {
  id: string
  title: string
  body: string[]
  checkpoint?: string
}

export interface Track {
  id: string
  title: string
  tagline: string
  description: string
  courseIds: string[]
  tags: string[]
}

export interface Course {
  id: string
  trackId: string
  title: string
  tagline: string
  description: string
  moduleIds: string[]
  entryAssessmentId: string
  dailyXpGoal: number
  weeklyStudyDays: number
}

export interface Module {
  id: string
  courseId: string
  badge: string
  title: string
  summary: string
  lessonIds: string[]
  skillIds: string[]
}

export interface Skill {
  id: string
  title: string
  description: string
  prerequisiteSkillIds: string[]
  lessonIds: string[]
  masteryAssessmentIds: string[]
  reviewIds: string[]
  metadata: {
    domain: string
    difficulty: number
    tags: string[]
  }
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  summary: string
  objective: string
  estimatedMinutes: number
  skillIds: string[]
  prerequisiteSkillIds: string[]
  sections: LessonSection[]
  workedExamples: WorkedExample[]
  assessmentId: string
  metadata: {
    author: string
    status: string
  }
}

export interface Assessment {
  id: string
  type: 'diagnostic' | 'lesson-check' | 'review'
  title: string
  description: string
  skillIds: string[]
  lessonId?: string
  items: AssessmentItem[]
  passRule: {
    minCorrect: number
    maxAttemptsBeforeReview?: number
  }
  metadata: {
    difficulty: number
    calculatorAllowed: boolean
  }
}

export interface Review {
  id: string
  skillId: string
  title: string
  assessmentId: string
  initialIntervalDays: number
}

export interface CurriculumDocument {
  schemaVersion: string
  metadata: {
    projectName: string
    defaultLocale: string
    contentLicense: string
    contributionModel: string
  }
  tracks: Track[]
  courses: Course[]
  modules: Module[]
  skills: Skill[]
  lessons: Lesson[]
  assessments: Assessment[]
  reviews: Review[]
  xp: {
    events: {
      diagnosticComplete: number
      lessonComplete: number
      skillMastery: number
      reviewSuccess: number
    }
  }
}

export interface AssessmentItemResult {
  itemId: string
  skillId: string
  correct: boolean
}

export interface AssessmentRunResult {
  passed: boolean
  correctCount: number
  totalCount: number
  itemResults: AssessmentItemResult[]
}

export type LessonState = 'locked' | 'ready' | 'learning' | 'mastered'
export type SkillState = 'not_started' | 'learning' | 'mastered'
