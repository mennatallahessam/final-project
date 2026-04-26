import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { apiFetch, type ApiResponse } from '../api/session'

export interface Activity {
  _id: string
  userId: string | any
  exerciseTypeId: string | any
  type?: string // Legacy or display name
  duration: number // in minutes
  distance: number // in km
  date: string
  calories: number
  notes?: string
}

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<Activity[]>([])
  const loading = ref(false)

  // ── Time-filtered getters (Extra Credit Statistics) ──────────────────────
  const todayActivities = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return []
    const todayStr = new Date().toISOString().split('T')[0] || ''
    return activities.value.filter(
      a => a.date.startsWith(todayStr)
    )
  })

  // ... (Other computed stays similar but filtered by date/user if not already filtered by API)
  
  const thisWeekActivities = computed(() => {
    const sevenDaysAgo = new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0] || ''
    return activities.value.filter(
      a => a.date >= sevenDaysAgo
    )
  })

  const allTimeActivities = computed(() => {
    return activities.value
  })

  async function fetchMyActivities() {
    loading.value = true
    try {
      const response = await apiFetch<ApiResponse<Activity[]>>('/activities/me')
      activities.value = response.data || []
    } finally {
      loading.value = false
    }
  }

  async function fetchUserActivities(userId: string) {
    const response = await apiFetch<ApiResponse<Activity[]>>(`/activities/user/${userId}`)
    return response.data || []
  }

  async function addActivity(activity: Omit<Activity, '_id'>) {
    const response = await apiFetch<ApiResponse<Activity>>('/activities', {
      method: 'POST',
      body: JSON.stringify(activity)
    })
    if (response.data) {
      activities.value.push(response.data)
    }
  }

  async function updateActivity(id: string, updates: Partial<Activity>) {
    const response = await apiFetch<ApiResponse<Activity>>(`/activities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
    const index = activities.value.findIndex(a => a._id === id)
    if (index !== -1 && response.data) {
      activities.value[index] = response.data
    }
  }

  async function deleteActivity(id: string) {
    await apiFetch(`/activities/${id}`, { method: 'DELETE' })
    activities.value = activities.value.filter(a => a._id !== id)
  }

  return {
    activities,
    loading,
    todayActivities,
    thisWeekActivities,
    allTimeActivities,
    fetchMyActivities,
    fetchUserActivities,
    addActivity,
    updateActivity,
    deleteActivity
  }
})

// ── Formatting helpers (used in StatisticsView) ───────────────────────────

/** Format distance: show in km with 1 decimal */
export function formatDistance(km: number): string {
  if (km === 0) return '0 km'
  return km.toFixed(1) + ' km'
}

/** Format duration in MM:SS or HH:MM */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m} min`
}

/** Average pace in km per hour */
export function formatPace(totalDistance: number, totalDuration: number): string {
  if (totalDuration === 0) return '0 km/h'
  const kmh = totalDistance / (totalDuration / 60)
  return kmh.toFixed(1) + ' km/h'
}

/** Sum up a stat field across activities */
export function sumStat(list: Activity[], field: keyof Activity): number {
  return list.reduce((acc, a) => acc + ((a[field] as number) || 0), 0)
}

