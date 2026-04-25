<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getLesson, lessonGraphNodes } from '../content'
import { useLearningProgress } from '../lib/progress'

const props = defineProps<{
  currentLessonId: string
}>()

const { getLessonState } = useLearningProgress()
const orderedLessons = computed(() =>
  [...lessonGraphNodes]
    .sort((left, right) => left.level - right.level || left.order - right.order)
    .map((node) => getLesson(node.lessonId))
    .filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== undefined),
)
</script>

<template>
  <aside class="lesson-sidebar">
    <div class="lesson-sidebar__intro">
      <p class="lesson-sidebar__eyebrow">Lesson graph</p>
      <h2>All lesson nodes</h2>
      <p>Jump to any unlocked lesson or use the graph to choose target nodes.</p>
    </div>

    <component
      :is="getLessonState(lesson.id) === 'locked' ? 'div' : RouterLink"
      v-for="lesson in orderedLessons"
      :key="lesson.id"
      class="lesson-sidebar__lesson"
      :class="{
        'lesson-sidebar__lesson--active': currentLessonId === lesson.id,
        'lesson-sidebar__lesson--done': getLessonState(lesson.id) === 'mastered',
        'lesson-sidebar__lesson--locked': getLessonState(lesson.id) === 'locked',
      }"
      :to="getLessonState(lesson.id) === 'locked' ? undefined : `/learn/${lesson.id}`"
    >
      <span>{{ lesson.title }}</span>
      <small>{{ lesson.estimatedMinutes }} min</small>
    </component>
  </aside>
</template>

<style scoped>
.lesson-sidebar {
  background: var(--color-surface);
  padding: 1rem;
  display: grid;
  gap: 1rem;
  align-self: start;
  box-shadow: var(--shadow-soft);
}

.lesson-sidebar__intro {
  display: grid;
  gap: 0.55rem;
}

.lesson-sidebar__eyebrow {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  font-weight: 800;
}

.lesson-sidebar h2,
.lesson-sidebar h3 {
  color: var(--color-heading);
  font-weight: 800;
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
  min-height: 2.85rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 0.35rem;
  background: white;
}

.lesson-sidebar__lesson--active {
  border-color: rgba(20, 120, 201, 0.42);
  background: #f7fbff;
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
