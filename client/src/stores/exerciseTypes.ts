import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiFetch, type ApiResponse } from '../api/session'

export interface ExerciseType {
  id: string
  name: string
  default_calories_per_minute: number
}

export const useExerciseTypeStore = defineStore('exerciseTypes', () => {
  const exerciseTypes = ref<ExerciseType[]>([])
  const loading = ref(false)

  async function fetchAllExerciseTypes() {
    loading.value = true
    try {
      const response = await apiFetch<ApiResponse<ExerciseType[]>>('/exercise-types')
      exerciseTypes.value = response.data || []
    } finally {
      loading.value = false
    }
  }

  return { exerciseTypes, loading, fetchAllExerciseTypes }
})
