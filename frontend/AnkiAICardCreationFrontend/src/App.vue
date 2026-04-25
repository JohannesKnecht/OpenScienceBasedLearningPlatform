<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="app-shell" :class="{ 'app-shell--fullscreen': route.name === 'graph' }">
    <header class="app-header">
      <RouterLink class="app-identity" to="/" aria-label="OpenScienceBasedLearningPlatform home">
        <span class="app-identity__mark">OS</span>
        <span>OpenScienceBasedLearningPlatform</span>
      </RouterLink>

      <nav class="app-nav" aria-label="Primary navigation">
        <RouterLink to="/learn">Learn</RouterLink>
        <RouterLink to="/graph">Graph</RouterLink>
      </nav>
    </header>

    <RouterView />
  </main>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.4rem;
}

.app-identity {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: var(--color-heading);
  text-decoration: none;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.app-identity__mark {
  display: inline-grid;
  place-items: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.7rem 0.25rem 0.7rem 0.25rem;
  color: white;
  background: var(--color-accent);
  font-weight: 800;
}

.app-shell {
  position: relative;
  width: min(100%, 1280px);
  margin: 0 auto;
  padding: 1.35rem 1.25rem 3rem;
}

.app-shell--fullscreen {
  width: 100%;
  max-width: none;
  padding: 0;
}

.app-shell--fullscreen .app-header {
  position: fixed;
  top: 1rem;
  right: 1rem;
  left: 1rem;
  z-index: 40;
  margin: 0;
  pointer-events: none;
}

.app-shell--fullscreen .app-identity,
.app-shell--fullscreen .app-nav {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
}

.app-shell--fullscreen .app-identity {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.35rem 0.85rem 0.35rem 0.35rem;
}

.app-nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.35rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
}

.app-nav a {
  display: inline-flex;
  min-height: 2.55rem;
  align-items: center;
  justify-content: center;
  color: var(--color-text-soft);
  text-decoration: none;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-weight: 800;
}

.app-nav a.router-link-active {
  color: white;
  background: var(--color-heading);
}

@media (max-width: 720px) {
  .app-header {
    align-items: flex-start;
  }

  .app-identity span:last-child {
    display: none;
  }

  .app-shell {
    padding: 1rem 0.9rem 2rem;
  }
}
</style>
