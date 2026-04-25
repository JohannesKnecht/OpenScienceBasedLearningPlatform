<script setup lang="ts">
import { computed, ref } from 'vue'
import LessonGraphCanvas from '../components/LessonGraphCanvas.vue'
import LessonPreviewCard from '../components/LessonPreviewCard.vue'
import { getLesson, getLessonGraphNode, getLessonPrerequisites, lessonGraphEdges, lessonGraphNodes } from '../content'
import { useLearningProgress } from '../lib/progress'

type NodeStatus = 'locked' | 'ready' | 'learning' | 'mastered' | 'review' | 'current'

const {
  dueReviewSkillIds,
  getLessonState,
  isSkillMastered,
  nextRecommendedAction,
  targetLessonIds,
  isTargetLesson,
  setTargetLesson,
  removeTargetLesson,
} = useLearningProgress()
const selectedLessonId = ref<string | null>(null)

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

const previewLessonId = computed(() => selectedLessonId.value ?? recommendedLessonId.value ?? lessonGraphNodes[0]?.lessonId ?? null)
const selectedLesson = computed(() => (previewLessonId.value ? getLesson(previewLessonId.value) : undefined))
const selectedNode = computed(() => (selectedLesson.value ? getLessonGraphNode(selectedLesson.value.id) : undefined))
const selectedStatus = computed<NodeStatus>(() => {
  if (!selectedLesson.value) {
    return 'locked'
  }

  return statuses.value[selectedLesson.value.id] ?? getLessonState(selectedLesson.value.id)
})
const selectedStatusLabel = computed(() => {
  const labels: Record<NodeStatus, string> = {
    locked: 'Locked',
    ready: 'Ready',
    learning: 'In progress',
    mastered: 'Mastered',
    review: 'Review due',
    current: 'Recommended',
  }

  return labels[selectedStatus.value]
})
const selectedMissingPrerequisites = computed(() =>
  selectedLesson.value
    ? getLessonPrerequisites(selectedLesson.value.id).filter((skill) => !isSkillMastered(skill.id))
    : [],
)
const canOpenSelectedLesson = computed(
  () => selectedLesson.value !== undefined && selectedStatus.value !== 'locked',
)
const selectedIsTarget = computed(() => (selectedLesson.value ? isTargetLesson(selectedLesson.value.id) : false))

function previewLesson(lessonId: string): void {
  selectedLessonId.value = lessonId
}

function toggleSelectedTarget(): void {
  const lesson = selectedLesson.value
  if (!lesson) {
    return
  }

  if (selectedIsTarget.value) {
    removeTargetLesson(lesson.id)
    return
  }

  setTargetLesson(lesson.id)
}
</script>

<template>
  <section class="graph-page" aria-label="All lessons, one map">
    <div class="graph-page__caption">
      <p>Graph</p>
      <h1>All lessons, one map</h1>
    </div>

    <LessonGraphCanvas
      :nodes="lessonGraphNodes"
      :edges="lessonGraphEdges"
      :statuses="statuses"
      :target-lesson-ids="targetLessonIds"
      @select="previewLesson"
    />

    <div class="graph-page__legend">
      <span class="is-current">Current</span>
      <span class="is-review">Review due</span>
      <span class="is-target">Target</span>
      <span class="is-ready">Ready</span>
      <span class="is-mastered">Mastered</span>
      <span class="is-locked">Locked</span>
    </div>

    <LessonPreviewCard
      v-if="selectedLesson"
      class="graph-page__preview"
      :lesson="selectedLesson"
      :status-label="selectedStatusLabel"
      :status-tone="selectedStatus"
      :node-level="selectedNode?.level"
      :is-target="selectedIsTarget"
      :missing-prerequisites="selectedMissingPrerequisites"
      :can-open="canOpenSelectedLesson"
      :open-route="`/learn/${selectedLesson.id}`"
      show-target-action
      :target-action-label="selectedIsTarget ? 'Remove target' : 'Set as target'"
      @toggle-target="toggleSelectedTarget"
    />
  </section>
</template>

<style scoped>
.graph-page {
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  background: #f8f8f6;
}

.graph-page__legend {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 25;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  max-width: min(38rem, calc(100vw - 2rem));
  padding: 0.55rem;
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
}

.graph-page__legend span {
  border-radius: 0.35rem;
  padding: 0.45rem 0.8rem;
  font-size: 0.88rem;
  font-weight: 800;
}

.graph-page__caption {
  position: fixed;
  top: 5.35rem;
  left: 1rem;
  z-index: 25;
  display: grid;
  gap: 0.1rem;
  max-width: min(22rem, calc(100vw - 2rem));
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
}

.graph-page__caption p {
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
  font-weight: 800;
}

.graph-page__caption h1 {
  color: var(--color-heading);
  font-size: 1rem;
  line-height: 1.1;
}

.is-current {
  background: #cadcff;
  color: #0f2c78;
}

.is-review {
  background: #fff1cf;
  color: #8a5b12;
}

.is-target {
  background: #fff3a8;
  color: #5f4b00;
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

.graph-page__preview {
  position: fixed;
  top: 5.35rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 30;
  width: min(24rem, calc(100vw - 2rem));
  overflow: auto;
  box-shadow: 0 18px 48px rgba(25, 24, 54, 0.14);
}

.graph-page :deep(.graph-canvas),
.graph-page :deep(.graph-canvas__viewport) {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
}

.graph-page :deep(.graph-canvas__viewport) {
  border: 0;
  border-radius: 0;
}

.graph-page :deep(.graph-canvas__toolbar) {
  top: 10rem;
  left: 1rem;
}

@media (max-width: 980px) {
  .graph-page__preview {
    top: auto;
    right: 1rem;
    bottom: 1rem;
    left: 1rem;
    width: auto;
    max-height: 42vh;
  }

  .graph-page__legend {
    right: 1rem;
  }

  .graph-page :deep(.graph-canvas__toolbar) {
    top: 9.4rem;
  }
}

@media (max-width: 640px) {
  .graph-page__caption {
    display: none;
  }

  .graph-page :deep(.graph-canvas__toolbar) {
    top: auto;
    bottom: 7rem;
    left: 1rem;
    right: 1rem;
  }

  .graph-page__legend {
    display: none;
  }
}
</style>
