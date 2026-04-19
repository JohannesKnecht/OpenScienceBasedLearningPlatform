<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Assessment, AssessmentItem, AssessmentRunResult } from '../content/model'

const props = defineProps<{
  assessment: Assessment
  submitLabel?: string
  successLabel?: string
}>()

const emit = defineEmits<{
  complete: [result: AssessmentRunResult]
}>()

const answers = ref<Record<string, string>>({})
const feedback = ref<Record<string, boolean>>({})
const submitted = ref(false)

function resetSession(): void {
  answers.value = {}
  feedback.value = {}
  submitted.value = false
}

watch(
  () => props.assessment.id,
  () => {
    resetSession()
  },
  { immediate: true },
)

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function evaluateItem(item: AssessmentItem, answer: string): boolean {
  if (item.type === 'multiple-choice') {
    return answer === item.correctAnswer
  }

  if (item.type === 'text') {
    return item.acceptedAnswers.map(normalize).includes(normalize(answer))
  }

  return normalize(answer) === item.correctOrder.map(normalize).join(' | ')
}

const correctCount = computed(() => Object.values(feedback.value).filter(Boolean).length)

function submitAssessment(): void {
  const nextFeedback: Record<string, boolean> = {}
  const itemResults: AssessmentRunResult['itemResults'] = []

  props.assessment.items.forEach((item) => {
    const isCorrect = evaluateItem(item, answers.value[item.id] ?? '')
    nextFeedback[item.id] = isCorrect
    itemResults.push({
      itemId: item.id,
      skillId: item.skillId,
      correct: isCorrect,
    })
  })

  feedback.value = nextFeedback
  submitted.value = true

  emit('complete', {
    passed: Object.values(nextFeedback).filter(Boolean).length >= props.assessment.passRule.minCorrect,
    correctCount: Object.values(nextFeedback).filter(Boolean).length,
    totalCount: props.assessment.items.length,
    itemResults,
  })
}
</script>

<template>
  <section class="assessment-runner">
    <article v-for="item in assessment.items" :key="item.id" class="assessment-runner__item">
      <div class="assessment-runner__head">
        <h2>{{ item.prompt }}</h2>
        <small>{{ item.type }}</small>
      </div>

      <div v-if="item.type === 'multiple-choice'" class="assessment-runner__options">
        <label v-for="option in item.options" :key="option" class="assessment-runner__option">
          <input v-model="answers[item.id]" type="radio" :name="item.id" :value="option" />
          <span>{{ option }}</span>
        </label>
      </div>

      <div v-else-if="item.type === 'order'" class="assessment-runner__text-block">
        <p>Format: {{ item.options.join(' | ') }}</p>
        <input v-model="answers[item.id]" type="text" :placeholder="item.options.join(' | ')" />
      </div>

      <div v-else class="assessment-runner__text-block">
        <input v-model="answers[item.id]" type="text" :placeholder="item.placeholder" />
      </div>

      <div
        v-if="submitted"
        class="assessment-runner__feedback"
        :class="feedback[item.id] ? 'is-correct' : 'is-wrong'"
      >
        <strong>{{ feedback[item.id] ? 'Correct' : 'Not yet' }}</strong>
        <p>{{ item.explanation }}</p>
      </div>
    </article>

    <footer class="assessment-runner__footer">
      <button type="button" class="assessment-runner__button" @click="submitAssessment">
        {{ submitLabel ?? 'Submit assessment' }}
      </button>
      <p v-if="submitted" class="assessment-runner__score">
        {{ successLabel ?? 'Current score' }}: {{ correctCount }}/{{ assessment.items.length }}
      </p>
    </footer>
  </section>
</template>

<style scoped>
.assessment-runner {
  display: grid;
  gap: 1rem;
}

.assessment-runner__item {
  display: grid;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 1.2rem;
  background: var(--color-surface-subtle);
}

.assessment-runner__head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.assessment-runner__head h2 {
  color: var(--color-heading);
  font-size: 1.05rem;
  font-weight: 650;
}

.assessment-runner__head small {
  color: var(--color-text-muted);
  text-transform: capitalize;
}

.assessment-runner__options,
.assessment-runner__text-block {
  display: grid;
  gap: 0.75rem;
}

.assessment-runner__option {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  background: white;
  border-radius: 1rem;
  padding: 0.8rem 0.9rem;
}

.assessment-runner input[type='text'] {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 0.95rem;
  padding: 0.85rem 1rem;
  font: inherit;
  background: white;
}

.assessment-runner__feedback {
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  display: grid;
  gap: 0.35rem;
}

.assessment-runner__feedback.is-correct {
  background: #edf9f1;
  color: #17633d;
}

.assessment-runner__feedback.is-wrong {
  background: #fff2f2;
  color: #9c2f2f;
}

.assessment-runner__footer {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
}

.assessment-runner__button {
  border: 0;
  border-radius: 999px;
  padding: 0.9rem 1.15rem;
  background: var(--color-heading);
  color: white;
  font-size: 0.98rem;
  font-weight: 600;
  cursor: pointer;
}

.assessment-runner__score {
  color: var(--color-text-soft);
}
</style>
