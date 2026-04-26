<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useActivitiesStore } from '@/stores/activities'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

onMounted(() => {
  activitiesStore.fetchMyActivities()
})

const userActivities = computed(() => {
  return activitiesStore.activities
})

const totalActivities = computed(() => userActivities.value.length)
const totalDuration = computed(() => userActivities.value.reduce((sum, act) => sum + act.duration, 0))
const totalCalories = computed(() => userActivities.value.reduce((sum, act) => sum + act.calories, 0))
const totalDistance = computed(() => userActivities.value.reduce((sum, act) => sum + (act.distance || 0), 0))
</script>

<template>
  <div class="box">
    <h1 class="title">Dashboard</h1>
    <p class="subtitle">Welcome back, {{ authStore.currentUser?.fullName }}!</p>

    <div class="level is-mobile mt-6">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Total Activities</p>
          <p class="title has-text-primary">{{ totalActivities }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Total Duration</p>
          <p class="title has-text-info">{{ totalDuration }} <span class="is-size-5 has-text-weight-normal">min</span></p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Total Distance</p>
          <p class="title has-text-success">{{ totalDistance }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Calories Burned</p>
          <p class="title has-text-warning">{{ totalCalories }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
