import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Scoreboard from '@/pages/Scoreboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/scoreboard', component: Scoreboard },
  ]
})
export default router
