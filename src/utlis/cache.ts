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

import { Storage } from './storage';
import { Theme, ThemeConfig } from '@/utlis/theme';

const key = {
	refreshTokenKey: 'loveRefreshToken',
	loginUsername: 'loveLoginUsername',
	theme: 'loveTheme',
	background: 'loveBackground'
};

// 缓存
class Cache {
	getRefreshToken = (): string => {
		return Storage.getItem(key.refreshTokenKey) ?? '';
	};

	setRefreshToken = (value: string) => {
		Storage.setItem(key.refreshTokenKey, value);
	};

	getLoginUsername = (): string => {
		return Storage.getItem(key.loginUsername) ?? '';
	};

	setLoginUsername = (value: string) => {
		Storage.setItem(key.loginUsername, value);
	};

	// 获取主题配置
	getTheme = (): ThemeConfig => {
		const themeConfig = Storage.getItem(key.theme);

		// 如果 themeConfig 是无效的（类型错误或为空），返回默认的亮色主题
		if (!themeConfig || typeof themeConfig.isLight !== 'boolean' || !themeConfig.styles) {
			return {
				isLight: true, // 默认为亮色主题
				styles: {} as Theme
			};
		}
		return themeConfig;
	};

	setTheme = (value: ThemeConfig) => {
		Storage.setItem(key.theme, value);
	};
}

export default new Cache();
