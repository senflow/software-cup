<script lang="ts">
export default {
  name: 'HomeView',
  components: {
    LoginSignup
  }
}

</script>

<script setup lang="ts">
import LoginSignup from '../components/LoginSignup.vue'
import { ref } from "vue";
import { isLoginVisible } from "@/globalVariables";
import { NAvatar } from "naive-ui";
import { useUserStore } from "@/store/modules/user";

const avatar = ref('@/assets/avatar.png');
const handleLoginClose = () => {
  isLoginVisible.value = false; // 隐藏弹出窗口
};


const handleLogin = () => {
  isLoginVisible.value = true; // 显示弹出窗口
};

</script>

<template>
  <n-avatar v-if="useUserStore().isAuthenticated" class="login-item" round :size="48" :src="avatar">
    111
  </n-avatar>
  <n-avatar v-else class="login-item" v-if="!isLoginVisible" @click="handleLogin()" round :size="48">
    登录
  </n-avatar>

  <div class="overlay" v-if="isLoginVisible" @click="handleLoginClose()"></div>
  <div class="login-popup" v-if="isLoginVisible">
    <!-- 登录弹出窗口 -->
    <LoginSignup @close="handleLoginClose()" />
  </div>
  <!-- <LoginSignup /> -->
</template>
