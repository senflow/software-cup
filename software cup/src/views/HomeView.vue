<template>
  <el-container class="main-container">
    <el-aside width="200px" class="aside">
      <Aside style="height: 100%;"></Aside>
    </el-aside>
    <el-container class="content-container">
      <el-header class="header">
        <div class="left-header">
          <el-button @click="create()">新建</el-button>
          <el-button type="primary">模板</el-button>
        </div>
        <div class="toolbar">
          <span>Tom</span>
          <el-avatar class="el-drop" v-if="useUserStore().isAuthenticated" round :size="48" :src="avatar" />
          <el-avatar class="el-drop" v-else @click="handleLogin()" round :size="48">
            登录
          </el-avatar>
          <div class="overlay" v-if="isLoginVisible" @click="handleLoginClose()"></div>
          <LoginSignup class="login-popup" v-if="isLoginVisible" @close="handleLoginClose()" />
          <el-dropdown class="el-drop">
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人主页</el-dropdown-item>
                <el-dropdown-item>切换账户</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <div class="filter-options">
          <el-button @click="filterType = 'recent'">最近</el-button>
          <el-button @click="filterType = 'favorites'">收藏</el-button>
        </div>
        <el-row class="header-row">
          <el-col :span="4">名称</el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">最近查看</el-col>
          <el-col :span="4">文档大小</el-col>
        </el-row>
        <div class="card-container">
          <file-card v-for="file in paginatedFiles" :key="file.name" v-bind="file"></file-card>
        </div>
        <el-pagination class="pagination" :current-page="currentPage" :page-size="pageSize"
          :total="filteredFiles.length" @current-change="handlePageChange" layout="prev, pager, next" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
export default {
  name: 'HomeView',
  components: {
    LoginSignup,
    Aside,
    FileCard,
  }
}
</script>

<script setup lang="ts">
import LoginSignup from '../components/LoginSignup.vue';
import FileCard from '../components/Home/FileCard.vue';
import { computed, ref } from 'vue';
import { isLoginVisible } from '@/globalVariables';
import Aside from '../components/Home/Aside.vue';
import { useUserStore } from '@/store/modules/user';

import {
  ElContainer, ElAside, ElHeader, ElMain, ElButton,
  ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar, ElRow, ElCol, ElPagination
} from 'element-plus';
import { useRouter } from 'vue-router';

const avatar = ref('@/assets/avatar.png');
const handleLoginClose = () => {
  isLoginVisible.value = false;
};

const handleLogin = () => {
  isLoginVisible.value = true;
};

const router = useRouter();

const create = () => {
  const { href } = router.resolve({
    path: "/edit3",
  });
  window.open(href, "_block");
};

const filterType = ref('recent');
const files = ref([
  { name: '大班课程报名登记表', owner: 'CCTS', recent: '20:01', size: '375.75 MB', checked: false, icon: 'el-icon-document' },
  { name: '2221大班暑期在校信息统计', owner: 'Sunny', recent: '07-09 23:53', size: '-', checked: false, icon: 'el-icon-document' },
  { name: '试点通过名单', owner: '黄梁淳矣', recent: '07-06 21:29', size: '18.47 KB', checked: false, icon: 'el-icon-document' },
  { name: '神山寺昨天大都是大V', owner: 'kk_tatay', recent: '07-06 16:20', size: '1.65 KB', checked: false, icon: 'el-icon-document' },
  { name: '讲师互评表格', owner: '0625', recent: '07-06 01:09', size: '23.23 KB', checked: false, icon: 'el-icon-document' },
  { name: 'OS 助教报名', owner: 'yofingert', recent: '07-05 20:22', size: '22.77 MB', checked: false, icon: 'el-icon-document' },
  { name: '2024暑假一轮选课', owner: '0625', recent: '06-28 18:12', size: '35.17 KB', checked: false, icon: 'el-icon-document' },
  { name: '班级统计', owner: '星空下的暴走奶昔', recent: '06-27 21:16', size: '22.53 KB', checked: false, icon: 'el-icon-document' },
  { name: '挑战性任务报名', owner: 'yofingert', recent: '06-27 20:19', size: '-', checked: false, icon: 'el-icon-document' },
]);

const pageSize = 8;
const currentPage = ref(1);

const filteredFiles = computed(() => {
  if (filterType.value === 'recent') {
    return files.value;
  }
  // 根据需要添加其他过滤逻辑
  return files.value.filter(file => file.checked);
});

const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredFiles.value.slice(start, start + pageSize);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<style scoped>
.main-container {
  display: flex;
  height: 98vh;
}

.aside {
  background-color: #f5f5f5;
  margin-top: -10px;
  margin-left: -5px;
}

.content-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  background-color: #000001;
  height: 80px;
  padding: 0 20px;
  box-sizing: border-box;
  margin-right: -8px;
  margin-top: -10px;
}

.left-header {
  display: flex;
  align-items: center;
}

.toolbar {
  display: flex;
  align-items: center;
}

.el-drop {
  margin-left: 10px;
}

.header span {
  color: #ffffff;
  font-size: 20px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.login-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.filter-options {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.header-row {
  margin-bottom: 10px;
  font-weight: bold;
  background-color: #f5f5f5;
  padding: 10px 0;
}

.card-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  flex: 1;
}

.pagination {
  margin-top: 10px;
  text-align: center;
}
</style>
