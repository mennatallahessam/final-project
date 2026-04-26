import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiFetch, type ApiResponse } from '../api/session'

export interface ExerciseType {
  _id: string
  name: string
  category: 'Cardio' | 'Strength' | 'Flexibility' | 'Balance' | 'Sport' | 'Other'
  defaultCaloriesPerMinute: number
}

export const useExerciseTypeStore = defineStore('exerciseTypes', () => {
  const exerciseTypes = ref<ExerciseType[]>([])
  const loading = ref(false)

  async function fetchAllExerciseTypes() {
    loading.value = true
    try {
      const response = await apiFetch<ApiResponse<ExerciseType[]>>('/exerciseTypes')
      exerciseTypes.value = response.data || []
    } finally {
      loading.value = false
    }
  }

  async function addExerciseType(type: Omit<ExerciseType, '_id'>) {
    const response = await apiFetch<ApiResponse<ExerciseType>>('/exerciseTypes', {
      method: 'POST',
      body: JSON.stringify(type)
    })
    if (response.data) {
      exerciseTypes.value.push(response.data)
    }
  }

  async function updateExerciseType(id: string, updates: Partial<ExerciseType>) {
    const response = await apiFetch<ApiResponse<ExerciseType>>(`/exerciseTypes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
    const index = exerciseTypes.value.findIndex(t => t._id === id)
    if (index !== -1 && response.data) {
      exerciseTypes.value[index] = response.data
    }
  }

  async function deleteExerciseType(id: string) {
    await apiFetch(`/exerciseTypes/${id}`, { method: 'DELETE' })
    exerciseTypes.value = exerciseTypes.value.filter(t => t._id !== id)
  }

  return { exerciseTypes, loading, fetchAllExerciseTypes, addExerciseType, updateExerciseType, deleteExerciseType }
})
