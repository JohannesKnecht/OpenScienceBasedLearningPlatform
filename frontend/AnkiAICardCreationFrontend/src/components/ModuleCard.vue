<script setup lang="ts">
import type { Module } from '../content/model'

defineProps<{
  module: Module
  completedLessons: number
  totalLessons: number
  masteredSkills: number
  totalSkills: number
}>()
</script>

<template>
  <article class="module-card">
    <p class="module-card__badge">{{ module.badge }}</p>
    <h3>{{ module.title }}</h3>
    <p class="module-card__summary">{{ module.summary }}</p>
    <dl class="module-card__meta">
      <div>
        <dt>Lessons</dt>
        <dd>{{ completedLessons }}/{{ totalLessons }} mastered</dd>
      </div>
      <div>
        <dt>Skills</dt>
        <dd>{{ masteredSkills }}/{{ totalSkills }} mastered</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.module-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 0.9rem;
}

.module-card__badge {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-accent);
  font-weight: 700;
}

.module-card h3 {
  font-size: 1.3rem;
  font-weight: 650;
  color: var(--color-heading);
}

.module-card__summary {
  color: var(--color-text-soft);
}

.module-card__meta {
  display: grid;
  gap: 0.85rem;
}

.module-card__meta div {
  display: grid;
  gap: 0.2rem;
}

.module-card__meta dt {
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.module-card__meta dd {
  color: var(--color-heading);
}
</style>
