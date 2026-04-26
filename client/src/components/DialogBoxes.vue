<script setup lang="ts">
import { dialogState } from '@/composables/useDialog'

function handleResponse(value: boolean) {
  dialogState.isOpen = false
  dialogState.resolve(value)
}
</script>

<template>
  <div :class="['modal', { 'is-active': dialogState.isOpen }]">
    <div class="modal-background" @click="handleResponse(false)"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ dialogState.title }}</p>
        <button class="delete" aria-label="close" @click="handleResponse(false)"></button>
      </header>
      <section class="modal-card-body">
        <p>{{ dialogState.message }}</p>
      </section>
      <footer class="modal-card-foot" style="justify-content: flex-end;">
        <button class="button is-danger" @click="handleResponse(true)">Yes</button>
        <button class="button ml-2" @click="handleResponse(false)">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-card {
  max-width: 420px;
  border-radius: 8px;
}
.ml-2 {
  margin-left: 0.5rem;
}
</style>
