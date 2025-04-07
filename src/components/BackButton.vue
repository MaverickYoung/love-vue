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
	<div class="back" @click="handleBack">
		<ImageWrapper :src="BackIcon" class="icon-back" />
	</div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import ImageWrapper from '@/components/ImageWrapper.vue'
import { PropType } from 'vue'
import { BackIcon } from '@/assets'

// 获取路由实例
const router = useRouter()

// 接收父组件传递的 handleBack 方法
const props = defineProps({
	handleBack: {
		type: Function as PropType<() => void>
	}
})
const handleBack = props.handleBack || (() => router.back())
</script>

<style scoped>
.back {
	width: 25px;
	height: 25px;
	position: absolute;
	top: 0;
	left: 0;

	.icon-back {
		transform: translateX(-1000px);
		filter: drop-shadow(1000px 0 0 var(--van-text-color));
	}
}
</style>
