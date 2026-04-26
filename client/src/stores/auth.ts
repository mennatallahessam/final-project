import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type User } from './users'
import { apiFetch, setToken, removeToken, type ApiResponse } from '../api/session'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  async function login(username: string, password?: string) {
    try {
      const response = await apiFetch<ApiResponse<{ user: User }>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })

      if (response.token) {
        setToken(response.token)
        token.value = response.token
        currentUser.value = response.data?.user || null
        return { success: true, message: 'Login successful' }
      }
      return { success: false, message: 'Invalid response from server' }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }

  async function register(username: string, email: string, fullName: string, password?: string) {
    try {
      const response = await apiFetch<ApiResponse<{ user: User }>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, fullName, password, role: 'user' })
      })

      if (response.token) {
        setToken(response.token)
        token.value = response.token
        currentUser.value = response.data?.user || null
        return { success: true, message: 'Account created successfully' }
      }
      return { success: false, message: 'Registration failed' }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }

  function logout() {
    removeToken()
    token.value = null
    currentUser.value = null
  }

  /** Initialize user from token if available */
  async function init() {
    if (token.value) {
      try {
        const response = await apiFetch<ApiResponse<User>>('/users/me')
        currentUser.value = response.data || null
      } catch (error) {
        logout()
      }
    }
  }

  return {
    currentUser,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    init
  }
})
