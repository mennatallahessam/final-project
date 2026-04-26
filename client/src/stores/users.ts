import { ref } from 'vue'
import { defineStore } from 'pinia'
import { apiFetch, type ApiResponse } from '../api/session'

export type Role = 'admin' | 'user' | 'trainer'

export interface User 
{
  _id: string
  username: string
  email: string
  fullName: string
  password?: string
  role: Role
  friends: string[] // array of user IDs
  avatar: string
}

export const useUsersStore = defineStore('users', () => 
  {
  const users = ref<User[]>([])
  const loading = ref(false)

  async function fetchAllUsers() {
    loading.value = true
    try {
      const response = await apiFetch<ApiResponse<User[]>>('/users')
      users.value = response.data || []
    } finally {
      loading.value = false
    }
  }

  async function getUserById(id: string) {
    const response = await apiFetch<ApiResponse<User>>(`/users/${id}`)
    return response.data
  }

  async function addUser(user: Omit<User, '_id'>) {
    const response = await apiFetch<ApiResponse<User>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(user)
    })
    if (response.data) {
      users.value.push(response.data)
    }
    return response.data?._id
  }

  async function updateUser(id: string, updates: Partial<User>) {
    const response = await apiFetch<ApiResponse<User>>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    })
    const index = users.value.findIndex(u => u._id === id)
    if (index !== -1 && response.data) {
      users.value[index] = response.data
    }
  }

  async function deleteUser(id: string) {
    await apiFetch(`/users/${id}`, { method: 'DELETE' })
    users.value = users.value.filter(u => u._id !== id)
  }

  async function addFriend(friendId: string) {
    await apiFetch('/users/friends', {
      method: 'POST',
      body: JSON.stringify({ friendId })
    })
  }

  async function removeFriend(friendId: string) {
    await apiFetch(`/users/friends/${friendId}`, { method: 'DELETE' })
  }

  return { users, loading, fetchAllUsers, getUserById, addUser, updateUser, deleteUser, addFriend, removeFriend }
})
