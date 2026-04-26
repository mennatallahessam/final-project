<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore, type User } from '@/stores/users'
import { useActivitiesStore, type Activity } from '@/stores/activities'

const authStore = useAuthStore()
const usersStore = useUsersStore()
const activitiesStore = useActivitiesStore()

const friends = computed(() => {
  if (!authStore.currentUser) return []
  // friends are populated on the server
  return (authStore.currentUser.friends || []) as unknown as User[]
})

const selectedFriend = ref<User | null>(null)
const selectedFriendActivities = ref<Activity[]>([])
const loadingActivities = ref(false)

const allOtherUsers = computed(() => {
  if (!authStore.currentUser) return []
  return usersStore.users.filter(u => 
    u.id !== authStore.currentUser!.id && 
    !(authStore.currentUser!.friends || []).some((f: any) => (f.id || f) === u.id)
  )
})

onMounted(async () => {
  await authStore.init() // Refresh populated friends
  await usersStore.fetchAllUsers() // For searching new friends
})

const selectFriend = async (friend: User) => {
  selectedFriend.value = friend
  loadingActivities.value = true
  try {
    selectedFriendActivities.value = await activitiesStore.fetchUserActivities(friend.id)
    selectedFriendActivities.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } finally {
    loadingActivities.value = false
  }
}

const followUser = async (user: User) => {
  await usersStore.addFriend(user.id)
  await authStore.init() // Refresh my profile
}

const unfollowFriend = async (friendId: string) => {
  if (confirm('Unfollow this friend?')) {
    await usersStore.removeFriend(friendId)
    if (selectedFriend.value?.id === friendId) {
      selectedFriend.value = null
      selectedFriendActivities.value = []
    }
    await authStore.init()
  }
}
</script>

<template>
  <div class="box">
    <div class="level">
      <div class="level-left">
        <div>
          <h1 class="title">Social</h1>
          <p class="subtitle">Connect with other fitness enthusiasts</p>
        </div>
      </div>
    </div>

    <div class="columns mt-4">
      <!-- Friends List & Search -->
      <div class="column is-one-third">
        <div class="panel is-info">
          <p class="panel-heading">My Friends</p>
          <div v-if="friends.length === 0" class="panel-block has-text-grey">
            No friends added yet.
          </div>
          <div
            v-for="friend in friends"
            :key="friend.id"
            :class="['panel-block', 'is-flex', 'is-justify-content-space-between', { 'is-active': selectedFriend?.id === friend.id }]"
            style="cursor: pointer;"
            @click="selectFriend(friend)"
          >
            <div class="is-flex is-align-items-center">
              <span class="panel-icon">
                <i class="fas fa-user-circle"></i>
              </span>
              {{ friend.fullName }}
            </div>
            <button class="button is-small is-danger is-inverted" @click.stop="unfollowFriend(friend.id)" title="Unfollow">
              <i class="fas fa-user-minus"></i>
            </button>
          </div>
        </div>

        <div class="panel is-link mt-5">
          <p class="panel-heading">Find Friends</p>
          <div class="panel-block">
            <p class="control has-icons-left">
              <input class="input" type="text" placeholder="Search users...">
              <span class="icon is-left">
                <i class="fas fa-search" aria-hidden="true"></i>
              </span>
            </p>
          </div>
          <div v-if="allOtherUsers.length === 0" class="panel-block has-text-grey">
            No other users to follow.
          </div>
          <div v-for="user in allOtherUsers.slice(0, 5)" :key="user.id" class="panel-block is-flex is-justify-content-space-between">
            <div>{{ user.fullName }} <small class="has-text-grey">@{{ user.username }}</small></div>
            <button class="button is-small is-link is-outlined" @click="followUser(user)">
              Follow
            </button>
          </div>
        </div>
      </div>

      <!-- Friend's Activities -->
      <div class="column">
        <template v-if="selectedFriend">
          <div class="is-flex is-align-items-center is-justify-content-space-between mb-4">
            <h3 class="title is-4 mb-0">{{ selectedFriend.fullName }}'s Activities</h3>
            <span class="tag is-info">{{ selectedFriendActivities.length }} activities</span>
          </div>

          <progress v-if="loadingActivities" class="progress is-small is-primary" max="100">15%</progress>
          
          <div class="table-container" v-else>
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
                <tr v-if="selectedFriendActivities.length === 0">
                  <td colspan="5" class="has-text-centered py-4">No activities logged yet.</td>
                </tr>
                <tr v-for="activity in selectedFriendActivities" :key="activity.id">
                  <td>{{ new Date(activity.date).toLocaleDateString() }}</td>
                  <td>
                    <span class="tag is-info is-light">
                      {{ typeof activity.exerciseTypeId === 'string' ? 'Activity' : activity.exerciseTypeId.name }}
                    </span>
                  </td>
                  <td>{{ activity.duration }} min</td>
                  <td>{{ activity.distance ? activity.distance : '-' }}</td>
                  <td>{{ activity.calories }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-else>
          <div class="notification is-light has-text-centered py-6">
            <span class="icon is-large has-text-grey-light mb-4">
              <i class="fas fa-users fa-3x"></i>
            </span>
            <p>Select a friend from the list to view their activities.</p>
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
