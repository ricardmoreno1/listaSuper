import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home/Index.vue'
import Error404 from '../views/Error/404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About/About.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/addProduct',
    name: 'crearProducto',
    component: () => import(/* webpackChunkName: "about" */ '../views/Product/CreateProduct.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/updateProduct:prod',
    name: 'updaterProducto',
    component: () => import(/* webpackChunkName: "about" */ '../views/Product/CreateProduct.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/addStore',
    name: 'createStore',
    component: () => import(/* webpackChunkName: "about" */ '../views/Store/CreateStore.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/addCategory',
    name: 'createCategory',
    component: () => import(/* webpackChunkName: "about" */ '../views/Category/CreateCategory.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/administrator',
    name: 'administrator',
    component: () => import(/* webpackChunkName: "about" */ '../views/Admin/Administrator.vue'),
    meta: {
      requiresAuth: true
    }
  },
  /* {
    path: '/user',
    redirect: { name: 'ProfilePage' }
  },
  {
    path: '/user/profile',
    name: 'ProfilePage',
    component: () => import(/* webpackChunkName: "about" * / '../views/Profile/ProfilePage.vue')
  }, */
  {
    path: '*',
    component: Error404
  }

]

const router = new VueRouter({
  routes
})

// protegemos las rutas que se requiere autenticacion
router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (store.state.authId) {
      next()
    } else {
      next({ name: 'Home' })
    }
  } else {
    next()
  }
})

export default router
