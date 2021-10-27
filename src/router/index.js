import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Workouts from '@/views/Workouts.vue'
import Other from '@/views/Other.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'fa fa-home',
  },
  {
    path: '/workouts',
    name: 'Workouts',
    component: Workouts,
    icon: 'fa fa-bar-chart',
  },
  {
    path: '/other',
    name: 'Other',
    component: Other,
    icon: 'fa fa-hourglass-2',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { routes, router }
