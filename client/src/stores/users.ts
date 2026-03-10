import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Role = 'admin' | 'user' | 'trainer'

export interface User {
  id: number
  username: string
  email: string
  fullName: string
  password?: string
  role: Role
  friends: number[] // array of user IDs
  avatar: string
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([
    {
      id: 1,
      username: 'admin',
      email: 'admin@fitness.com',
      fullName: 'Admin User',
      password: 'admin123',
      role: 'admin',
      friends: [2, 3],
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random'
    },
    {
      id: 2,
      username: 'john',
      email: 'john@fitness.com',
      fullName: 'John Doe',
      password: 'john123',
      role: 'user',
      friends: [1, 3],
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    },
    {
      id: 3,
      username: 'jane',
      email: 'jane@fitness.com',
      fullName: 'Jane Smith',
      password: 'jane123',
      role: 'trainer',
      friends: [1, 2],
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
    }
  ])

  function getUserById(id: number) {
    return users.value.find(u => u.id === id)
  }

  function addUser(user: Omit<User, 'id'>) {
    const newId = Math.max(...users.value.map(u => u.id), 0) + 1
    users.value.push({ ...user, id: newId })
    return newId
  }

  function updateUser(id: number, updates: Partial<User>) {
    const index = users.value.findIndex(u => u.id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates } as User
    }
  }

  function deleteUser(id: number) {
    users.value = users.value.filter(u => u.id !== id)
  }

  return { users, getUserById, addUser, updateUser, deleteUser }
})
