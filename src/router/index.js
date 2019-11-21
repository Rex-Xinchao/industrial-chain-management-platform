import Vue from 'vue'
import Router from 'vue-router'
import Init from '@/views/init'
import Index from '@/views/index'
import Maintain from '@/views/maintain'
import Sync from '@/views/sync'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Init
    }, {
      path: '/init',
      name: 'init',
      component: Init
    }, {
      path: '/index',
      name: 'index',
      component: Index
    }, {
      path: '/maintain',
      name: 'maintain',
      component: Maintain
    }, {
      path: '/sync',
      name: 'sync',
      component: Sync
    }, {
      path: '/manage',
      name: 'manage',
      component: Sync
    }
  ]
})
