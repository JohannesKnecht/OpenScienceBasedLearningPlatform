<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  eyebrow?: string
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="academy-shell">
    <header class="academy-shell__header">
      <RouterLink class="academy-shell__brand" to="/">Open Mastery Graph</RouterLink>
      <nav class="academy-shell__nav">
        <RouterLink to="/learn">Learn</RouterLink>
        <RouterLink to="/graph">Graph</RouterLink>
      </nav>
    </header>

    <section class="academy-shell__hero">
      <p v-if="eyebrow" class="academy-shell__eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p class="academy-shell__subtitle">{{ subtitle }}</p>
    </section>

    <slot />
  </div>
</template>

<style scoped>
.academy-shell {
  display: grid;
  gap: 2rem;
}

.academy-shell__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.academy-shell__brand {
  color: var(--color-heading);
  text-decoration: none;
  font-weight: 750;
  letter-spacing: -0.04em;
}

.academy-shell__nav {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.academy-shell__nav a {
  color: var(--color-text-soft);
  text-decoration: none;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
}

.academy-shell__nav a.router-link-active {
  background: var(--color-surface-strong);
  color: var(--color-heading);
}

.academy-shell__hero {
  display: grid;
  gap: 0.6rem;
  max-width: 48rem;
}

.academy-shell__hero h1 {
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.02;
  letter-spacing: -0.05em;
  font-weight: 740;
  color: var(--color-heading);
}

.academy-shell__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  color: var(--color-accent);
  font-weight: 700;
}

.academy-shell__subtitle {
  font-size: 0.98rem;
  color: var(--color-text-soft);
  max-width: 40rem;
}

@media (max-width: 720px) {
  .academy-shell__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
