import VueRouter, { RouteMeta } from 'vue-router'

// Pages
import Vue from 'vue'
import Screenshot from '@/pages/Screenshot.vue';

const routes = [
  {
    path: '/screenshot',
    name: 'Screenshot',
    component: Screenshot,
  }
]

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to: RouteMeta, from: RouteMeta, next) => {
  // check auth?
  next()
})

export default router
