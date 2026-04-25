import curriculumData from './curriculum.json'
import type { Assessment, Course, CurriculumDocument, Lesson, Module, Review, Skill, Track } from './model'
import { validateCurriculum } from './validate'

const curriculum = curriculumData as CurriculumDocument

validateCurriculum(curriculum)

const trackMap = new Map(curriculum.tracks.map((track) => [track.id, track]))
const courseMap = new Map(curriculum.courses.map((course) => [course.id, course]))
const moduleMap = new Map(curriculum.modules.map((module) => [module.id, module]))
const skillMap = new Map(curriculum.skills.map((skill) => [skill.id, skill]))
const lessonMap = new Map(curriculum.lessons.map((lesson) => [lesson.id, lesson]))
const assessmentMap = new Map(curriculum.assessments.map((assessment) => [assessment.id, assessment]))
const reviewMap = new Map(curriculum.reviews.map((review) => [review.id, review]))

export const allTracks = curriculum.tracks
export const allCourses = curriculum.courses
export const allModules = curriculum.modules
export const allSkills = curriculum.skills
export const allLessons = curriculum.lessons
export const allAssessments = curriculum.assessments
export const allReviews = curriculum.reviews
export const xpConfig = curriculum.xp
export const curriculumMetadata = curriculum.metadata
export const primaryEntryAssessment = curriculum.assessments.find((assessment) => assessment.type === 'diagnostic')

export const primaryTrack = curriculum.tracks[0]
export const primaryCourse = primaryTrack ? getCourse(primaryTrack.courseIds[0]) : undefined

export interface LessonGraphNode {
  lessonId: string
  moduleId: string
  title: string
  prerequisiteLessonIds: string[]
  level: number
  order: number
}

export interface LessonGraphEdge {
  id: string
  fromLessonId: string
  toLessonId: string
}

export function getTrack(trackId: string): Track | undefined {
  return trackMap.get(trackId)
}

export function getCourse(courseId: string): Course | undefined {
  return courseMap.get(courseId)
}

export function getModule(moduleId: string): Module | undefined {
  return moduleMap.get(moduleId)
}

export function getSkill(skillId: string): Skill | undefined {
  return skillMap.get(skillId)
}

export function getLesson(lessonId: string): Lesson | undefined {
  return lessonMap.get(lessonId)
}

export function getAssessment(assessmentId: string): Assessment | undefined {
  return assessmentMap.get(assessmentId)
}

export function getReview(reviewId: string): Review | undefined {
  return reviewMap.get(reviewId)
}

export function getEntryAssessmentForCourse(courseId: string): Assessment | undefined {
  const course = getCourse(courseId)
  return course ? getAssessment(course.entryAssessmentId) : undefined
}

export function getCourseModules(courseId: string): Module[] {
  const course = getCourse(courseId)
  return course ? course.moduleIds.map((moduleId) => getModule(moduleId)).filter(Boolean) as Module[] : []
}

export function getModuleLessons(moduleId: string): Lesson[] {
  const module = getModule(moduleId)
  return module ? module.lessonIds.map((lessonId) => getLesson(lessonId)).filter(Boolean) as Lesson[] : []
}

export function getModuleSkills(moduleId: string): Skill[] {
  const module = getModule(moduleId)
  return module ? module.skillIds.map((skillId) => getSkill(skillId)).filter(Boolean) as Skill[] : []
}

export function getOrderedCourseLessons(courseId: string): Lesson[] {
  return getCourseModules(courseId).flatMap((module) => getModuleLessons(module.id))
}

export function getOrderedCourseSkills(courseId: string): Skill[] {
  return getCourseModules(courseId).flatMap((module) => getModuleSkills(module.id))
}

export function getLessonModule(lessonId: string): Module | undefined {
  const lesson = getLesson(lessonId)
  return lesson ? getModule(lesson.moduleId) : undefined
}

export function getNextLesson(courseId: string, lessonId: string): Lesson | undefined {
  const lessons = getOrderedCourseLessons(courseId)
  const currentIndex = lessons.findIndex((lesson) => lesson.id === lessonId)
  return currentIndex >= 0 ? lessons[currentIndex + 1] : undefined
}

export function getReviewForSkill(skillId: string): Review | undefined {
  return curriculum.reviews.find((review) => review.skillId === skillId)
}

export function getReviewAssessmentForSkill(skillId: string): Assessment | undefined {
  const review = getReviewForSkill(skillId)
  return review ? getAssessment(review.assessmentId) : undefined
}

export function getSkillPrerequisites(skillId: string): Skill[] {
  const skill = getSkill(skillId)
  return skill
    ? skill.prerequisiteSkillIds.map((prerequisiteId) => getSkill(prerequisiteId)).filter(Boolean) as Skill[]
    : []
}

