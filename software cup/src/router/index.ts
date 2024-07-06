import { createRouter, createWebHashHistory} from 'vue-router'
import TiptapEditor from '../views/Editor.vue'
// import path = require('path');
import HomeView from '@/views/HomeView.vue';

const routes = [
  { path: '/edit/:documentid', component: TiptapEditor},
  { path: '/', component: HomeView},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;
