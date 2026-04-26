<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const register = async () => {
  error.value = ''
  success.value = ''

  if (password.value !== passwordConfirm.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  const result = await authStore.register(username.value, email.value, fullName.value, password.value)
  loading.value = false

  if (result.success) {
    success.value = result.message
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } else {
    error.value = result.message
  }
}
</script>

<template>
  <div class="container py-6">
    <div class="columns is-centered">
      <div class="column is-5">
        <div class="box">
          <h1 class="title">Create Account</h1>

          <div v-if="error" class="notification is-danger">
            <button class="delete"></button>
            {{ error }}
          </div>

          <div v-if="success" class="notification is-success">
            <button class="delete"></button>
            {{ success }}
          </div>

          <div class="field">
            <label class="label">Full Name</label>
            <div class="control has-icons-left">
              <input
                v-model="fullName"
                class="input"
                type="text"
                placeholder="Enter your full name"
              />
              <span class="icon is-left"><i class="fas fa-user"></i></span>
            </div>
          </div>

          <div class="field">
            <label class="label">Email</label>
            <div class="control has-icons-left">
              <input
                v-model="email"
                class="input"
                type="email"
                placeholder="Enter your email"
              />
              <span class="icon is-left"><i class="fas fa-envelope"></i></span>
            </div>
          </div>

          <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left">
              <input
                v-model="username"
                class="input"
                type="text"
                placeholder="Enter username (min 3 chars)"
              />
              <span class="icon is-left"><i class="fas fa-id-card"></i></span>
            </div>
          </div>

          <div class="field">
            <label class="label">Password</label>
            <div class="control has-icons-left">
              <input
                v-model="password"
                class="input"
                type="password"
                placeholder="Enter password (min 6 chars)"
              />
              <span class="icon is-left"><i class="fas fa-lock"></i></span>
            </div>
          </div>

          <div class="field">
            <label class="label">Confirm Password</label>
            <div class="control has-icons-left">
              <input
                v-model="passwordConfirm"
                class="input"
                type="password"
                placeholder="Confirm password"
              />
              <span class="icon is-left"><i class="fas fa-lock"></i></span>
            </div>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button
                @click="register"
                :class="['button', 'is-primary', { 'is-loading': loading }]"
              >
                Create Account
              </button>
            </div>
          </div>

          <p class="has-text-centered mt-4">
            Already have an account?
            <router-link to="/login" class="has-text-link">Login here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.py-6 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
