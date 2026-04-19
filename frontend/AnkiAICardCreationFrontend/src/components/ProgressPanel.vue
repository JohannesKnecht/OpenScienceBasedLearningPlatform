<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { allLessons, allSkills, primaryTrack } from '../content'
import { useLearningProgress } from '../lib/progress'

const {
  progressState,
  completionPercentage,
  completedLessonCount,
  masteredSkillCount,
  dueReviewSkillIds,
  nextRecommendedAction,
  resetProgress,
} = useLearningProgress()
</script>

<template>
  <aside class="progress-panel">
    <div class="progress-panel__section">
      <p class="progress-panel__label">Learn</p>
      <h2>{{ primaryTrack?.title }}</h2>
      <p>{{ primaryTrack?.tagline }}</p>
    </div>

    <div class="progress-panel__stats">
      <article>
        <span>XP</span>
        <strong>{{ progressState.xp }}</strong>
      </article>
      <article>
        <span>Streak</span>
        <strong>{{ progressState.streak }} days</strong>
      </article>
      <article>
        <span>Skills mastered</span>
        <strong>{{ masteredSkillCount }}/{{ allSkills.length }}</strong>
      </article>
      <article>
        <span>Lessons mastered</span>
        <strong>{{ completedLessonCount }}/{{ allLessons.length }}</strong>
      </article>
      <article>
        <span>Review due</span>
        <strong>{{ dueReviewSkillIds.length }}</strong>
      </article>
      <article>
        <span>Completion</span>
        <strong>{{ completionPercentage }}%</strong>
      </article>
    </div>

    <div class="progress-panel__recommendation">
      <p class="progress-panel__label">Next up</p>
      <h3>{{ nextRecommendedAction.title }}</h3>
      <p>{{ nextRecommendedAction.description }}</p>
      <RouterLink class="progress-panel__cta" :to="nextRecommendedAction.route">
        Open
      </RouterLink>
    </div>

    <RouterLink class="progress-panel__graph-link" to="/graph">Open full graph</RouterLink>

    <button class="progress-panel__reset" type="button" @click="resetProgress">
      Reset progress
    </button>
  </aside>
</template>

<style scoped>
.progress-panel {
  display: grid;
  gap: 1.25rem;
  background: linear-gradient(180deg, rgba(242, 246, 255, 0.96), rgba(255, 255, 255, 0.96));
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
}

.progress-panel__section,
.progress-panel__recommendation {
  display: grid;
  gap: 0.6rem;
}

.progress-panel__label {
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.76rem;
  font-weight: 700;
}

.progress-panel h2,
.progress-panel h3 {
  color: var(--color-heading);
  font-weight: 650;
}

.progress-panel p {
  color: var(--color-text-soft);
}

.progress-panel__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.progress-panel__stats article {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  padding: 1rem;
  display: grid;
  gap: 0.35rem;
}

.progress-panel__stats span {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.progress-panel__stats strong {
  color: var(--color-heading);
  font-size: 1.35rem;
  font-weight: 650;
}

.progress-panel__cta,
.progress-panel__graph-link,
.progress-panel__reset {
  text-decoration: none;
  border: 0;
  border-radius: 999px;
  background: var(--color-heading);
  color: white;
  padding: 0.85rem 1rem;
  cursor: pointer;
  justify-self: start;
}

.progress-panel__graph-link {
  background: white;
  color: var(--color-heading);
  border: 1px solid var(--color-border);
}
</style>
