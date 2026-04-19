<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AcademyShell from '../components/AcademyShell.vue'
import LessonGraphCanvas from '../components/LessonGraphCanvas.vue'
import { getLesson, getLessonModule, lessonGraphEdges, lessonGraphNodes } from '../content'
import { useLearningProgress } from '../lib/progress'

type NodeStatus = 'locked' | 'ready' | 'learning' | 'mastered' | 'review' | 'current'

const router = useRouter()
const { dueReviewSkillIds, getLessonState, nextRecommendedAction } = useLearningProgress()

const recommendedLessonId = computed(() => {
  const route = nextRecommendedAction.value.route
  const segments = route.split('/')
  return route.startsWith('/learn/') ? segments[segments.length - 1] : null
})

const reviewLessonIds = computed(() => {
  const reviewLessons = new Set<string>()

  dueReviewSkillIds.value.forEach((skillId) => {
    lessonGraphNodes.forEach((node) => {
      const lesson = getLesson(node.lessonId)
      if (lesson?.skillIds.includes(skillId)) {
        reviewLessons.add(node.lessonId)
      }
    })
  })

  return reviewLessons
})

const statuses = computed<Record<string, NodeStatus>>(() =>
  Object.fromEntries(
    lessonGraphNodes.map((node) => {
      const lessonState = getLessonState(node.lessonId)

      if (recommendedLessonId.value === node.lessonId) {
        return [node.lessonId, 'current']
      }

      if (reviewLessonIds.value.has(node.lessonId)) {
        return [node.lessonId, 'review']
      }

      return [node.lessonId, lessonState]
    }),
  ),
)

function openLesson(lessonId: string): void {
  const lesson = getLesson(lessonId)
  const module = getLessonModule(lessonId)
  if (!lesson || !module) {
    return
  }

  router.push(`/learn/${module.id}/${lesson.id}`)
}
</script>

<template>
  <AcademyShell
    eyebrow="Graph"
    title="All lessons, one map"
    subtitle="This view shows the full lesson graph derived from prerequisites. Zoom out for the complete map or zoom in to inspect a local neighborhood."
  >
    <section class="graph-page">
      <div class="graph-page__legend">
        <span class="is-current">Current</span>
        <span class="is-review">Review due</span>
        <span class="is-ready">Ready</span>
        <span class="is-mastered">Mastered</span>
        <span class="is-locked">Locked</span>
      </div>

      <LessonGraphCanvas
        :nodes="lessonGraphNodes"
        :edges="lessonGraphEdges"
        :statuses="statuses"
        @select="openLesson"
      />
    </section>
  </AcademyShell>
</template>

<style scoped>
.graph-page {
  display: grid;
  gap: 0.9rem;
}

.graph-page__legend {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.graph-page__legend span {
  border-radius: 999px;
  padding: 0.45rem 0.8rem;
  font-size: 0.88rem;
  font-weight: 600;
}

.is-current {
  background: #cadcff;
  color: #0f2c78;
}

.is-review {
  background: #fff1cf;
  color: #8a5b12;
}

.is-ready {
  background: #dfeafc;
  color: #1c3f8a;
}

.is-mastered {
  background: #dbf3e7;
  color: #0b6d3b;
}

.is-locked {
  background: #f2f4f8;
  color: #9099ac;
}
</style>
