<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import DialogBoxes from './components/DialogBoxes.vue'
</script>

<template>
  <NavBar />
  <main class="section">
    <div class="container">
      <RouterView />
    </div>
  </main>
  <DialogBoxes />
</template>

<style scoped></style>
