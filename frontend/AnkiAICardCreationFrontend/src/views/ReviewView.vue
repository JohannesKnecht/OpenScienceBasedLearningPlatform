<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AcademyShell from '../components/AcademyShell.vue'
import AssessmentRunner from '../components/AssessmentRunner.vue'
import { getSkill, getReviewForSkill, getReviewAssessmentForSkill } from '../content'
import type { AssessmentRunResult } from '../content/model'
import { useLearningProgress } from '../lib/progress'

const route = useRoute()
const { completeAssessment, dueReviewSkillIds, nextRecommendedAction } = useLearningProgress()
const lastResult = ref<AssessmentRunResult | null>(null)

const activeSkillId = computed(() => (route.params.skillId as string | undefined) ?? dueReviewSkillIds.value[0] ?? null)
const activeSkill = computed(() => (activeSkillId.value ? getSkill(activeSkillId.value) : undefined))
const activeReview = computed(() => (activeSkillId.value ? getReviewForSkill(activeSkillId.value) : undefined))
const activeAssessment = computed(() =>
  activeSkillId.value ? getReviewAssessmentForSkill(activeSkillId.value) : undefined,
)

function handleComplete(result: AssessmentRunResult): void {
  if (!activeAssessment.value) {
    return
  }

  lastResult.value = result
  completeAssessment(activeAssessment.value.id, result)
}
</script>

<template>
  <AcademyShell
    eyebrow="Retention"
    title="Scheduled review"
    subtitle="Reviews are triggered from mastered skills whose due date has elapsed. This is the first step toward a proper retention loop."
  >
    <section class="review-layout">
      <article class="review-card" v-if="activeAssessment && activeSkill && activeReview">
        <div class="review-card__intro">
          <p class="review-card__eyebrow">Due skill</p>
          <h2>{{ activeSkill.title }}</h2>
          <p>{{ activeSkill.description }}</p>
          <p class="review-card__meta">Review template: {{ activeReview.title }}</p>
        </div>

        <AssessmentRunner
          :assessment="activeAssessment"
          submit-label="Submit review"
          success-label="Review score"
          @complete="handleComplete"
        />

        <div v-if="lastResult" class="review-card__result">
          <strong>{{ lastResult.correctCount }}/{{ lastResult.totalCount }} review items correct</strong>
          <p>
            Passing this review pushes the due date forward. Failing it moves the skill back into active learning.
          </p>
        </div>
      </article>

      <article v-else class="review-card review-card--empty">
        <p class="review-card__eyebrow">Queue empty</p>
        <h2>No reviews are due right now.</h2>
        <p>Open the next recommended action or continue through unlocked lessons.</p>
        <RouterLink class="review-card__button" :to="nextRecommendedAction.route">
          Open next action
        </RouterLink>
      </article>
    </section>
  </AcademyShell>
</template>

<style scoped>
.review-layout {
  display: grid;
}

.review-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.45rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 1.2rem;
}

.review-card__intro,
.review-card__result {
  display: grid;
  gap: 0.6rem;
}

.review-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
  color: var(--color-accent);
  font-weight: 800;
}

.review-card h2,
.review-card strong {
  color: var(--color-heading);
  font-weight: 800;
}

.review-card p {
  color: var(--color-text-soft);
}

.review-card__meta {
  font-size: 0.95rem;
}

.review-card__button {
  justify-self: start;
  text-decoration: none;
  min-height: 2.85rem;
  padding: 0.75rem 1rem;
  border-radius: 0.35rem;
  background: var(--color-accent);
  color: white;
  font-weight: 800;
}
</style>
