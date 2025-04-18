/*
 * MIT License
 *
 * Copyright (c) 2025 Maverick Young
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useUserStore } from '@/store/user';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: '/poop'
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: { description: '登陆' }
	},
	{
		path: '/setting',
		name: 'setting',
		component: () => import('@/views/setting/index.vue'),
		meta: { description: '设置' },
		children: [
			{
				path: 'user-profile',
				name: 'user-profile',
				component: () => import('@/views/setting/UserProfile.vue'),
				meta: { description: '个人资料' }
			},
			{
				path: 'edit-username',
				name: 'edit-username',
				component: () => import('@/views/setting/EditUsername.vue'),
				meta: { description: '修改用户名' }
			},
			{
				path: 'edit-password',
				name: 'edit-password',
				component: () => import('@/views/setting/EditPassword.vue'),
				meta: { description: '修改密码' }
			},
			{
				path: 'edit-nickname',
				name: 'edit-nickname',
				component: () => import('@/views/setting/EditNickname.vue'),
				meta: { description: '修改昵称' }
			},
			{
				path: 'theme-manager',
				name: 'theme-manager',
				component: () => import('@/views/setting/ThemeManager.vue'),
				meta: { description: '主题管理' }
			}
		]
	},
	{
		path: '/poop',
		name: 'poop',
		component: () => import('@/views/poop/index.vue'),
		meta: { description: '便便' }
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@/views/404.vue'),
		meta: { description: '404' }
	}
];

export const errorRoute: RouteRecordRaw = {
	path: '/:pathMatch(.*)',
	redirect: '/404'
};

export const router = createRouter({
	history: createWebHashHistory(),
	routes: routes
});

// 白名单列表
const whiteList = ['/login'];

// 路由跳转前
router.beforeEach(async (to, from, next) => {
	NProgress.start();

	const userStore = useUserStore();

	if (whiteList.includes(to.path)) {
		// 前往白名单直接放行
		next();
	} else if (userStore.refreshToken) {
		// 检查是否存在刷新令牌
		// 用户信息不存在时重新拉取
		if (!userStore.user || !userStore.user.id) {
			try {
				await userStore.getUserInfoAction();
			} catch (error) {
				// 获取用户信息失败，清空令牌并跳转登录页
				userStore.clearTokens();
				next('/login');
				return Promise.reject(error);
			}

			// 添加错误路由
			router.addRoute(errorRoute);

			next({ ...to, replace: true });
		} else {
			next();
		}
	} else {
		next('/login');
	}
});

// 路由加载后
router.afterEach(() => {
	NProgress.done();
});
