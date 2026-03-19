<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = () => {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Please enter username and password'
    return
  }

  loading.value = true
  const result = authStore.login(username.value, password.value)
  loading.value = false

  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.message
  }
}

const demoLogin = (user: string, pass: string) => {
  username.value = user
  password.value = pass
  handleLogin()
}
</script>

<template>
  <div class="container py-6">
    <div class="columns is-centered">
      <div class="column is-5">
        <div class="box">
          <h1 class="title">Fitness Tracker Login</h1>

          <div v-if="error" class="notification is-danger">
            <button class="delete"></button>
            {{ error }}
          </div>

          <div class="field">
            <label class="label">Username</label>
            <div class="control has-icons-left">
              <input
                v-model="username"
                class="input"
                type="text"
                placeholder="Enter username"
              />
              <span class="icon is-left"><i class="fas fa-user"></i></span>
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control has-icons-left">
              <input
                v-model="password"
                class="input"
                type="password"
                placeholder="Enter password"
              />
              <span class="icon is-left"><i class="fas fa-lock"></i></span>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button
                @click="handleLogin"
                :class="['button', 'is-primary', { 'is-loading': loading }]"
              >
                Login
              </button>
            </div>
          </div>

          <div class="content has-text-centered">
            <p class="mb-3">
              <strong>Demo Accounts:</strong>
            </p>
            <div class="buttons is-centered">
              <button class="button is-small is-light" @click="demoLogin('admin', 'admin123')">
                Admin (admin / admin123)
              </button>
              <button class="button is-small is-light" @click="demoLogin('john', 'john123')">
                John (john / john123)
              </button>
              <button class="button is-small is-light" @click="demoLogin('jane', 'jane123')">
                Jane (jane / jane123)
              </button>
            </div>
          </div>

          <div class="divider"></div>

          <p class="has-text-centered">
            Don't have an account?
            <router-link to="/register" class="has-text-link has-text-weight-bold">
              Sign up here
            </router-link>
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

.divider {
  height: 1px;
  background-color: #dbdbdb;
  margin: 1.5rem 0;
}

.mb-3 {
  margin-bottom: 0.75rem;
}
</style>
