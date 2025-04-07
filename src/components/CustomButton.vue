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
	<button :class="{ square }" :style="buttonStyle" class="custom-button" @click="handleClick">
		<slot></slot>
		<!-- 插槽，用来传递按钮文字 -->
	</button>
</template>

<script lang="ts" setup>
// 定义按钮颜色的枚举值
import { computed, PropType } from 'vue'

const colorMap = {
	primary: '--van-primary-color',
	success: '--van-success-color',
	danger: '--van-danger-color',
	warning: '--van-warning-color'
}

// 接受外部传递的属性
const props = defineProps({
	color: {
		type: String as PropType<'primary' | 'success' | 'danger' | 'warning'>,
		default: 'primary' // 默认颜色
	},
	backgroundColor: {
		type: String,
		default: '' // 自定义颜色
	},
	width: {
		type: String,
		default: '100%'
	},
	height: {
		type: String,
		default: '100%'
	},
	square: {
		type: Boolean,
		default: false // 默认不是方形按钮
	}
})

// 计算按钮的背景颜色
const buttonStyle = computed(() => {
	const backgroundColor = props.backgroundColor || `var(${colorMap[props.color]})`

	return {
		backgroundColor: backgroundColor,
		width: props.width,
		height: props.height,
		borderRadius: props.square ? '4px' : '50px' // 动态设置圆角值
	}
})

const handleClick = (event: any) => {
	event.preventDefault() // 阻止表单提交
}
</script>

<style scoped>
.custom-button {
	padding: 12px 0;
	font-size: 16px;
	border: none;
	outline: none;
	cursor: pointer;
	transition: all 0.1s ease; /* 平滑过渡效果 */
	word-spacing: 10px;
	display: flex; /* 启用 Flex 布局 */
	justify-content: center; /* 水平居中 */
	align-items: center; /* 垂直居中 */
}

.custom-button:active {
	filter: brightness(85%); /* 点击时背景色变暗 */
	transform: scale(0.98); /* 点击时缩小效果 */
}
</style>
