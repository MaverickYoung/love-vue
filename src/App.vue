<template>
  <div class="page-wrapper">
    <router-view/>
  </div>

  <!-- 判断当前路由是否为登录页面，不是登录页时显示 tabbar -->
  <van-tabbar v-if="!isLoginPage" route class="tab-bar">
    <van-tabbar-item replace to="/poop" icon="home-o">便便</van-tabbar-item>
    <van-tabbar-item replace to="/setting/user-profile" icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
import {computed, onMounted} from 'vue'
import {applyTheme} from "@/utlis/theme";
import cache from "@/utlis/cache";

const route = useRoute()
const isLoginPage = computed(() => {
  return route.name === 'login'
})

onMounted(() => {
  applyTheme(cache.getTheme())
})
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100dvh - 50px);
}

.tab-bar {
  height: 50px;
}

.van-tabbar-item--active * {
  color: var(--van-primary-color);
}
</style>