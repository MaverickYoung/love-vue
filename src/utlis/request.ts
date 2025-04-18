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

import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { useUserStore } from '@/store/user';
import { showDialog, showNotify } from 'vant';

// axios实例
const service = axios.create({
	baseURL: '/api',
	timeout: 10000, //10 秒
	headers: { 'Content-Type': 'application/json;charset=UTF-8' }
});

// 请求拦截器
service.interceptors.request.use(
	(config: any) => {
		const userStore = useUserStore();

		if (userStore?.accessToken) {
			config.headers.Authorization = userStore.accessToken;
		}

		config.headers['Accept-Language'] = 'zh-CN';

		// 追加时间戳，防止GET请求缓存
		if (config.method?.toUpperCase() === 'GET') {
			config.params = { ...config.params, t: new Date().getTime() };
		}

		if (Object.values(config.headers).includes('application/x-www-form-urlencoded')) {
			config.data = qs.stringify(config.data);
		}

		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// 是否刷新
let isRefreshing = false;
// 重试请求
let requests: Array<() => void> = [];

// 刷新token
export const useRefreshTokenApi = (refreshToken: string) => {
	return service.post(`/sys/auth/token`, { refreshToken });
};

// 响应拦截器
service.interceptors.response.use(
	async (response: AxiosResponse<any>) => {
		const userStore = useUserStore();

		if (response.status !== 200) {
			return Promise.reject(new Error(response.statusText || 'Error'));
		}

		const res = response.data;
		if (Object.prototype.toString.call(res) === '[object Blob]') {
			return response;
		}

		// 响应成功
		if (res.code === 1000) {
			return res;
		}

		// 刷新令牌失效（需跳转登录页）
		if (res.code === 3002) {
			return handleAuthorized();
		}

		// 访问令牌失效或没有权限，尝试刷新 accessToken
		if (res.code === 3001 || res.code === 2001) {
			const config = response.config;
			if (!isRefreshing) {
				isRefreshing = true;

				const refreshToken = userStore.refreshToken;
				if (!refreshToken) {
					return handleAuthorized();
				}

				try {
					const { data } = await useRefreshTokenApi(refreshToken);
					// 刷新成功，更新 Token
					userStore.setTokens(data.accessToken, data.refreshToken);
					config.headers!.Authorization = data.accessToken;
					// 重试队列中的请求
					requests.forEach((cb: any) => cb());
					requests = [];
					return service(config);
				} catch (e) {
					// 刷新 accessToken 失败，但不清除 refreshToken
					showNotify({ type: 'warning', message: '服务器异常，请稍后重试' });
					requests.forEach((cb: any) => cb());
					return Promise.reject(e);
				} finally {
					isRefreshing = false;
				}
			} else {
				// 正在刷新 Token，等待刷新完成再重试请求
				return new Promise(resolve => {
					requests.push(() => {
						config.headers!.Authorization = userStore.accessToken;
						resolve(service(config));
					});
				});
			}
		}

		// 其他错误提示
		showNotify({ type: 'danger', message: res.msg });
		return Promise.reject(new Error(res.msg || 'Error'));
	},
	error => {
		let errorMessage;
		if (error.message.includes('Network Error')) {
			errorMessage = '网络错误，请检查您的网络连接';
		} else if (error.message.includes('timeout')) {
			errorMessage = '请求超时，请稍后再试';
		} else {
			errorMessage = '未知错误';
			console.log(error.message);
		}

		showNotify({ type: 'danger', message: errorMessage });
		return Promise.reject(error);
	}
);

const handleAuthorized = () => {
	showDialog({
		title: '提示',
		message: '登录超时，请重新登录',
		confirmButtonText: '重新登录',
		theme: 'round-button' // 圆角按钮样式
	}).then(() => {
		const userStore = useUserStore();

		userStore.clearTokens();
		location.reload();

		return Promise.reject('登录超时，请重新登录');
	});
};

// 导出 axios 实例
export default service;
