<template>
  <div class="page-wrapper">
    <router-view/>
  </div>

  <!-- 判断当前路由是否为登录页面，不是登录页时显示 tabbar -->
  <van-tabbar v-if="!isLoginPage" route class="tab-bar" @change="onChange">
    <van-tabbar-item replace to="/poop" icon="home-o" :class="{'tab-item--active': activeIndex === 0}">便便
    </van-tabbar-item>
    <van-tabbar-item replace to="/setting" icon="setting-o" :class="{'tab-item--active': activeIndex === 1}">设置
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
import {computed, onMounted, ref} from 'vue'
import {applyTheme} from "@/store/theme";
import cache from "@/utlis/cache";

const route = useRoute()
const isLoginPage = computed(() => {
  return route.name === 'login'
})

const activeIndex = ref<number>(0);
const onChange = (index: number) => {
  activeIndex.value = index;
};
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

.tab-item--active * {
  color: var(--van-primary-color);
}
</style>