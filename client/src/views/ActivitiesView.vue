<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useActivitiesStore, type Activity } from '@/stores/activities'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()

const isModalActive = ref(false)
const isEditing = ref(false)

const emptyForm = {
  type: '',
  duration: 0,
  distance: 0,
  date: new Date().toISOString().split('T')[0],
  calories: 0,
  notes: ''
}

const form = ref({ ...emptyForm })
const editingId = ref<number | null>(null)

const userActivities = computed(() => {
  if (!authStore.currentUser) return []
  return activitiesStore.getActivitiesByUser(authStore.currentUser.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const openAddModal = () => {
  form.value = { ...emptyForm }
  isEditing.value = false
  editingId.value = null
  isModalActive.value = true
}

const openEditModal = (activity: Activity) => {
  form.value = { ...activity }
  isEditing.value = true
  editingId.value = activity.id
  isModalActive.value = true
}

const closeModal = () => {
  isModalActive.value = false
}

const saveActivity = () => {
  if (!authStore.currentUser) return

  if (isEditing.value && editingId.value) {
    activitiesStore.updateActivity(editingId.value, { ...form.value })
  } else {
    activitiesStore.addActivity({
      ...form.value,
      userId: authStore.currentUser.id
    })
  }
  closeModal()
}

const deleteActivity = (id: number) => {
  if (confirm('Are you sure you want to delete this activity?')) {
    activitiesStore.deleteActivity(id)
  }
}
</script>

<template>
  <div class="box">
    <div class="level mb-4">
      <div class="level-left">
        <div>
          <h1 class="title">Activities</h1>
          <p class="subtitle">Manage your fitness activities</p>
        </div>
      </div>
      <div class="level-right">
        <button class="button is-primary" @click="openAddModal">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>Add Activity</span>
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="table is-fullwidth is-hoverable is-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Duration (min)</th>
            <th>Distance</th>
            <th>Calories</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="userActivities.length === 0">
            <td colspan="7" class="has-text-centered py-5">No activities found. Start tracking!</td>
          </tr>
          <tr v-for="activity in userActivities" :key="activity.id">
            <td>{{ activity.date }}</td>
            <td>
              <span class="tag is-info is-light">{{ activity.type }}</span>
            </td>
            <td>{{ activity.duration }}</td>
            <td>{{ activity.distance ? activity.distance : '-' }}</td>
            <td>{{ activity.calories }}</td>
            <td>{{ activity.notes || '-' }}</td>
            <td>
              <div class="buttons are-small">
                <button class="button is-info is-light" @click="openEditModal(activity)" title="Edit">
                  <span class="icon"><i class="fas fa-edit"></i></span>
                </button>
                <button class="button is-danger is-light" @click="deleteActivity(activity.id)" title="Delete">
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
          <p class="modal-card-title">{{ isEditing ? 'Edit Activity' : 'Add Activity' }}</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input class="input" type="date" v-model="form.date" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Activity Type</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="form.type" required>
                  <option value="" disabled>Select a type</option>
                  <option>Running</option>
                  <option>Cycling</option>
                  <option>Walking</option>
                  <option>Swimming</option>
                  <option>Yoga</option>
                  <option>Weightlifting</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Duration (minutes)</label>
                <div class="control">
                  <input class="input" type="number" min="0" v-model.number="form.duration" required />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Distance</label>
                <div class="control">
                  <input class="input" type="number" min="0" step="0.1" v-model.number="form.distance" />
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Calories Burned</label>
            <div class="control">
              <input class="input" type="number" min="0" v-model.number="form.calories" />
            </div>
          </div>
          <div class="field">
            <label class="label">Notes</label>
            <div class="control">
              <textarea class="textarea" v-model="form.notes" placeholder="How did it go?"></textarea>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="saveActivity" :disabled="!form.type || !form.date || form.duration <= 0">Save</button>
          <button class="button" @click="closeModal">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.py-5 { padding-top: 2rem; padding-bottom: 2rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mt-6 { margin-top: 3rem; }
</style>
