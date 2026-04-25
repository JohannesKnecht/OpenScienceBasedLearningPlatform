<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import LessonSidebar from '../components/LessonSidebar.vue'
import { getLesson, getLessonPrerequisites, getSkill } from '../content'
import { useLearningProgress } from '../lib/progress'

const route = useRoute()
const router = useRouter()
const { touchLesson, isLessonUnlocked, isSkillMastered, nextRecommendedAction } = useLearningProgress()

const lessonId = computed(() => route.params.lessonSlug as string)
const lesson = computed(() => getLesson(lessonId.value))
const nextLessonRoute = computed(() => {
  const recommendation = nextRecommendedAction.value
  return recommendation.type === 'lesson' && recommendation.route !== route.fullPath ? recommendation.route : null
})
const missingPrerequisites = computed(() =>
  getLessonPrerequisites(lessonId.value).filter((skill) => !isSkillMastered(skill.id)),
)

watchEffect(() => {
  if (!lesson.value) {
    router.replace('/learn')
    return
  }

  touchLesson(lesson.value.id)
})
</script>

<template>
  <main v-if="lesson" class="lesson-layout">
    <section class="lesson-main">
      <article class="lesson-card">
        <div class="lesson-card__header">
          <div>
            <p class="lesson-card__eyebrow">Lesson node</p>
            <h1>{{ lesson.title }}</h1>
          </div>
          <span class="lesson-card__duration">{{ lesson.estimatedMinutes }} min</span>
        </div>

        <p class="lesson-card__summary">{{ lesson.summary }}</p>

        <div class="lesson-card__objective">
          <span>Goal</span>
          <strong>{{ lesson.objective }}</strong>
        </div>

        <div v-if="!isLessonUnlocked(lesson.id)" class="lesson-card__blocked">
          <span>Locked by prerequisites</span>
          <p>
            This lesson is intentionally gated by the skill graph. Master the following prerequisite skills first:
          </p>
          <ul>
            <li v-for="skill in missingPrerequisites" :key="skill.id">{{ skill.title }}</li>
          </ul>
        </div>

        <template v-else>
          <div class="lesson-card__chips">
            <div>
              <span>Skills taught</span>
              <ul>
                <li v-for="skillId in lesson.skillIds" :key="skillId">{{ getSkill(skillId)?.title }}</li>
              </ul>
            </div>
            <div>
              <span>Prerequisites</span>
              <ul>
                <li v-if="lesson.prerequisiteSkillIds.length === 0">None</li>
                <li v-for="skillId in lesson.prerequisiteSkillIds" :key="skillId">{{ getSkill(skillId)?.title }}</li>
              </ul>
            </div>
          </div>

          <section v-for="section in lesson.sections" :key="section.id" class="lesson-section">
            <h2>{{ section.title }}</h2>
            <p v-for="paragraph in section.body" :key="paragraph">{{ paragraph }}</p>
            <div v-if="section.checkpoint" class="lesson-section__checkpoint">
              <span>Checkpoint</span>
              <p>{{ section.checkpoint }}</p>
            </div>
          </section>

          <section v-if="lesson.workedExamples.length > 0" class="lesson-examples">
            <h2>Worked examples</h2>
            <article v-for="example in lesson.workedExamples" :key="example.id">
              <h3>{{ example.prompt }}</h3>
              <ol>
                <li v-for="step in example.steps" :key="step">{{ step }}</li>
              </ol>
            </article>
          </section>
        </template>

        <footer class="lesson-card__footer">
          <RouterLink
            v-if="isLessonUnlocked(lesson.id)"
            class="lesson-card__button lesson-card__button--primary"
            :to="`/practice/${lesson.id}`"
          >
            Open lesson check
          </RouterLink>
          <RouterLink
            v-if="nextLessonRoute"
            class="lesson-card__button lesson-card__button--secondary"
            :to="nextLessonRoute"
          >
            Open recommended lesson
          </RouterLink>
        </footer>
      </article>
    </section>

    <details class="lesson-navigator">
      <summary>Browse lesson graph</summary>
      <LessonSidebar :current-lesson-id="lesson.id" />
    </details>
  </main>
</template>

<style scoped>
.lesson-layout {
  display: grid;
  max-width: 900px;
  margin: 0 auto;
  gap: 1rem;
}

.lesson-main {
  min-width: 0;
}

.lesson-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.45rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 1.25rem;
}

.lesson-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

.lesson-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
  color: var(--color-accent);
  font-weight: 800;
  margin-bottom: 0.4rem;
}

.lesson-card h1,
.lesson-section h2,
.lesson-examples h2 {
  color: var(--color-heading);
  font-weight: 800;
}

.lesson-card h1 {
  font-size: clamp(1.8rem, 4vw, 2.65rem);
  line-height: 1.08;
  letter-spacing: -0.035em;
}

.lesson-card__duration {
  white-space: nowrap;
  background: var(--color-surface-strong);
  padding: 0.5rem 0.75rem;
  border-radius: 0.35rem;
  color: var(--color-heading);
  font-weight: 800;
}

.lesson-card__summary,
.lesson-section p,
.lesson-examples li,
.lesson-card__blocked p {
  color: var(--color-text-soft);
}

.lesson-card__objective,
.lesson-card__chips,
.lesson-card__blocked,
.lesson-examples article {
  background: var(--color-surface-subtle);
  border: 1px solid var(--color-border);
  border-radius: 0.35rem;
  padding: 1rem 1.1rem;
  display: grid;
  gap: 0.5rem;
}

.lesson-card__chips {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.lesson-card__chips span,
.lesson-card__objective span,
.lesson-section__checkpoint span,
.lesson-card__blocked span {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
}

.lesson-card__objective strong {
  color: var(--color-heading);
  font-weight: 650;
}

.lesson-card__chips ul,
.lesson-card__blocked ul,
.lesson-examples ol {
  padding-left: 1rem;
}

.lesson-section,
.lesson-examples {
  display: grid;
  gap: 0.8rem;
}

.lesson-section__checkpoint {
  background: #f5f8ff;
  border: 1px solid var(--color-border);
  border-radius: 0.35rem;
  padding: 1rem;
  display: grid;
  gap: 0.35rem;
}

.lesson-card__footer {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
}

.lesson-card__button {
  text-decoration: none;
  min-height: 2.85rem;
  padding: 0.75rem 1rem;
  border-radius: 0.35rem;
  font-weight: 800;
}

.lesson-card__button--primary {
  background: var(--color-accent);
  color: white;
}

.lesson-card__button--secondary {
  background: var(--color-surface-strong);
  color: var(--color-heading);
}

.lesson-navigator {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.45rem;
}

.lesson-navigator summary {
  min-height: 3rem;
  padding: 0.85rem 1rem;
  color: var(--color-heading);
  cursor: pointer;
  font-weight: 800;
}

.lesson-navigator[open] summary {
  border-bottom: 1px solid var(--color-border);
}

@media (max-width: 1240px) {
  .lesson-card__chips {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .lesson-card {
    padding: 1.1rem;
  }

  .lesson-card__header {
    display: grid;
  }
}
</style>
