import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Initialize Auth
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore(pinia)
authStore.init().then(() => {
    app.mount('#app')
})
