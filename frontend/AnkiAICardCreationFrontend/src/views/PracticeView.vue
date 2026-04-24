<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AssessmentRunner from '../components/AssessmentRunner.vue'
import LessonSidebar from '../components/LessonSidebar.vue'
import ProgressPanel from '../components/ProgressPanel.vue'
import { getAssessment, getLesson, getLessonModule, getNextLesson } from '../content'
import type { AssessmentRunResult } from '../content/model'
import { useLearningProgress } from '../lib/progress'

const route = useRoute()
const router = useRouter()
const { touchLesson, completeAssessment, isLessonUnlocked } = useLearningProgress()

const lessonId = computed(() => route.params.lessonSlug as string)
const lesson = computed(() => getLesson(lessonId.value))
const module = computed(() => getLessonModule(lessonId.value))
const assessment = computed(() => (lesson.value ? getAssessment(lesson.value.assessmentId) : undefined))
const nextLesson = computed(() => (module.value && lesson.value ? getNextLesson(module.value.courseId, lesson.value.id) : undefined))
const lastResult = ref<AssessmentRunResult | null>(null)

watch(
  () => assessment.value?.id,
  () => {
    lastResult.value = null
  },
)

watchEffect(() => {
  if (!lesson.value || !module.value || !assessment.value) {
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
  <main v-if="lesson && module && assessment" class="practice-layout">
    <LessonSidebar :current-lesson-id="lesson.id" />

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
            v-if="lastResult.passed && nextLesson"
            class="practice-card__button practice-card__button--primary"
            :to="`/learn/${nextLesson.moduleId}/${nextLesson.id}`"
          >
            Open next lesson
          </RouterLink>
        </div>

        <footer class="practice-card__footer">
          <RouterLink class="practice-card__button practice-card__button--secondary" :to="`/learn/${module.id}/${lesson.id}`">
            Back to lesson
          </RouterLink>
        </footer>
      </article>
    </section>

    <ProgressPanel />
  </main>
</template>

<style scoped>
.practice-layout {
  display: grid;
  grid-template-columns: minmax(17rem, 0.9fr) minmax(0, 1.5fr) minmax(18rem, 0.85fr);
  gap: 1rem;
  align-items: start;
}

.practice-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.75rem;
  padding: 1.7rem;
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
  letter-spacing: 0.18em;
  font-size: 0.76rem;
  color: var(--color-accent);
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.practice-card h1 {
  color: var(--color-heading);
  font-weight: 680;
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
  border-radius: 1.2rem;
  background: linear-gradient(135deg, #f8fbff, #eef5ff);
}

.practice-result strong,
.practice-card__blocked strong {
  color: var(--color-heading);
}

.practice-card__footer {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.practice-card__button {
  border: 0;
  text-decoration: none;
  padding: 0.9rem 1.15rem;
  border-radius: 999px;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
}

.practice-card__button--primary {
  background: var(--color-heading);
  color: white;
}

.practice-card__button--secondary {
  background: var(--color-surface-strong);
  color: var(--color-heading);
}

@media (max-width: 1240px) {
  .practice-layout {
    grid-template-columns: 1fr;
  }
}
</style>
