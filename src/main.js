import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import LoginView from './views/Login.vue'; // Import komponentu logowania

const routes = [
  { path: '/', component: LoginView }, // Domyślna ścieżka
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
