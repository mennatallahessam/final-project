<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore, type User, type Role } from '@/stores/users'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const isModalActive = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const emptyForm = {
  username: '',
  email: '',
  fullName: '',
  password: '',
  role: 'user' as Role
}

const form = ref({ ...emptyForm })

const allUsers = computed(() => usersStore.users)

onMounted(() => {
  if (authStore.isAdmin) {
    usersStore.fetchAllUsers()
  }
})

const openAddModal = () => {
  form.value = { ...emptyForm }
  isEditing.value = false
  editingId.value = null
  isModalActive.value = true
}

const openEditModal = (user: User) => {
  form.value = { 
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    password: '',
    role: user.role
  }
  isEditing.value = true
  editingId.value = user._id
  isModalActive.value = true
}

const closeModal = () => {
  isModalActive.value = false
}

const saveUser = async () => {
  if (isEditing.value && editingId.value) {
    const updates: any = { ...form.value }
    if (!updates.password) delete updates.password
    await usersStore.updateUser(editingId.value, updates)
  } else {
    await usersStore.addUser({
      ...form.value,
      friends: [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.value.fullName)}&background=random`
    })
  }
  closeModal()
}

const deleteUser = async (id: string) => {
  if (id === authStore.currentUser?._id) {
    alert("You cannot delete yourself.")
    return
  }
  if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
    await usersStore.deleteUser(id)
  }
}
</script>

<template>
  <div v-if="!authStore.isAdmin" class="notification is-danger mt-6">
    You do not have permission to view this page.
  </div>
  
  <div v-else class="box">
    <div class="level mb-4">
      <div class="level-left">
        <div>
          <h1 class="title">Admin Panel</h1>
          <p class="subtitle">Manage users and system settings</p>
        </div>
      </div>
      <div class="level-right">
        <button class="button is-primary" @click="openAddModal">
          <span class="icon"><i class="fas fa-user-plus"></i></span>
          <span>Add User</span>
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="table is-fullwidth is-hoverable is-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in allUsers" :key="user._id">
            <td><small class="has-text-grey">{{ user._id.substring(0, 8) }}...</small></td>
            <td>
              <div class="is-flex is-align-items-center">
                <figure class="image is-32x32 mr-2">
                  <img :src="user.avatar" class="is-rounded" alt="Avatar">
                </figure>
                {{ user.fullName }}
              </div>
            </td>
            <td>@{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['tag', user.role === 'admin' ? 'is-danger' : (user.role === 'trainer' ? 'is-warning' : 'is-info')]">
                {{ user.role }}
              </span>
            </td>
            <td>
              <div class="buttons are-small">
                <button class="button is-info is-light" @click="openEditModal(user)" title="Edit">
                  <span class="icon"><i class="fas fa-edit"></i></span>
                </button>
                <button 
                  class="button is-danger is-light" 
                  @click="deleteUser(user._id)" 
                  title="Delete"
                  :disabled="user._id === authStore.currentUser?._id"
                >
                  <span class="icon"><i class="fas fa-trash"></i></span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form -->
    <div :class="['modal', { 'is-active': isModalActive }]">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ isEditing ? 'Edit User' : 'Add User' }}</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Full Name</label>
            <div class="control">
              <input class="input" type="text" v-model="form.fullName" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input class="input" type="text" v-model="form.username" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input class="input" type="email" v-model="form.email" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Password <span class="has-text-grey is-size-7" v-if="isEditing">(leave blank to keep current)</span></label>
            <div class="control">
              <input class="input" type="password" v-model="form.password" :required="!isEditing" />
            </div>
          </div>
          <div class="field">
            <label class="label">Role</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="form.role" required>
                  <option value="user">User</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="saveUser" :disabled="!form.username || !form.fullName || !form.email">Save</button>
          <button class="button" @click="closeModal">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mb-4 { margin-bottom: 1.5rem; }
.mt-6 { margin-top: 3rem; }
.mr-2 { margin-right: 0.5rem; }
</style>
