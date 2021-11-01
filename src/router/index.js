import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Workouts from '@/views/Workouts.vue'
import Favourites from '@/views/Favourites.vue'

import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'fa fa-home',
    visible: true,
  },
  {
    path: '/workouts',
    name: 'Workouts',
    component: Workouts,
    icon: 'fa fa-bar-chart',
    visible: true,
  },
  {
    path: '/favourites',
    name: 'Favourites',
    component: Favourites,
    icon: 'fa fa-heart',
    visible: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    visible: false,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  console.debug('Accessing ' + to.name + ' view.')
  if(to.name !== 'Login' && !store.state.user.is_authenticated()) {
    console.debug('Unauthorized. Redirect to Login view.')
    next({ name: 'Login' })
  } else if(to.name === 'Login' && store.state.user.is_authenticated()) {
      console.debug('Authorized. Navigate to Home view.')
      next({ name: 'Home' })
  } else {
      next()
  }
})

export { routes, router }
