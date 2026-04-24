<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getCourse, getCourseModules, getLessonModule, getModuleLessons, primaryCourse } from '../content'
import { useLearningProgress } from '../lib/progress'

const props = defineProps<{
  currentLessonId: string
}>()

const { getLessonState } = useLearningProgress()
const currentCourse = computed(() => {
  const module = getLessonModule(props.currentLessonId)
  return module ? getCourse(module.courseId) : primaryCourse
})
const modules = computed(() => (currentCourse.value ? getCourseModules(currentCourse.value.id) : []))
</script>

<template>
  <aside class="lesson-sidebar">
    <div class="lesson-sidebar__intro">
      <p class="lesson-sidebar__eyebrow">Skill graph</p>
      <h2>{{ currentCourse?.title }}</h2>
      <p>{{ currentCourse?.tagline }}</p>
    </div>

    <div v-for="module in modules" :key="module.id" class="lesson-sidebar__module">
      <p class="lesson-sidebar__module-badge">{{ module.badge }}</p>
      <h3>{{ module.title }}</h3>

      <component
        :is="getLessonState(lesson.id) === 'locked' ? 'div' : RouterLink"
        v-for="lesson in getModuleLessons(module.id)"
        :key="lesson.id"
        class="lesson-sidebar__lesson"
        :class="{
          'lesson-sidebar__lesson--active': currentLessonId === lesson.id,
          'lesson-sidebar__lesson--done': getLessonState(lesson.id) === 'mastered',
          'lesson-sidebar__lesson--locked': getLessonState(lesson.id) === 'locked',
        }"
        :to="getLessonState(lesson.id) === 'locked' ? undefined : `/learn/${module.id}/${lesson.id}`"
      >
        <span>{{ lesson.title }}</span>
        <small>{{ lesson.estimatedMinutes }} min</small>
      </component>
    </div>
  </aside>
</template>

<style scoped>
.lesson-sidebar {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  padding: 1.2rem;
  display: grid;
  gap: 1.25rem;
  align-self: start;
  position: sticky;
  top: 1.5rem;
  box-shadow: var(--shadow-soft);
}

.lesson-sidebar__intro,
.lesson-sidebar__module {
  display: grid;
  gap: 0.55rem;
}

.lesson-sidebar__eyebrow,
.lesson-sidebar__module-badge {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-accent);
  font-weight: 700;
}

.lesson-sidebar h2,
.lesson-sidebar h3 {
  color: var(--color-heading);
  font-weight: 650;
}

.lesson-sidebar p {
  color: var(--color-text-soft);
}

.lesson-sidebar__lesson {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-soft);
  padding: 0.8rem 0.9rem;
  border-radius: 1rem;
  background: var(--color-surface-subtle);
}

.lesson-sidebar__lesson--active {
  background: var(--color-surface-strong);
  color: var(--color-heading);
}

.lesson-sidebar__lesson--done span::after {
  content: ' Mastered';
  color: var(--color-accent);
  font-size: 0.8rem;
  margin-left: 0.4rem;
}

.lesson-sidebar__lesson--locked {
  opacity: 0.55;
}

.lesson-sidebar__lesson small {
  white-space: nowrap;
}

@media (max-width: 980px) {
  .lesson-sidebar {
    position: static;
  }
}
</style>