export function getLessonPrerequisites(lessonId: string): Skill[] {
  const lesson = getLesson(lessonId)
  return lesson
    ? lesson.prerequisiteSkillIds.map((skillId) => getSkill(skillId)).filter(Boolean) as Skill[]
    : []
}

export function getTrackCourses(trackId: string): Course[] {
  const track = getTrack(trackId)
  return track ? track.courseIds.map((courseId) => getCourse(courseId)).filter(Boolean) as Course[] : []
}

function buildLessonGraph() {
  const lessonOrder = new Map(allLessons.map((lesson, index) => [lesson.id, index]))
  const lessonIdsBySkill = new Map<string, string[]>()

  allLessons.forEach((lesson) => {
    lesson.skillIds.forEach((skillId) => {
      const existing = lessonIdsBySkill.get(skillId) ?? []
      existing.push(lesson.id)
      lessonIdsBySkill.set(skillId, existing)
    })
  })

  const prerequisiteLessonIdsByLesson = new Map<string, string[]>()

  allLessons.forEach((lesson) => {
    const prerequisiteLessons = new Set<string>()

    lesson.prerequisiteSkillIds.forEach((skillId) => {
      ;(lessonIdsBySkill.get(skillId) ?? []).forEach((lessonId) => {
        if (lessonId !== lesson.id) {
          prerequisiteLessons.add(lessonId)
        }
      })
    })

    prerequisiteLessonIdsByLesson.set(
      lesson.id,
      [...prerequisiteLessons].sort(
        (left, right) => (lessonOrder.get(left) ?? 0) - (lessonOrder.get(right) ?? 0),
      ),
    )
  })

  const levelCache = new Map<string, number>()

  function getLevel(lessonId: string): number {
    if (levelCache.has(lessonId)) {
      return levelCache.get(lessonId) ?? 0
    }

    const prerequisiteLessonIds = prerequisiteLessonIdsByLesson.get(lessonId) ?? []
    const level =
      prerequisiteLessonIds.length === 0
        ? 0
        : Math.max(...prerequisiteLessonIds.map((prerequisiteLessonId) => getLevel(prerequisiteLessonId))) + 1

    levelCache.set(lessonId, level)
    return level
  }

  const nodes: LessonGraphNode[] = allLessons.map((lesson, index) => ({
    lessonId: lesson.id,
    moduleId: lesson.moduleId,
    title: lesson.title,
    prerequisiteLessonIds: prerequisiteLessonIdsByLesson.get(lesson.id) ?? [],
    level: getLevel(lesson.id),
    order: index,
  }))

  const edges: LessonGraphEdge[] = nodes.flatMap((node) =>
    node.prerequisiteLessonIds.map((prerequisiteLessonId) => ({
      id: `${prerequisiteLessonId}->${node.lessonId}`,
      fromLessonId: prerequisiteLessonId,
      toLessonId: node.lessonId,
    })),
  )

  return { nodes, edges }
}

const lessonGraph = buildLessonGraph()

export const lessonGraphNodes = lessonGraph.nodes
export const lessonGraphEdges = lessonGraph.edges

export function getLessonGraphNode(lessonId: string): LessonGraphNode | undefined {
  return lessonGraphNodes.find((node) => node.lessonId === lessonId)
}

export function getLessonGraphPredecessors(lessonId: string): LessonGraphNode[] {
  const node = getLessonGraphNode(lessonId)
  return node
    ? node.prerequisiteLessonIds
        .map((prerequisiteLessonId) => getLessonGraphNode(prerequisiteLessonId))
        .filter(Boolean) as LessonGraphNode[]
    : []
}

export function getLessonGraphAncestorIds(lessonId: string): string[] {
  const visited = new Set<string>()

  function visit(currentLessonId: string): void {
    const node = getLessonGraphNode(currentLessonId)
    node?.prerequisiteLessonIds.forEach((prerequisiteLessonId) => {
      if (visited.has(prerequisiteLessonId)) {
        return
      }

      visited.add(prerequisiteLessonId)
      visit(prerequisiteLessonId)
    })
  }

  visit(lessonId)

  return [...visited].sort((left, right) => {
    const leftNode = getLessonGraphNode(left)
    const rightNode = getLessonGraphNode(right)
    return (leftNode?.order ?? 0) - (rightNode?.order ?? 0)
  })
}

export function getLessonGraphPathLessonIds(targetLessonIds: string[]): string[] {
  const pathLessonIds = new Set<string>()

  targetLessonIds.forEach((lessonId) => {
    getLessonGraphAncestorIds(lessonId).forEach((ancestorLessonId) => {
      pathLessonIds.add(ancestorLessonId)
    })
    pathLessonIds.add(lessonId)
  })

  return lessonGraphNodes
    .filter((node) => pathLessonIds.has(node.lessonId))
    .sort((left, right) => left.level - right.level || left.order - right.order)
    .map((node) => node.lessonId)
}

export { curriculum }
