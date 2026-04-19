<script setup lang="ts">
import NeuralBackground from './components/NeuralBackground.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <NeuralBackground />
  <div class="app-shell">
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  z-index: 1;
}
</style>
