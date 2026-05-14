import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Oruga from '@oruga-ui/oruga-next'
import { bulmaConfig } from '@oruga-ui/theme-bulma'
import '@oruga-ui/theme-bulma/style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Oruga, bulmaConfig)

// Initialize Auth
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore(pinia)
authStore.init().then(() => {
    app.mount('#app')
})
