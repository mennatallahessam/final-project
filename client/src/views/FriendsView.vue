<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore, type User } from '@/stores/users'
import { useActivitiesStore } from '@/stores/activities'

const authStore = useAuthStore()
const usersStore = useUsersStore()
const activitiesStore = useActivitiesStore()

const friends = computed(() => {
  if (!authStore.currentUser) return []
  return authStore.currentUser.friends
    .map(id => usersStore.getUserById(id))
    .filter((u): u is User => u !== undefined)
})

const selectedFriend = ref<User | null>(null)

const friendActivities = computed(() => {
  if (!selectedFriend.value) return []
  return activitiesStore.getActivitiesByUser(selectedFriend.value.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const selectFriend = (friend: User) => {
  selectedFriend.value = friend
}
</script>

<template>
  <div class="box">
    <h1 class="title">Friends</h1>
    <p class="subtitle">See what your friends are up to</p>

    <div class="columns mt-4">
      <!-- Friends List -->
      <div class="column is-one-third">
        <div class="panel is-info">
          <p class="panel-heading">My Friends</p>
          <div v-if="friends.length === 0" class="panel-block">
            No friends added yet.
          </div>
          <a
            v-for="friend in friends"
            :key="friend.id"
            :class="['panel-block', { 'is-active': selectedFriend?.id === friend.id }]"
            @click="selectFriend(friend)"
          >
            <span class="panel-icon">
              <i class="fas fa-user-circle"></i>
            </span>
            {{ friend.fullName }} (@{{ friend.username }})
          </a>
        </div>
      </div>

      <!-- Friend's Activities -->
      <div class="column">
        <template v-if="selectedFriend">
          <h3 class="title is-4">{{ selectedFriend.fullName }}'s Activities</h3>
          <div class="table-container">
            <table class="table is-fullwidth is-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Distance</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="friendActivities.length === 0">
                  <td colspan="5" class="has-text-centered py-4">No activities logged yet.</td>
                </tr>
                <tr v-for="activity in friendActivities" :key="activity.id">
                  <td>{{ activity.date }}</td>
                  <td><span class="tag is-info is-light">{{ activity.type }}</span></td>
                  <td>{{ activity.duration }} min</td>
                  <td>{{ activity.distance ? activity.distance : '-' }}</td>
                  <td>{{ activity.calories }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-else>
          <div class="notification is-light">
            Select a friend from the list to view their activities.
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mt-4 { margin-top: 1.5rem; }
.py-4 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
</style>
