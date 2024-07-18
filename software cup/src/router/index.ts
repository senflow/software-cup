import { createRouter, createWebHashHistory} from 'vue-router'
// import TiptapEditor from '../views/Editor.vue'
import TiptapEditor3 from '../views/Edit/index.vue'
// import path = require('path');
import HomeView from '@/views/HomeView.vue';
import { defineStore} from 'pinia'
import { h, ref, type Component } from 'vue'

const routes = [
  // { path: '/edit2/:documentid', component: TiptapEditor},
  { path: '/edit3/:documentid', component: TiptapEditor3, props: true},
  { path: '/', component: HomeView},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


export default router;