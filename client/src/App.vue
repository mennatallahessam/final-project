<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <main class="section">
    <div class="container">
      <RouterView />
    </div>
  </main>
</template>

<style scoped></style>
