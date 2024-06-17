import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: () => import('../views/TransactionsView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  // check if the route requires authentication and user is not logged in
  if (to.matched.some(record => record.meta.requiresAuth) && !localStorage.getItem('userId')) {
    // redirect to login page
    next({ name: 'Login' });
  } else if ((to.name === 'Login' || to.name === 'Register') && localStorage.getItem('userId')) {
    // if user is already logged in and tries to access login or register page, redirect to home page
    next({ name: 'home' });
  } else {
    // otherwise continue
    next();
  }
});


export default router
