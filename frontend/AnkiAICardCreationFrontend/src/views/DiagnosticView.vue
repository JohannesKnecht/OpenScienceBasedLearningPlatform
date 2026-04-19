<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AcademyShell from '../components/AcademyShell.vue'
import AssessmentRunner from '../components/AssessmentRunner.vue'
import { getEntryAssessmentForCourse, primaryCourse } from '../content'
import type { AssessmentRunResult } from '../content/model'
import { useLearningProgress } from '../lib/progress'

const assessment = primaryCourse ? getEntryAssessmentForCourse(primaryCourse.id) : undefined
const { completeAssessment, nextRecommendedAction } = useLearningProgress()
const lastResult = ref<AssessmentRunResult | null>(null)

function handleComplete(result: AssessmentRunResult): void {
  if (!assessment) {
    return
  }

  lastResult.value = result
  completeAssessment(assessment.id, result)
}
</script>

<template>
  <AcademyShell
    eyebrow="Placement"
    title="Entry diagnostic"
    subtitle="The diagnostic marks already-stable skills and prevents the course from feeling artificially linear."
  >
    <section class="diagnostic-layout">
      <article class="diagnostic-card" v-if="assessment">
        <div class="diagnostic-card__intro">
          <p class="diagnostic-card__eyebrow">Assessment</p>
          <h2>{{ assessment.title }}</h2>
          <p>{{ assessment.description }}</p>
        </div>

        <AssessmentRunner
          :assessment="assessment"
          submit-label="Run diagnostic"
          success-label="Diagnostic score"
          @complete="handleComplete"
        />

        <div v-if="lastResult" class="diagnostic-card__result">
          <strong>{{ lastResult.correctCount }}/{{ lastResult.totalCount }} diagnostic items correct</strong>
          <p>
            The local learner model now uses these results to recommend the next unlocked lesson or review.
          </p>
          <RouterLink class="diagnostic-card__button" :to="nextRecommendedAction.route">
            Continue with recommendation
          </RouterLink>
        </div>
      </article>
    </section>
  </AcademyShell>
</template>

<style scoped>
.diagnostic-layout {
  display: grid;
}

.diagnostic-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.75rem;
  padding: 1.7rem;
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 1.2rem;
}

.diagnostic-card__intro,
.diagnostic-card__result {
  display: grid;
  gap: 0.6rem;
}

.diagnostic-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.76rem;
  color: var(--color-accent);
  font-weight: 700;
}

.diagnostic-card h2,
.diagnostic-card strong {
  color: var(--color-heading);
}

.diagnostic-card p {
  color: var(--color-text-soft);
}

.diagnostic-card__button {
  justify-self: start;
  text-decoration: none;
  padding: 0.9rem 1.15rem;
  border-radius: 999px;
  background: var(--color-heading);
  color: white;
}
</style>
