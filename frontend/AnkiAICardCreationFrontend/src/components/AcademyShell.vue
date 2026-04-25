<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="academy-shell">
    <section class="academy-shell__hero" aria-labelledby="page-title">
      <p v-if="eyebrow" class="academy-shell__eyebrow">{{ eyebrow }}</p>
      <h1 id="page-title">{{ title }}</h1>
      <p class="academy-shell__subtitle">{{ subtitle }}</p>
    </section>

    <slot />
  </div>
</template>

<style scoped>
.academy-shell {
  display: grid;
  gap: 1.4rem;
}

.academy-shell__hero {
  display: grid;
  gap: 0.4rem;
  max-width: 52rem;
}

.academy-shell__hero h1 {
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  line-height: 1.08;
  letter-spacing: -0.035em;
  font-weight: 800;
  color: var(--color-heading);
}

.academy-shell__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  color: var(--color-accent);
  font-weight: 800;
}

.academy-shell__subtitle {
  font-size: 0.98rem;
  color: var(--color-text-soft);
  max-width: 40rem;
}
</style>
