<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AcademyShell from '../components/AcademyShell.vue'
import LessonPreviewCard from '../components/LessonPreviewCard.vue'
import ProgressPanel from '../components/ProgressPanel.vue'
import { allLessons, getLesson, getLessonGraphNode, getLessonPrerequisites, getReviewAssessmentForSkill, getSkill } from '../content'
import { useLearningProgress } from '../lib/progress'

const progress = useLearningProgress()
const diagnosticCompleted = computed(() => progress.progressState.diagnosticCompleted)
const {
  getLessonState,
  dueReviewSkillIds,
  nextRecommendedAction,
  targetLessons,
  targetPathLessons,
  targetPathCompletedLessonCount,
  targetPathTotalLessonCount,
  isSkillMastered,
  isLessonUnlocked,
  isTargetLesson,
  setTargetLesson,
  removeTargetLesson,
} = progress
const previewLessonId = ref<string | null>(null)

interface ReviewCard {
  skillId: string
  title: string
  subtitle: string
  route: string
}

const recommendedLesson = computed(() => {
  const recommendation = nextRecommendedAction.value
  if (recommendation.type !== 'lesson') {
    return null
  }

  const segments = recommendation.route.split('/')
  const lessonId = segments[segments.length - 1]
  return lessonId ? getLesson(lessonId) ?? null : null
})

const pathPreviewLessons = computed(() => targetPathLessons.value.slice(0, 5))
const selectedPreviewLesson = computed(() => (previewLessonId.value ? getLesson(previewLessonId.value) : null))
const selectedPreviewNode = computed(() =>
  selectedPreviewLesson.value ? getLessonGraphNode(selectedPreviewLesson.value.id) : undefined,
)
const selectedPreviewStatus = computed(() =>
  selectedPreviewLesson.value ? getLessonState(selectedPreviewLesson.value.id) : 'locked',
)
const selectedPreviewStatusLabel = computed(() => {
  const labels = {
    locked: 'Locked',
    ready: 'Ready',
    learning: 'In progress',
    mastered: 'Mastered',
  }

  return labels[selectedPreviewStatus.value]
})
const selectedPreviewMissingPrerequisites = computed(() =>
  selectedPreviewLesson.value
    ? getLessonPrerequisites(selectedPreviewLesson.value.id).filter((skill) => !isSkillMastered(skill.id))
    : [],
)
const selectedPreviewIsTarget = computed(() =>
  selectedPreviewLesson.value ? isTargetLesson(selectedPreviewLesson.value.id) : false,
)

function previewLesson(lessonId: string): void {
  previewLessonId.value = lessonId
}

function togglePreviewTarget(): void {
  const lesson = selectedPreviewLesson.value
  if (!lesson) {
    return
  }

  if (selectedPreviewIsTarget.value) {
    removeTargetLesson(lesson.id)
    return
  }

  setTargetLesson(lesson.id)
}

const reviewCards = computed<ReviewCard[]>(() =>
  dueReviewSkillIds.value
    .map((skillId) => {
      const skill = getSkill(skillId)
      const assessment = getReviewAssessmentForSkill(skillId)
      const lesson = allLessons.find((candidate) => candidate.skillIds.includes(skillId))

      return skill && assessment && lesson
        ? {
            skillId,
            title: skill.title,
            subtitle: lesson.title,
            route: `/review/${skillId}`,
          }
        : null
    })
    .filter((review): review is ReviewCard => review !== null),
)

const recentLessons = computed(() =>
  [...allLessons]
    .filter((lesson) => getLessonState(lesson.id) === 'mastered')
    .slice(-3)
    .reverse(),
)
</script>

