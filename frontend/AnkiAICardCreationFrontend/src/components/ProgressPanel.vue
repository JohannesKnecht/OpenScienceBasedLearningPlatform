<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLearningProgress } from '../lib/progress'

const {
  completionPercentage,
  dueReviewSkillIds,
  nextRecommendedAction,
  targetLessonIds,
  targetLessons,
  targetPathCompletedLessonCount,
  targetPathCompletionPercentage,
  targetPathTotalLessonCount,
  clearTargetLessons,
  resetProgress,
} = useLearningProgress()

const activeCompletionPercentage = computed(() =>
  targetLessonIds.value.length > 0 ? targetPathCompletionPercentage.value : completionPercentage.value,
)

const headline = computed(() => {
  if (targetLessons.value.length === 0) {
    return 'Choose target nodes'
  }

  if (targetLessons.value.length === 1) {
    return targetLessons.value[0]?.title ?? 'Target path'
  }

  return `${targetLessons.value.length} target nodes`
})

const pathCountLabel = computed(() =>
  targetPathTotalLessonCount.value > 0
    ? `${targetPathCompletedLessonCount.value}/${targetPathTotalLessonCount.value}`
    : 'No path yet',
)
</script>

<template>
  <aside class="progress-panel">
    <section class="progress-panel__summary">
      <div class="progress-panel__headline">
        <div>
          <p class="progress-panel__label">Target path</p>
          <h2>{{ headline }}</h2>
        </div>
        <strong class="progress-panel__completion">{{ activeCompletionPercentage }}%</strong>
      </div>

      <p class="progress-panel__tagline">
        {{
          targetLessonIds.length > 0
            ? `Working through ${targetPathTotalLessonCount} required lesson nodes.`
            : 'Pick lesson nodes from the graph and the system will build the path.'
        }}
      </p>

      <div class="progress-panel__bar" aria-label="Target path completion">
        <span :style="{ width: `${activeCompletionPercentage}%` }" />
      </div>

      <div class="progress-panel__metrics" aria-label="Path status">
        <span>{{ pathCountLabel }} path nodes</span>
        <span>{{ dueReviewSkillIds.length }} reviews</span>
        <span>{{ targetLessonIds.length }} targets</span>
      </div>
    </section>

    <div class="progress-panel__recommendation">
      <p class="progress-panel__label">Next up</p>
      <h3>{{ nextRecommendedAction.title }}</h3>
      <p>{{ nextRecommendedAction.description }}</p>
    </div>

    <div class="progress-panel__actions">
      <RouterLink class="progress-panel__cta" :to="nextRecommendedAction.route">Open next</RouterLink>
      <RouterLink class="progress-panel__graph-link" to="/graph">Graph</RouterLink>
      <button class="progress-panel__reset" type="button" @click="resetProgress">Reset</button>
    </div>

    <div v-if="targetLessons.length > 0" class="progress-panel__targets">
      <p class="progress-panel__label">Targets</p>
      <div class="progress-panel__actions">
        <RouterLink v-for="lesson in targetLessons" :key="lesson.id" class="progress-panel__target" :to="`/learn/${lesson.id}`">
          {{ lesson.title }}
        </RouterLink>
        <button class="progress-panel__clear" type="button" @click="clearTargetLessons">Clear targets</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.progress-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(16rem, 0.9fr) auto;
  gap: 1rem;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  padding: 0.95rem 1rem;
  box-shadow: var(--shadow-soft);
}

.progress-panel__summary,
.progress-panel__recommendation {
  display: grid;
  gap: 0.55rem;
}

.progress-panel__headline {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
}

.progress-panel__label {
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 800;
}

.progress-panel h2,
.progress-panel h3 {
  color: var(--color-heading);
  font-weight: 800;
  line-height: 1.15;
}

.progress-panel__tagline,
.progress-panel p {
  color: var(--color-text-soft);
}

.progress-panel__metrics,
.progress-panel__targets .progress-panel__actions {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.progress-panel__metrics span {
  color: var(--color-text-soft);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-subtle);
  padding: 0.25rem 0.55rem;
  font-size: 0.82rem;
  font-weight: 800;
}

.progress-panel__targets {
  grid-column: 1 / -1;
  border-top: 1px solid var(--color-border);
  padding-top: 0.75rem;
}

.progress-panel__completion {
  display: grid;
  place-items: center;
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 1rem;
  color: var(--color-heading);
  background: var(--color-surface-strong);
  font-size: 1.25rem;
}

.progress-panel__bar {
  height: 0.7rem;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-surface-strong);
}

.progress-panel__bar span {
  display: block;
  height: 100%;
  min-width: 0.35rem;
  border-radius: inherit;
  background: var(--color-progress);
}

.progress-panel__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.progress-panel__cta,
.progress-panel__graph-link,
.progress-panel__reset,
.progress-panel__target,
.progress-panel__clear {
  min-height: 2.55rem;
  text-decoration: none;
  border-radius: 0.35rem;
  padding: 0.6rem 0.85rem;
  cursor: pointer;
  font-weight: 800;
}

.progress-panel__cta {
  border: 1px solid var(--color-accent);
  background: var(--color-accent);
  color: white;
}

.progress-panel__graph-link,
.progress-panel__reset,
.progress-panel__target,
.progress-panel__clear {
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-heading);
}

.progress-panel__reset,
.progress-panel__clear {
  color: var(--color-text-soft);
}

@media (max-width: 1080px) {
  .progress-panel {
    grid-template-columns: 1fr auto;
  }

  .progress-panel__recommendation {
    grid-column: 1 / -1;
  }

  .progress-panel__targets {
    grid-column: 1 / -1;
  }
}

@media (max-width: 680px) {
  .progress-panel {
    grid-template-columns: 1fr;
  }

  .progress-panel__actions {
    justify-content: flex-start;
  }
}
</style>
