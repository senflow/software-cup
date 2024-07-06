<script setup lang="ts">
import { ref, onMounted } from "vue";
import LoginSignup from "./LoginSignup.vue";
import { NAvatar, NDropdown } from "naive-ui";
import { isLoginVisible } from "@/globalVariables";
import { useUserStore } from "@/store/modules/user.ts";
import { useRouter } from "vue-router";

/* async function updateAvatar() {
  userInfo.value = await fetchUserDataBySid(useUserStore().user.sid);
  avatar.value = 'http://' + userInfo.value.avatar_url
  isLoadingAvatar.value = false;
}
onMounted(async () => {
  await updateAvatar();
})
 */
const isLoadingAvatar = ref(true);
const avatar = ref('');
const handleLoginClose = () => {
  isLoginVisible.value = false; // 隐藏弹出窗口
};

</script>
<template>
  <nav class="navbar">
    <ul class="navbar-menu">
      <img src="../assets/img/logo.png" class="menu-item-logo" />
    </ul>

    <ul class="navbar-person">
      <n-dropdown v-if="useUserStore().isAuthenticated && isLoadingAvatar === false" trigger="hover" :options="options"
        @select="handleSelect">
        <n-avatar class="login-item" round :size="48" :src="avatar" />
      </n-dropdown>

      <n-avatar v-else class="login-item" @click="handleLogin" round :size="48">
        登录
      </n-avatar>
    </ul>
  </nav>

  <div class="overlay" v-if="isLoginVisible" @click="handleLoginClose()"></div>
  <div class="login-popup" v-if="isLoginVisible">
    <!-- 登录弹出窗口 -->
    <LoginSignup @close="handleLoginClose()" />
  </div>
</template>
