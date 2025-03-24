import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/Login.vue'
import DashboardCustomer from '@/views/DashboardCustomer.vue'
import DashboardEmployee from '@/views/DashboardEmployee.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard/customer/',
    name: 'Dashboard-customer',
    component: DashboardCustomer,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/employee/',
    name: 'Dashboard-employee',
    component: DashboardEmployee,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirect to login if attempting to access a protected route while not authenticated
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // Redirect to dashboard if already logged in and trying to access login page
    next('/dashboard/customer/');
  } else {
    next();
  }
})

export default router