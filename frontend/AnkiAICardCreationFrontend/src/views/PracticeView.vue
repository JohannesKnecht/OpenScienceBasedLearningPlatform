<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AssessmentRunner from '../components/AssessmentRunner.vue'
import { getAssessment, getLesson } from '../content'
import type { AssessmentRunResult } from '../content/model'
import { useLearningProgress } from '../lib/progress'

const route = useRoute()
const router = useRouter()
const { touchLesson, completeAssessment, isLessonUnlocked, nextRecommendedAction } = useLearningProgress()

const lessonId = computed(() => route.params.lessonSlug as string)
const lesson = computed(() => getLesson(lessonId.value))
const assessment = computed(() => (lesson.value ? getAssessment(lesson.value.assessmentId) : undefined))
const nextLessonRoute = computed(() => {
  const recommendation = nextRecommendedAction.value
  return recommendation.type === 'lesson' ? recommendation.route : null
})
const lastResult = ref<AssessmentRunResult | null>(null)

watch(
  () => assessment.value?.id,
  () => {
    lastResult.value = null
  },
)

watchEffect(() => {
  if (!lesson.value || !assessment.value) {
    router.replace('/learn')
    return
  }

  touchLesson(lesson.value.id)
})

function handleComplete(result: AssessmentRunResult): void {
  if (!assessment.value) {
    return
  }

  lastResult.value = result
  completeAssessment(assessment.value.id, result)
}
</script>

<template>
  <main v-if="lesson && assessment" class="practice-layout">
    <section class="practice-main">
      <article class="practice-card">
        <div class="practice-card__header">
          <div>
            <p class="practice-card__eyebrow">Lesson check</p>
            <h1>{{ lesson.title }}</h1>
          </div>
          <span>{{ assessment.items.length }} items</span>
        </div>

        <p class="practice-card__summary">{{ assessment.description }}</p>

        <div v-if="!isLessonUnlocked(lesson.id)" class="practice-card__blocked">
          <strong>This check is currently locked.</strong>
          <p>Open the lesson once its prerequisite skills are mastered.</p>
        </div>

        <AssessmentRunner
          v-else
          :assessment="assessment"
          submit-label="Check lesson"
          success-label="Score"
          @complete="handleComplete"
        />

        <div v-if="lastResult" class="practice-result">
          <strong>Score: {{ lastResult.correctCount }}/{{ lastResult.totalCount }}</strong>
          <p v-if="lastResult.passed">
            Lesson check passed. Skill mastery and review scheduling have been updated locally.
          </p>
          <p v-else>The learner model recorded this attempt. Review the explanations and try again.</p>
          <RouterLink
            v-if="lastResult.passed && nextLessonRoute"
            class="practice-card__button practice-card__button--primary"
            :to="nextLessonRoute"
          >
            Open recommended lesson
          </RouterLink>
        </div>

        <footer class="practice-card__footer">
          <RouterLink class="practice-card__button practice-card__button--secondary" :to="`/learn/${lesson.id}`">
            Back to lesson
          </RouterLink>
        </footer>
      </article>
    </section>
  </main>
</template>

<style scoped>
.practice-layout {
  display: grid;
  max-width: 900px;
  margin: 0 auto;
  gap: 1rem;
}

.practice-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.45rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 1.2rem;
}

.practice-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.practice-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
  color: var(--color-accent);
  font-weight: 800;
  margin-bottom: 0.4rem;
}

.practice-card h1 {
  color: var(--color-heading);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.practice-card__summary,
.practice-result p,
.practice-card__blocked p {
  color: var(--color-text-soft);
}

.practice-card__blocked,
.practice-result {
  display: grid;
  gap: 0.65rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.35rem;
  background: var(--color-surface-subtle);
}

.practice-result strong,
.practice-card__blocked strong {
  color: var(--color-heading);
}

.practice-card__footer {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
}

.practice-card__button {
  border: 0;
  text-decoration: none;
  min-height: 2.85rem;
  padding: 0.75rem 1rem;
  border-radius: 0.35rem;
  font-size: 0.98rem;
  font-weight: 800;
  cursor: pointer;
}

.practice-card__button--primary {
  background: var(--color-accent);
  color: white;
}

.practice-card__button--secondary {
  background: var(--color-surface-strong);
  color: var(--color-heading);
}

@media (max-width: 620px) {
  .practice-card {
    padding: 1.1rem;
  }

  .practice-card__header {
    display: grid;
    align-items: start;
  }
}
</style>
