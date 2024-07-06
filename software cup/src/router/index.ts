import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import TiptapEditor from '../views/Editor.vue'

const routes = [
  { path: '/edit/:documentid', component: TiptapEditor},
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
