import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Activity {
  id: number
  userId: number
  type: string
  duration: number // in minutes
  distance: number // in km or miles, optional
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
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0] as string, // Yesterday
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
      date: new Date().toISOString().split('T')[0] as string,
      calories: 200
    }
  ])

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
    getActivitiesByUser,
    addActivity,
    updateActivity,
    deleteActivity
  }
})
