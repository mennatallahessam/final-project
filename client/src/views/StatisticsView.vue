<script setup lang="ts">
import { computed } from 'vue'
import { useActivitiesStore, formatDistance, formatDuration, formatPace, sumStat, type Activity } from '@/stores/activities'

const store = useActivitiesStore()

interface StatGroup {
  title: string
  icon: string
  color: string
  list: Activity[]
}

const groups = computed<StatGroup[]>(() => [
  { title: 'Today',     icon: 'fa-sun',      color: 'is-warning', list: store.todayActivities },
  { title: 'This Week', icon: 'fa-calendar-week', color: 'is-info',    list: store.thisWeekActivities },
  { title: 'All Time',  icon: 'fa-trophy',   color: 'is-success', list: store.allTimeActivities }
])

function getSummary(list: Activity[]) {
  const totalDistance = sumStat(list, 'distance')
  const totalDuration = sumStat(list, 'duration')
  const totalCalories = sumStat(list, 'calories')
  return {
    distance: formatDistance(totalDistance),
    duration: formatDuration(totalDuration),
    pace:     formatPace(totalDistance, totalDuration),
    calories: totalCalories,
    count:    list.length
  }
}
</script>

<template>
  <div class="box">
    <h1 class="title">
      <span class="icon-text">
        <span class="icon"><i class="fas fa-chart-bar"></i></span>
        <span>Statistics</span>
      </span>
    </h1>
    <p class="subtitle">Your activity summary by time period</p>

    <div v-if="store.allTimeActivities.length === 0" class="notification is-light mt-4">
      No activities logged yet. Head to <strong>Activities</strong> to add your first workout!
    </div>

    <div v-else class="stats-grid mt-4">
      <div
        v-for="group in groups"
        :key="group.title"
        class="stat-card box"
        :class="group.color + '-border'"
      >
        <!-- Header -->
        <div class="stat-card-header mb-4">
          <span class="icon is-medium" :class="'has-text-' + group.color.replace('is-', '')">
            <i :class="'fas ' + group.icon + ' fa-lg'"></i>
          </span>
          <h2 class="title is-4 ml-2">{{ group.title }}</h2>
          <span class="tag ml-auto" :class="group.color">
            {{ getSummary(group.list).count }} workout{{ getSummary(group.list).count !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- No data state -->
        <div v-if="group.list.length === 0" class="has-text-grey has-text-centered py-4">
          <i class="fas fa-dumbbell fa-2x mb-2"></i>
          <p>No activities yet</p>
        </div>

        <!-- Stats grid -->
        <div v-else class="columns is-multiline">
          <div class="column is-half stat-item">
            <p class="stat-value has-text-primary">{{ getSummary(group.list).distance }}</p>
            <p class="stat-label">Total Distance</p>
          </div>
          <div class="column is-half stat-item">
            <p class="stat-value has-text-info">{{ getSummary(group.list).duration }}</p>
            <p class="stat-label">Total Duration</p>
          </div>
          <div class="column is-half stat-item">
            <p class="stat-value has-text-success">{{ getSummary(group.list).pace }}</p>
            <p class="stat-label">Avg Pace</p>
          </div>
          <div class="column is-half stat-item">
            <p class="stat-value has-text-warning">{{ getSummary(group.list).calories }}</p>
            <p class="stat-label">Calories Burned</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.is-warning-border { border-top: 4px solid #ffdd57; }
.is-info-border    { border-top: 4px solid #3e8ed0; }
.is-success-border { border-top: 4px solid #48c774; }

.stat-card-header {
  display: flex;
  align-items: center;
}

.stat-item {
  text-align: center;
  padding: 0.75rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #7a7a7a;
  margin-top: 0.25rem;
}

.py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.ml-auto { margin-left: auto; }
</style>
