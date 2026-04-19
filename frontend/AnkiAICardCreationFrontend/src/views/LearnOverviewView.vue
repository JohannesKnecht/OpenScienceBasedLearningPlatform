<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AcademyShell from '../components/AcademyShell.vue'
import ProgressPanel from '../components/ProgressPanel.vue'
import { allLessons, getLessonModule, getReviewAssessmentForSkill, getSkill } from '../content'
import { useLearningProgress } from '../lib/progress'

const progress = useLearningProgress()
const diagnosticCompleted = computed(() => progress.progressState.diagnosticCompleted)
const { nextRecommendedAction, getLessonState, dueReviewSkillIds } = progress

interface ReviewCard {
  skillId: string
  title: string
  subtitle: string
  route: string
}

const nextLesson = computed(() =>
  allLessons.find((lesson) => {
    const state = getLessonState(lesson.id)
    return state === 'ready' || state === 'learning'
  }),
)

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
    title="Simple daily learning"
    subtitle="Open the next lesson, clear reviews when they are due, and use the full graph only when you want the big picture."
  >
    <section class="learn-layout">
      <ProgressPanel />

      <div class="learn-feed">
        <article v-if="!diagnosticCompleted" class="task-card task-card--primary">
          <div>
            <p class="task-card__eyebrow">Diagnostic</p>
            <h2>Run the entry diagnostic</h2>
            <p>Start here so the learner state can unlock lessons from the graph instead of forcing a rigid order.</p>
          </div>
          <RouterLink class="task-card__button" to="/diagnostic">Start diagnostic</RouterLink>
        </article>

        <article v-for="review in reviewCards" :key="review.skillId" class="task-card">
          <div>
            <p class="task-card__eyebrow">Review</p>
            <h2>{{ review.title }}</h2>
            <p>{{ review.subtitle }}</p>
          </div>
          <RouterLink class="task-card__button task-card__button--subtle" :to="review.route">Open review</RouterLink>
        </article>

        <article v-if="nextLesson" class="task-card task-card--lesson">
          <div>
            <p class="task-card__eyebrow">Next lesson</p>
            <h2>{{ nextLesson.title }}</h2>
            <p>{{ nextLesson.summary }}</p>
            <small>{{ getLessonModule(nextLesson.id)?.title }}</small>
          </div>
          <RouterLink class="task-card__button" :to="`/learn/${nextLesson.moduleId}/${nextLesson.id}`">
            Open lesson
          </RouterLink>
        </article>

        <article v-if="recentLessons.length > 0" class="history-card">
          <p class="task-card__eyebrow">Recently mastered</p>
          <div v-for="lesson in recentLessons" :key="lesson.id" class="history-card__item">
            <strong>{{ lesson.title }}</strong>
            <span>{{ getLessonModule(lesson.id)?.title }}</span>
          </div>
        </article>
      </div>
    </section>
  </AcademyShell>
</template>

<style scoped>
.learn-layout {
  display: grid;
  grid-template-columns: minmax(18rem, 22rem) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}

.learn-feed {
  display: grid;
  gap: 1rem;
}

.task-card,
.history-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.6rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.task-card--primary {
  background: linear-gradient(135deg, #f8fbff 0%, #eef4ff 100%);
}

.task-card--lesson {
  border-color: rgba(76, 116, 255, 0.24);
}

.task-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.76rem;
  color: var(--color-accent);
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.task-card h2,
.history-card strong {
  color: var(--color-heading);
  font-weight: 680;
}

.task-card p,
.task-card small,
.history-card span {
  color: var(--color-text-soft);
}

.task-card__button {
  text-decoration: none;
  background: var(--color-heading);
  color: white;
  padding: 0.9rem 1.2rem;
  border-radius: 999px;
  white-space: nowrap;
}

.task-card__button--subtle {
  background: white;
  color: var(--color-heading);
  border: 1px solid var(--color-border);
}

.history-card {
  display: grid;
  gap: 0.75rem;
}

.history-card__item {
  display: grid;
  gap: 0.15rem;
}

@media (max-width: 1080px) {
  .learn-layout {
    grid-template-columns: 1fr;
  }

  .task-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
