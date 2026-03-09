import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  username: string
  email: string
  fullName: string
  password: string
  role: 'admin' | 'user' | 'trainer'
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const users = ref<User[]>([
    {
      id: 1,
      username: 'admin',
      email: 'admin@fitness.com',
      fullName: 'Admin User',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: 2,
      username: 'john',
      email: 'john@fitness.com',
      fullName: 'John Doe',
      password: 'john123',
      role: 'user'
    },
    {
      id: 3,
      username: 'jane',
      email: 'jane@fitness.com',
      fullName: 'Jane Smith',
      password: 'jane123',
      role: 'trainer'
    }
  ])

  const isLoggedIn = computed(() => currentUser.value !== null)

  const login = (username: string, password: string) => {
    const user = users.value.find(u => u.username === username && u.password === password)
    if (user) {
      currentUser.value = user
      return { success: true, message: 'Login successful' }
    }
    return { success: false, message: 'Invalid username or password' }
  }

  const register = (username: string, email: string, fullName: string, password: string) => {
    if (!username || !email || !fullName || !password) {
      return { success: false, message: 'All fields are required' }
    }
    if (username.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters' }
    }
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' }
    }
    if (users.value.some(u => u.username === username)) {
      return { success: false, message: 'Username already exists' }
    }
    if (users.value.some(u => u.email === email)) {
      return { success: false, message: 'Email already exists' }
    }

    const newUser: User = {
      id: Math.max(...users.value.map(u => u.id), 0) + 1,
      username,
      email,
      fullName,
      password,
      role: 'user'
    }
    users.value.push(newUser)
    currentUser.value = newUser
    return { success: true, message: 'Account created successfully' }
  }

  const logout = () => {
    currentUser.value = null
  }

  return {
    currentUser,
    users,
    isLoggedIn,
    login,
    register,
    logout
  }
})
