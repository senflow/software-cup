import { createRouter, createWebHashHistory} from 'vue-router'
import TiptapEditor from '../views/Editor.vue'
import path = require('path');
import TheWelcome from '@/components/TheWelcome.vue';

const routes = [
  { path: '/edit/:documentid', component: TiptapEditor},
  { path: '/', component: TheWelcome},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;
