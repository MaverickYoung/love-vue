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
	<div class="theme-manager-container">
		<back-button />
		<h2>主题配置</h2>
		<div class="info-item">
			<div class="label">主题切换</div>
			<label>
				<input v-model="selectedTheme" name="themeOptions" type="radio" value="light" />
				<span class="option">亮色</span>
			</label>
			<label>
				<input v-model="selectedTheme" name="themeOptions" type="radio" value="dark" />
				<span class="option">暗色</span>
			</label>
			<div class="slider"></div>
		</div>

		<br />
		<div v-for="(config, key) in backgroundColors" :key="key" class="info-item">
			<div class="label">{{ config.label }}</div>
			<div class="value">
				<van-popover v-model:show="popoverStates[key]" placement="left">
					<color-picker
						:color="theme.styles[config.key]"
						@close="popoverStates[key] = false"
						@reset="onUpdateBackground(key, '')"
						@update:color="color => onUpdateBackground(key, color)" />
					<template #reference>
						<div :style="{ backgroundColor: theme.styles[config.key] }" class="color-box" />
					</template>
				</van-popover>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import { reactive, ref, watch } from 'vue'
import ColorPicker from '@/components/ColorPicker.vue'
import { Theme, ThemeConfig } from '@/utlis/theme'
import BackButton from '@/components/BackButton.vue'

const appStore = useAppStore()
const selectedTheme = ref('light')
type BackgroundKey = '--van-background' | '--van-background-2' | '--van-background-3'

// 存储背景色弹窗状态和对应的标签
const backgroundColors = {
	background: { key: '--van-background' as BackgroundKey, label: '主要背景色' },
	background2: {
		key: '--van-background-2' as BackgroundKey,
		label: '次要背景色'
	},
	background3: {
		key: '--van-background-3' as BackgroundKey,
		label: '辅助背景色'
	}
}

const theme = reactive<ThemeConfig>(appStore.theme)

// 动态生成弹窗状态
const popoverStates = reactive(Object.fromEntries(Object.keys(backgroundColors).map(key => [key, false])))

// 通用更新方法
const onUpdateBackground = (key: keyof typeof backgroundColors, color: string) => {
	popoverStates[key] = false // 关闭对应弹窗
	theme.styles[backgroundColors[key].key] = color // 更新样式
	onApplyTheme()
}

const onApplyTheme = () => {
	appStore.setTheme(theme)
}

watch(selectedTheme, () => {
	theme.styles = {} as Theme
	theme.isLight = selectedTheme.value === 'light'
	appStore.setTheme(theme)
})
</script>

<style scoped>
.theme-manager-container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	position: relative;

	h2 {
		margin-bottom: 20px;
	}

	/* 子容器样式 */

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 250px;
		padding: 10px;
		border: 1px solid var(--van-border-color);
		border-radius: 8px;
		margin: 8px 0;

		/* 标签样式 */

		.label {
			font-weight: bold;
			text-align: left;
			flex: 1;
		}

		/* 值样式 */

		.value {
			color: var(--van-text-color-2);
			text-align: right;
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;

			/* 添加 ">" 符号 */

			&::after {
				content: '>';
				margin-left: 8px;
			}

			.color-box {
				position: relative;
				width: 16px;
				height: 16px;
				border-radius: 3px;
				overflow: hidden;
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRIiWM8fubkfwYygKWJOSM5+mCAhRLNoxaPWjxq8ajFoxbTyeL/DAfJ0Xjs3Cl7Siwmu4Yht1aDgZEYx6MWj1o8avGoxaMWD3qLya5X//4nqx6HAQC7RBGFzolqTAAAAABJRU5ErkJggg==');
				background-size: 16px 16px;
			}
		}
	}
}
</style>
