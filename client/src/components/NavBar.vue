<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <RouterLink to="/" class="navbar-item is-size-5 has-text-weight-bold">
          <span class="gym-icons">
            <i class="fas fa-dumbbell"></i>
            <i class="fas fa-heartbeat"></i>
            <i class="fas fa-running"></i>
          </span>
          <span class="ml-2">FitTrack</span>
        </RouterLink>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <RouterLink to="/" class="navbar-item" active-class="is-active">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-home"></i></span>
              <span>Home</span>
            </span>
          </RouterLink>
          <RouterLink v-if="authStore.isLoggedIn" to="/dashboard" class="navbar-item" active-class="is-active">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-chart-line"></i></span>
              <span>Dashboard</span>
            </span>
          </RouterLink>
          <RouterLink v-if="authStore.isLoggedIn" to="/activities" class="navbar-item" active-class="is-active">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-list"></i></span>
              <span>Activities</span>
            </span>
          </RouterLink>
          <RouterLink v-if="authStore.isLoggedIn" to="/friends" class="navbar-item" active-class="is-active">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-users"></i></span>
              <span>Friends</span>
            </span>
          </RouterLink>
          <RouterLink v-if="authStore.isLoggedIn" to="/statistics" class="navbar-item" active-class="is-active">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-chart-bar"></i></span>
              <span>Statistics</span>
            </span>
          </RouterLink>
          <RouterLink v-if="authStore.isLoggedIn && authStore.currentUser?.role === 'admin'" to="/admin" class="navbar-item" active-class="is-active">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-cog"></i></span>
              <span>Admin</span>
            </span>
          </RouterLink>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <template v-if="authStore.isLoggedIn">
                <div class="navbar-item has-dropdown is-hoverable">
                  <a class="navbar-link">
                    <span class="icon-text">
                      <span class="icon"><i class="fas fa-user-circle"></i></span>
                      <span>{{ authStore.currentUser?.fullName }}</span>
                    </span>
                  </a>
                  <div class="navbar-dropdown is-right">
                    <a class="navbar-item">
                      <span>@{{ authStore.currentUser?.username }}</span>
                    </a>
                    <hr class="navbar-divider" />
                    <a class="navbar-item" @click="logout">
                      <span class="has-text-danger">Logout</span>
                    </a>
                  </div>
                </div>
              </template>
              <template v-else>
                <RouterLink to="/login" class="button is-primary">
                  <strong>Login</strong>
                </RouterLink>
                <RouterLink to="/register" class="button is-light">
                  Sign Up
                </RouterLink>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-item a {
  color: #dbdbdb;
  transition: color 0.3s;
}

.navbar-item a:hover {
  color: #fff;
}

.navbar-item a.is-active {
  color: #fff;
  border-bottom-color: #3273dc;
  border-bottom: 3px solid #3273dc;
}

.icon-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gym-icons {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1rem;
  color: #41b883;
}

.gym-icons i:nth-child(2) {
  color: #ff6b6b;
}

.gym-icons i:nth-child(3) {
  color: #48c774;
}

</style>
