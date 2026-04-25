<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Lesson, Skill } from '../content/model'

defineProps<{
  lesson: Lesson
  statusLabel: string
  statusTone: string
  nodeLevel?: number
  isTarget?: boolean
  missingPrerequisites?: Skill[]
  canOpen?: boolean
  openRoute: string
  showTargetAction?: boolean
  targetActionLabel?: string
}>()

defineEmits<{
  toggleTarget: []
}>()
</script>

<template>
  <article class="lesson-preview-card">
    <p class="lesson-preview-card__eyebrow">Lesson preview</p>
    <div class="lesson-preview-card__meta-row">
      <span class="lesson-preview-card__status" :class="`is-${statusTone}`">{{ statusLabel }}</span>
      <span v-if="isTarget" class="lesson-preview-card__target">Target</span>
      <span v-if="nodeLevel !== undefined">Level {{ nodeLevel + 1 }}</span>
      <span>{{ lesson.estimatedMinutes }} min</span>
    </div>

    <h2>{{ lesson.title }}</h2>
    <p>{{ lesson.summary }}</p>

    <div class="lesson-preview-card__goal">
      <span>Goal</span>
      <strong>{{ lesson.objective }}</strong>
    </div>

    <div v-if="missingPrerequisites && missingPrerequisites.length > 0" class="lesson-preview-card__locked">
      <span>Required first</span>
      <ul>
        <li v-for="skill in missingPrerequisites" :key="skill.id">{{ skill.title }}</li>
      </ul>
    </div>

    <div class="lesson-preview-card__actions">
      <button
        v-if="showTargetAction"
        class="lesson-preview-card__button lesson-preview-card__button--subtle"
        type="button"
        @click="$emit('toggleTarget')"
      >
        {{ targetActionLabel ?? 'Set as target' }}
      </button>
      <RouterLink v-if="canOpen" class="lesson-preview-card__button" :to="openRoute">Open lesson</RouterLink>
    </div>

    <p v-if="!canOpen" class="lesson-preview-card__disabled">Locked until prerequisites are mastered.</p>
  </article>
</template>

<style scoped>
.lesson-preview-card {
  display: grid;
  gap: 0.9rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.1rem;
}

.lesson-preview-card__eyebrow,
.lesson-preview-card__goal span,
.lesson-preview-card__locked span {
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 800;
}

.lesson-preview-card__meta-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
  color: var(--color-text-soft);
  font-weight: 800;
}

.lesson-preview-card__status,
.lesson-preview-card__target {
  border-radius: 0.45rem;
  padding: 0.25rem 0.5rem;
}

.lesson-preview-card__target,
.is-target {
  background: #fff3a8;
  color: #5f4b00;
}

.is-current {
  background: #cadcff;
  color: #0f2c78;
}

.is-review {
  background: #fff1cf;
  color: #8a5b12;
}

.is-ready,
.is-learning {
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

.lesson-preview-card h2,
.lesson-preview-card__goal strong {
  color: var(--color-heading);
  font-weight: 800;
  line-height: 1.2;
}

.lesson-preview-card p,
.lesson-preview-card li,
.lesson-preview-card__disabled {
  color: var(--color-text-soft);
}

.lesson-preview-card__goal,
.lesson-preview-card__locked {
  display: grid;
  gap: 0.35rem;
  border: 1px solid var(--color-border);
  border-radius: 0.7rem;
  padding: 0.85rem;
  background: var(--color-surface-subtle);
}

.lesson-preview-card__locked ul {
  padding-left: 1rem;
}

.lesson-preview-card__actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.lesson-preview-card__button {
  display: inline-flex;
  min-height: 2.85rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-accent);
  border-radius: 0.55rem;
  background: var(--color-accent);
  color: white;
  padding: 0.75rem 0.95rem;
  text-decoration: none;
  cursor: pointer;
  font-weight: 800;
}

.lesson-preview-card__button--subtle {
  border-color: var(--color-border);
  background: white;
  color: var(--color-heading);
}

.lesson-preview-card__disabled {
  border-top: 1px solid var(--color-border);
  padding-top: 0.85rem;
  font-weight: 800;
}
</style>
