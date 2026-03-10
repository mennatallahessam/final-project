import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUsersStore, type User } from './users'

export const useAuthStore = defineStore('auth', () => {
  const usersStore = useUsersStore()
  const currentUser = ref<User | null>(null)

  const isLoggedIn = computed(() => currentUser.value !== null)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  const login = (username: string, password?: string) => {
    const user = usersStore.users.find(u => u.username === username && u.password === password)
    if (user) {
      currentUser.value = user
      return { success: true, message: 'Login successful' }
    }
    return { success: false, message: 'Invalid username or password' }
  }

  const register = (username: string, email: string, fullName: string, password?: string) => {
    if (!username || !email || !fullName || !password) {
      return { success: false, message: 'All fields are required' }
    }
    if (username.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters' }
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' }
    }
    if (usersStore.users.some(u => u.username === username)) {
      return { success: false, message: 'Username already exists' }
    }
    if (usersStore.users.some(u => u.email === email)) {
      return { success: false, message: 'Email already exists' }
    }

    const newUserBase = {
      username,
      email,
      fullName,
      password,
      role: 'user' as const,
      friends: [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
    }
    
    const newId = usersStore.addUser(newUserBase)
    const newUser = usersStore.getUserById(newId)
    if (newUser) {
      currentUser.value = newUser
    }
    return { success: true, message: 'Account created successfully' }
  }

  const logout = () => {
    currentUser.value = null
  }

  return {
    currentUser,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout
  }
})
