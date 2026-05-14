<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useActivitiesStore, type Activity } from '@/stores/activities'
import { useExerciseTypeStore } from '@/stores/exerciseTypes'
import { confirm } from '@/composables/useDialog'
import { useInfiniteScroll } from '@vueuse/core'
import { OAutocomplete } from '@oruga-ui/oruga-next'

const authStore = useAuthStore()
const activitiesStore = useActivitiesStore()
const exerciseTypeStore = useExerciseTypeStore()

const isModalActive = ref(false)
const isEditing = ref(false)

// Infinite Scroll
const scrollEl = ref<HTMLElement | null>(null)
useInfiniteScroll(
  scrollEl,
  () => {
    if (activitiesStore.hasMore && !activitiesStore.loading) {
      activitiesStore.fetchMyActivities(false)
    }
  },
  { distance: 10 }
)

// Autocomplete for Tagging Friends
const friendQuery = ref('')
const friendSuggestions = ref<any[]>([])
const isSearchingFriends = ref(false)
const selectedFriends = ref<any[]>([])

const searchFriends = async (query: string) => {
  if (!query) {
    friendSuggestions.value = []
    return
  }
  isSearchingFriends.value = true
  try {
    friendSuggestions.value = await activitiesStore.searchUsers(query)
  } finally {
    isSearchingFriends.value = false
  }
}

const addFriendTag = (friend: any) => {
  if (friend && !selectedFriends.value.find(f => f.id === friend.id)) {
    selectedFriends.value.push(friend)
    friendQuery.value = ''
  }
}

const removeFriendTag = (friendId: string) => {
  selectedFriends.value = selectedFriends.value.filter(f => f.id !== friendId)
}

const emptyForm = {
  exerciseTypeId: '',
  duration: 0,
  distance: 0,
  date: new Date().toISOString().split('T')[0] || '',
  calories: 0,
  notes: ''
}

const form = ref({ ...emptyForm })
const editingId = ref<string | null>(null)

const userActivities = computed(() => activitiesStore.activities)

