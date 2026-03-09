<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <RouterLink to="/" class="navbar-item is-size-5 has-text-weight-bold">
        <span class="icon-text">
          <span class="icon"><i class="fas fa-dumbbell"></i></span>
          <span>FitTrack</span>
        </span>
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
        <RouterLink to="/dashboard" class="navbar-item" active-class="is-active">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-chart-line"></i></span>
            <span>Dashboard</span>
          </span>
        </RouterLink>
        <RouterLink to="/activities" class="navbar-item" active-class="is-active">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-list"></i></span>
            <span>Activities</span>
          </span>
        </RouterLink>
        <RouterLink to="/friends" class="navbar-item" active-class="is-active">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-users"></i></span>
            <span>Friends</span>
          </span>
        </RouterLink>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <RouterLink to="/login" class="button is-primary">
              <strong>Login</strong>
            </RouterLink>
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
</style>