<template>
  <AcademyShell
    eyebrow="Learn"
    intro="An open, science-based learning platform that guides you through structured courses one lesson at a time. Complete lessons to master skills, revisit material through spaced-repetition reviews, and use the knowledge graph to see how topics connect and chart your own path through the curriculum."
    title="Work toward target lessons"
    subtitle="Pick lesson nodes from the graph, then clear the recommended prerequisites until those targets are reachable."
  >
    <section class="learn-layout">
      <ProgressPanel />

      <div class="learn-feed">
        <div class="learn-feed__header">
          <p>Today</p>
          <h2>Target queue</h2>
        </div>

        <article v-if="targetLessons.length === 0" class="task-card task-card--primary">
          <div>
            <p class="task-card__eyebrow">Target nodes</p>
            <h2>Choose one or more lesson targets</h2>
            <p>The graph will turn selected lesson nodes into a prerequisite path.</p>
          </div>
          <span class="task-card__xp">Required</span>
          <RouterLink class="task-card__button" to="/graph">Pick targets</RouterLink>
        </article>

        <article v-else class="target-card">
          <div class="target-card__head">
            <div>
              <p class="task-card__eyebrow">Selected targets</p>
              <h2>{{ targetPathCompletedLessonCount }}/{{ targetPathTotalLessonCount }} path nodes mastered</h2>
            </div>
            <RouterLink class="task-card__button task-card__button--subtle" to="/graph">Edit targets</RouterLink>
          </div>
          <div class="target-card__list">
            <button v-for="lesson in targetLessons" :key="lesson.id" type="button" @click="previewLesson(lesson.id)">
              {{ lesson.title }}
            </button>
          </div>
          <div class="target-card__path" v-if="pathPreviewLessons.length > 0">
            <button v-for="lesson in pathPreviewLessons" :key="lesson.id" type="button" @click="previewLesson(lesson.id)">
              {{ lesson.title }}
            </button>
          </div>
        </article>

        <LessonPreviewCard
          v-if="selectedPreviewLesson"
          :lesson="selectedPreviewLesson"
          :status-label="selectedPreviewStatusLabel"
          :status-tone="selectedPreviewStatus"
          :node-level="selectedPreviewNode?.level"
          :is-target="selectedPreviewIsTarget"
          :missing-prerequisites="selectedPreviewMissingPrerequisites"
          :can-open="isLessonUnlocked(selectedPreviewLesson.id)"
          :open-route="`/learn/${selectedPreviewLesson.id}`"
          show-target-action
          :target-action-label="selectedPreviewIsTarget ? 'Remove target' : 'Set as target'"
          @toggle-target="togglePreviewTarget"
        />

        <article v-if="!diagnosticCompleted" class="task-card task-card--primary">
          <div>
            <p class="task-card__eyebrow">Diagnostic</p>
            <h2>Run the entry diagnostic</h2>
            <p>Start here so the learner state can unlock lessons from the graph instead of forcing a rigid order.</p>
          </div>
          <span class="task-card__xp">Placement</span>
          <RouterLink class="task-card__button" to="/diagnostic">Start diagnostic</RouterLink>
        </article>

        <article v-for="review in reviewCards" :key="review.skillId" class="task-card">
          <div>
            <p class="task-card__eyebrow">Review</p>
            <h2>{{ review.title }}</h2>
            <p>{{ review.subtitle }}</p>
          </div>
          <span class="task-card__xp">Due</span>
          <RouterLink class="task-card__button task-card__button--subtle" :to="review.route">Open review</RouterLink>
        </article>

        <article v-if="recommendedLesson" class="task-card task-card--lesson">
          <div>
            <p class="task-card__eyebrow">Next path node</p>
            <h2>{{ recommendedLesson.title }}</h2>
            <p>{{ recommendedLesson.summary }}</p>
            <small>{{ getLessonState(recommendedLesson.id) }}</small>
          </div>
          <span class="task-card__xp">{{ recommendedLesson.estimatedMinutes }} min</span>
          <div class="task-card__actions">
            <button class="task-card__button task-card__button--subtle" type="button" @click="previewLesson(recommendedLesson.id)">
              Preview
            </button>
            <RouterLink class="task-card__button" :to="`/learn/${recommendedLesson.id}`">
              Open lesson
            </RouterLink>
          </div>
        </article>

        <article v-if="recentLessons.length > 0" class="history-card">
          <p class="task-card__eyebrow">Recently mastered</p>
          <div v-for="lesson in recentLessons" :key="lesson.id" class="history-card__item">
            <strong>{{ lesson.title }}</strong>
            <span>Mastered lesson node</span>
          </div>
        </article>
      </div>
    </section>
  </AcademyShell>
</template>

<style scoped>
.learn-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.1rem;
  align-items: start;
}

.learn-feed {
  display: grid;
  gap: 0.9rem;
}

.learn-feed__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.learn-feed__header p {
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  font-weight: 800;
}

.learn-feed__header h2 {
  color: var(--color-heading);
  font-size: 1.25rem;
  font-weight: 800;
}

.task-card,
.history-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
  padding: 1.25rem;
  box-shadow: var(--shadow-soft);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 1.1rem;
}

.task-card--primary {
  border-color: rgba(20, 120, 201, 0.36);
  background: #fbfdff;
}

.task-card--lesson {
  border-left: 0.35rem solid var(--color-accent);
}

.task-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
  color: var(--color-accent);
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.task-card h2,
.history-card strong {
  color: var(--color-heading);
  font-weight: 800;
  line-height: 1.2;
}

.task-card p,
.task-card small,
.history-card span {
  color: var(--color-text-soft);
}

.task-card__xp {
  color: var(--color-text-soft);
  font-weight: 800;
  white-space: nowrap;
}

.task-card__button {
  border: 1px solid var(--color-accent);
  text-decoration: none;
  background: var(--color-accent);
  color: white;
  min-height: 2.8rem;
  padding: 0.72rem 1rem;
  border-radius: 0.35rem;
  white-space: nowrap;
  font-weight: 800;
  cursor: pointer;
}

.task-card__button--subtle {
  background: white;
  color: var(--color-heading);
  border: 1px solid var(--color-border);
}

.task-card__actions {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.history-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.target-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
  padding: 1.25rem;
  display: grid;
  gap: 1rem;
}

.target-card__head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

.target-card h2 {
  color: var(--color-heading);
  font-weight: 800;
  line-height: 1.2;
}

.target-card__list,
.target-card__path {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.target-card__list button,
.target-card__path button {
  color: var(--color-heading);
  border: 1px solid var(--color-border);
  border-radius: 0.35rem;
  background: white;
  padding: 0.4rem 0.6rem;
  font-weight: 800;
  cursor: pointer;
}

.target-card__path button {
  color: var(--color-text-soft);
  background: var(--color-surface-subtle);
  font-size: 0.9rem;
}

.history-card__item {
  display: grid;
  gap: 0.15rem;
}

@media (max-width: 1080px) {
  .task-card {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .task-card__button {
    justify-self: start;
  }

  .task-card__actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}

@media (max-width: 620px) {
  .task-card {
    grid-template-columns: 1fr;
    align-items: start;
  }
}
</style>
