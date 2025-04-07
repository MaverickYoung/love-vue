<!--
  - MIT License
  -
  - Copyright (c) 2025 Maverick Young
  -
  - Permission is hereby granted, free of charge, to any person obtaining a copy
  - of this software and associated documentation files (the "Software"), to deal
  - in the Software without restriction, including without limitation the rights
  - to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  - copies of the Software, and to permit persons to whom the Software is
  - furnished to do so, subject to the following conditions:
  -
  - The above copyright notice and this permission notice shall be included in all
  - copies or substantial portions of the Software.
  -
  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  - IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  - FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  - AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  - LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  - OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  - SOFTWARE.
  -->

<template>
	<div class="page-wrapper">
		<router-view />
	</div>

	<!-- 判断当前路由是否为登录页面，不是登录页时显示 tabbar -->
	<van-tabbar v-if="!isLoginPage" class="tab-bar" route>
		<van-tabbar-item icon="home-o" replace to="/poop">便便</van-tabbar-item>
		<van-tabbar-item icon="setting-o" replace to="/setting/user-profile">设置</van-tabbar-item>
	</van-tabbar>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { computed, onMounted } from 'vue';
import { applyTheme } from '@/utlis/theme';
import cache from '@/utlis/cache';

const route = useRoute();
const isLoginPage = computed(() => {
	return route.name === 'login';
});

onMounted(() => {
	applyTheme(cache.getTheme());
});
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
