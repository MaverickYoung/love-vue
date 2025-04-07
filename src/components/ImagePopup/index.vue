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
	<div v-if="show" class="popup-container" @click="closePopup">
		<div class="popup-content" @click.stop>
			<image-wrapper v-if="src" :src="src" width="80dvw" />
			<div v-else class="empty-image-placeholder">空</div>
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import ImageWrapper from '@/components/ImageWrapper.vue'

const props = defineProps<{
	src?: string
	show: boolean
}>()

// 定义 emit
const emit = defineEmits(['update:show'])

// 关闭弹窗
const closePopup = () => {
	emit('update:show', false)
}
</script>

<style scoped>
.popup-container {
	height: 100dvh;
	width: 100dvw;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;

	background: black;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	.popup-content {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.empty-image-placeholder {
			font-size: 30px;
			margin: 50px;
			color: white;
		}
	}
}
</style>
