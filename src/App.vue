<template>
  <router-view/>

  <!-- 判断当前路由是否为登录页面，不是登录页时显示 tabbar -->
  <van-tabbar v-if="!isLoginPage" route>
    <van-tabbar-item replace to="/poop" icon="home-o">便便</van-tabbar-item>
    <van-tabbar-item replace to="/setting" icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import {useRoute} from 'vue-router'
import {computed} from "vue";

const route = useRoute()
const isLoginPage = computed(() => {
  return route.name === 'login'
})
</script>
