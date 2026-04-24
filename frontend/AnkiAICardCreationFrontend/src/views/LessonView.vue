<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import LessonSidebar from '../components/LessonSidebar.vue'
import ProgressPanel from '../components/ProgressPanel.vue'
import { getLesson, getLessonPrerequisites, getNextLesson, getSkill, getLessonModule } from '../content'
import { useLearningProgress } from '../lib/progress'

const route = useRoute()
const router = useRouter()
const { touchLesson, isLessonUnlocked, isSkillMastered } = useLearningProgress()

const lessonId = computed(() => route.params.lessonSlug as string)
const lesson = computed(() => getLesson(lessonId.value))
const module = computed(() => getLessonModule(lessonId.value))
const nextLesson = computed(() => (module.value && lesson.value ? getNextLesson(module.value.courseId, lesson.value.id) : undefined))
const missingPrerequisites = computed(() =>
  getLessonPrerequisites(lessonId.value).filter((skill) => !isSkillMastered(skill.id)),
)

watchEffect(() => {
  if (!lesson.value || !module.value) {
    router.replace('/learn')
    return
  }

  touchLesson(lesson.value.id)
})
</script>

<template>
  <main v-if="lesson && module" class="lesson-layout">
    <LessonSidebar :current-lesson-id="lesson.id" />

    <section class="lesson-main">
      <article class="lesson-card">
        <div class="lesson-card__header">
          <div>
            <p class="lesson-card__eyebrow">{{ module.badge }}</p>
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
            :to="`/practice/${module.id}/${lesson.id}`"
          >
            Open lesson check
          </RouterLink>
          <RouterLink
            v-if="nextLesson"
            class="lesson-card__button lesson-card__button--secondary"
            :to="`/learn/${nextLesson.moduleId}/${nextLesson.id}`"
          >
            Peek next lesson
          </RouterLink>
        </footer>
      </article>
    </section>

    <ProgressPanel />
  </main>
</template>

<style scoped>
.lesson-layout {
  display: grid;
  grid-template-columns: minmax(17rem, 0.9fr) minmax(0, 1.5fr) minmax(18rem, 0.85fr);
  gap: 1rem;
  align-items: start;
}

.lesson-main {
  min-width: 0;
}

.lesson-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.75rem;
  padding: 1.7rem;
  box-shadow: var(--shadow-soft);
  display: grid;
  gap: 1.4rem;
}

.lesson-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

.lesson-card__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.76rem;
  color: var(--color-accent);
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.lesson-card h1,
.lesson-section h2,
.lesson-examples h2 {
  color: var(--color-heading);
  font-weight: 680;
}

.lesson-card h1 {
  font-size: clamp(1.7rem, 4vw, 2.7rem);
  line-height: 1.05;
}

.lesson-card__duration {
  white-space: nowrap;
  background: var(--color-surface-strong);
  padding: 0.6rem 0.85rem;
  border-radius: 999px;
  color: var(--color-heading);
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
  border-radius: 1.2rem;
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
  letter-spacing: 0.16em;
  font-weight: 700;
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
  border-radius: 1.15rem;
  padding: 1rem;
  display: grid;
  gap: 0.35rem;
}

.lesson-card__footer {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.lesson-card__button {
  text-decoration: none;
  padding: 0.9rem 1.15rem;
  border-radius: 999px;
  font-weight: 600;
}

.lesson-card__button--primary {
  background: var(--color-heading);
  color: white;
}

.lesson-card__button--secondary {
  background: var(--color-surface-strong);
  color: var(--color-heading);
}

@media (max-width: 1240px) {
  .lesson-layout,
  .lesson-card__chips {
    grid-template-columns: 1fr;
  }
}
</style>