onMounted(async () => {
  try {
    await Promise.all([
      activitiesStore.fetchMyActivities(true),
      exerciseTypeStore.fetchAllExerciseTypes()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  }
})

const openAddModal = () => {
  form.value = { ...emptyForm }
  selectedFriends.value = []
  isEditing.value = false
  editingId.value = null
  isModalActive.value = true
}

const openEditModal = (activity: Activity) => {
  form.value = {
    exerciseTypeId: activity.exerciseTypeId,
    duration: activity.duration,
    distance: activity.distance || 0,
    date: activity.date.split('T')[0] || '',
    calories: activity.calories,
    notes: activity.notes || ''
  }
  selectedFriends.value = (activity as any).taggedFriends || []
  isEditing.value = true
  editingId.value = activity.id
  isModalActive.value = true
}

const closeModal = () => {
  isModalActive.value = false
}

const saveActivity = async () => {
  if (!authStore.currentUser) {
    alert("You must be logged in to save an activity.")
    return
  }

  try {
    const payload: any = {
      exercise_type_id: form.value.exerciseTypeId,
      duration: form.value.duration,
      distance: form.value.distance || undefined,
      date: form.value.date || new Date().toISOString().split('T')[0],
      notes: form.value.notes || undefined,
      tagged_friends: selectedFriends.value.map(f => f.id)
    }

    if (isEditing.value && editingId.value) {
      await activitiesStore.updateActivity(editingId.value, payload)
    } else {
      await activitiesStore.addActivity(payload)
    }
    closeModal()
  } catch (error: any) {
    console.error("Save error:", error)
    alert(error.message || "Failed to save activity. Please try again.")
  }
}

const deleteActivity = async (id: string) => {
  if (await confirm('Delete Activity', 'Are you sure you want to delete this activity?')) {
    await activitiesStore.deleteActivity(id)
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
          <p class="is-size-7 has-text-grey" v-if="activitiesStore.totalCount > 0">
            Showing {{ activitiesStore.activities.length }} of {{ activitiesStore.totalCount }} activities
          </p>
        </div>
      </div>
      <div class="level-right">
        <button class="button is-primary" @click="openAddModal">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>Add Activity</span>
        </button>
      </div>
    </div>

    <div class="scroll-container" ref="scrollEl">
      <table class="table is-fullwidth is-hoverable is-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Duration</th>
            <th>Distance</th>
            <th>Calories</th>
            <th>Tagged Friends</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="userActivities.length === 0 && !activitiesStore.loading">
            <td colspan="7" class="has-text-centered py-5">No activities found. Start tracking!</td>
          </tr>
          <tr v-for="activity in userActivities" :key="activity.id">
            <td>{{ activity.date ? new Date(activity.date).toLocaleDateString() : 'No Date' }}</td>
            <td>
              <span class="tag is-info is-light">{{ (activity as any).exerciseType?.name || 'Activity' }}</span>
            </td>
            <td>{{ activity.duration }} min</td>
            <td>{{ activity.distance ? activity.distance + ' km' : '-' }}</td>
            <td>{{ activity.calories }} kcal</td>
            <td>
              <div class="tags">
                <span v-for="friend in (activity as any).taggedFriends" :key="friend.id" class="tag is-rounded is-light">
                  @{{ friend.username }}
                </span>
                <span v-if="!(activity as any).taggedFriends?.length" class="has-text-grey-light">-</span>
              </div>
            </td>
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
          
          <!-- Loading Skeletons -->
          <template v-if="activitiesStore.loading">
            <tr v-for="i in 3" :key="'skeleton-' + i">
              <td><div class="skeleton-block" style="width: 80px; height: 1.5rem;"></div></td>
              <td><div class="skeleton-block" style="width: 100px; height: 1.5rem;"></div></td>
              <td><div class="skeleton-block" style="width: 60px; height: 1.5rem;"></div></td>
              <td><div class="skeleton-block" style="width: 60px; height: 1.5rem;"></div></td>
              <td><div class="skeleton-block" style="width: 70px; height: 1.5rem;"></div></td>
              <td><div class="skeleton-block" style="width: 120px; height: 1.5rem;"></div></td>
              <td><div class="skeleton-block" style="width: 80px; height: 1.5rem;"></div></td>
            </tr>
          </template>
        </tbody>
      </table>
      
      <div v-if="!activitiesStore.hasMore && userActivities.length > 0" class="has-text-centered py-4 has-text-grey-light">
        No more activities to load.
      </div>
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
                <select v-model="form.exerciseTypeId" required>
                  <option value="" disabled>Select a type</option>
                  <option v-for="type in exerciseTypeStore.exerciseTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Duration (minutes)</label>
                <div class="control">
                  <input class="input" type="number" min="1" v-model.number="form.duration" required />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Distance (km)</label>
                <div class="control">
                  <input class="input" type="number" min="0" step="0.1" v-model.number="form.distance" />
                </div>
              </div>
            </div>
          </div>

          <!-- Tag Friends Autocomplete -->
          <div class="field">
            <label class="label">Tag Friends</label>
            <div class="control">
              <o-autocomplete
                v-model="friendQuery"
                :data="friendSuggestions"
                placeholder="Search for friends to tag..."
                field="username"
                :loading="isSearchingFriends"
                @typing="searchFriends"
                @select="addFriendTag"
                expanded
              >
                <template #default="{ option }">
                  <div class="media" v-if="option">
                    <div class="media-left">
                      <figure class="image is-24x24">
                        <img :src="option.avatar" class="is-rounded" />
                      </figure>
                    </div>
                    <div class="media-content">
                      {{ option.full_name }} (@{{ option.username }})
                    </div>
                  </div>
                </template>
                <template #empty>No results found for "{{ friendQuery }}"</template>
              </o-autocomplete>
            </div>
            <div class="tags mt-2">
              <span v-for="friend in selectedFriends" :key="friend.id" class="tag is-primary is-light">
                @{{ friend.username }}
                <button class="delete is-small" @click="removeFriendTag(friend.id)"></button>
              </span>
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
          <button class="button is-primary" @click="saveActivity" :disabled="!form.exerciseTypeId || !form.date || form.duration <= 0">Save</button>
          <button class="button" @click="closeModal">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  max-height: 600px;
  overflow-y: auto;
}
.py-5 { padding-top: 2rem; padding-bottom: 2rem; }
.mb-4 { margin-bottom: 1.5rem; }

/* Skeleton animation */
.skeleton-block {
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
