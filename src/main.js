import { createApp } from 'vue'
import { router } from '@/router'
import App from '@/App.vue'

import('@/assets/css/skeleton/normalize.css')
import('@/assets/css/skeleton/skeleton.css')

const app = createApp(App)
app.use(router)
app.mount('#app')
