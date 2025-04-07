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
	<form class="edit-field-form">
		<back-button />
		<h2>{{ title }}</h2>
		<div v-for="(column, index) in columns" :key="index" class="form-item">
			<div class="label">{{ column.label }}</div>
			<input
				v-model="column.value"
				:placeholder="column.placeholder"
				:type="column.type || 'text'"
				class="input-field"
				@blur="handleBlur(column, index)" />
			<p v-if="column.error" class="error">{{ column.error }}</p>
		</div>

		<div class="button-group">
			<custom-button @click="onConfirm()">确 认</custom-button>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { onMounted, PropType } from 'vue'
import CustomButton from '@/components/CustomButton.vue'
import BackButton from '@/components/BackButton.vue'

export interface Column {
	label: string
	value: string
	placeholder?: string
	error?: string
	type?: 'text' | 'password'
	allowSpace?: boolean
}

// 接收 props
const props = defineProps({
	title: {
		type: String,
		required: true
	},
	columns: {
		type: Array as PropType<Column[]>, // 明确类型
		required: true,
		default: () => [] // 提供默认值（空数组，避免 null 引起的问题）
	},
	validate: {
		type: Function as PropType<(value: string, index: number) => string>,
		required: true
	},
	onConfirm: {
		type: Function,
		required: true
	}
})

// 初始化列数据，仅将需要响应的字段提取出来
const initializeColumns = () => {
	props.columns.map(col => ({
		label: col.label,
		value: col.value,
		placeholder: col.placeholder ?? '',
		error: col.error ?? '',
		type: col.type ?? 'text',
		allowSpace: col.allowSpace ?? false
	}))
}

// 输入框失去焦点时处理逻辑
const handleBlur = (column: Column, index: number) => {
	if (!column.allowSpace) {
		column.value = column.value.replace(/\s+/g, '')
	}

	// 调用校验函数并设置错误信息
	column.error = props.validate(column.value, index)
}

onMounted(() => {
	initializeColumns()
})
</script>

<style scoped>
.edit-field-form {
	position: relative;

	h2 {
		text-align: center;
		margin-bottom: 24px;
	}

	.form-item {
		display: grid;
		grid-template-columns: 70px 150px;
		grid-template-rows: 22px 16px;
		grid-column-gap: 8px; /* 设置列间的间隙 */
		align-items: center;
		margin-top: 8px;
	}

	/* 输入框 */

	.input-field {
		border: none;
		border-bottom: 1px solid var(--van-text-color-2);
		font-size: 14px;
		background-color: var(--van-background-3);

		&:focus {
			outline: none;
			border-bottom: 2px solid var(--van-primary-color);
		}
	}

	.error {
		color: var(--van-danger-color);
		font-size: 12px;
		grid-column: 2;
	}

	.button-group {
		margin-top: 16px;
		display: flex;

		button {
			margin-right: 16px;
			font-size: 14px;
		}

		button:last-child {
			margin-right: 0;
		}
	}
}
</style>
