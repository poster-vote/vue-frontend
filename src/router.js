import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

import {
  ROUTE_HOME,
  ROUTE_POSTERS,
  ROUTE_SHOW_POSTER,
  ROUTE_ADD_POSTER
} from '@/const'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: ROUTE_HOME,
      component: Home
    },
    {
      path: '/posters',
      name: ROUTE_POSTERS,
      component: () =>
        import(/* webpackChunkName: "posters" */ './views/Posters.vue')
    },
    {
      path: '/posters/add',
      name: ROUTE_ADD_POSTER,
      component: () =>
        import(/* webpackChunkName: "posters" */ './views/AddPoster.vue')
    },
    {
      path: '/posters/:id',
      name: ROUTE_SHOW_POSTER,
      component: () =>
        import(/* webpackChunkName: "posters" */ './views/ShowPoster.vue')
    }
  ]
})
