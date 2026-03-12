import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface Activity {
  id: number
  userId: number
  type: string
  duration: number // in minutes
  distance: number // in km
  date: string
  calories: number
  notes?: string
}

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<Activity[]>([
    {
      id: 1,
      userId: 2, // John Doe
      type: 'Running',
      duration: 30,
      distance: 5,
      date: new Date().toISOString().split('T')[0] as string, // Today
      calories: 350
    },
    {
      id: 2,
      userId: 2,
      type: 'Cycling',
      duration: 45,
      distance: 15,
      date: new Date().toISOString().split('T')[0] as string, // Today
      calories: 400
    },
    {
      id: 3,
      userId: 3, // Jane Smith
      type: 'Yoga',
      duration: 60,
      distance: 0,
      date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] as string, // 3 days ago
      calories: 200
    },
    {
      id: 4,
      userId: 2,
      type: 'Walking',
      duration: 40,
      distance: 3,
      date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] as string, // 5 days ago
      calories: 180
    }
  ])

  // ── Time-filtered getters (Extra Credit Statistics) ──────────────────────
  const todayActivities = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return []
    const todayStr = new Date().toISOString().split('T')[0]
    return activities.value.filter(
      a => a.userId === authStore.currentUser!.id && a.date === todayStr
    )
  })

  const thisWeekActivities = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return []
    const sevenDaysAgo = new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0] ?? ''
    return activities.value.filter(
      a => a.userId === authStore.currentUser!.id && a.date >= sevenDaysAgo
    )
  })

  const allTimeActivities = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return []
    return activities.value.filter(a => a.userId === authStore.currentUser!.id)
  })

  // ── CRUD ──────────────────────────────────────────────────────────────────
  function getActivitiesByUser(userId: number) {
    return activities.value.filter(a => a.userId === userId)
  }

  function addActivity(activity: Omit<Activity, 'id'>) {
    const newId = Math.max(...activities.value.map(a => a.id), 0) + 1
    activities.value.push({ ...activity, id: newId })
  }

  function updateActivity(id: number, updates: Partial<Activity>) {
    const index = activities.value.findIndex(a => a.id === id)
    if (index !== -1) {
      activities.value[index] = { ...activities.value[index], ...updates } as Activity
    }
  }

  function deleteActivity(id: number) {
    activities.value = activities.value.filter(a => a.id !== id)
  }

  return {
    activities,
    todayActivities,
    thisWeekActivities,
    allTimeActivities,
    getActivitiesByUser,
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

