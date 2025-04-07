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
	<EditFieldForm :columns="columns" :on-confirm="handleConfirm" :validate="validateFields" title="修改密码" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import EditFieldForm, { Column } from '@/components/EditFieldForm.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useUpdatePasswordApi } from '@/api/sys/user'

// 定义每一列的内容
const columns = reactive([
	{
		label: '原密码',
		value: '',
		placeholder: '请输入原密码',
		error: ''
	},
	{
		label: '新密码',
		value: '',
		placeholder: '请输入新密码 4-20位',
		error: ''
	},
	{
		label: '确认密码',
		value: '',
		placeholder: '请再次输入新密码',
		error: ''
	}
] as Column[])
const router = useRouter()

// 校验函数：检查密码和确认密码是否一致
const validateFields = (value: string, index: number) => {
	if (index === 1) {
		// 校验密码字段
		if (value.length < 4 || value.length > 20) {
			return '密码长度应为4到20位'
		}
	} else if (index === 2) {
		// 校验确认密码字段
		const password = columns[1].value // 获取密码字段的值
		if (value !== password) {
			return '确认密码与新密码不一致'
		}
	}
	// 如果没有错误，返回空字符串
	return ''
}

// 确认按钮处理
const handleConfirm = async () => {
	// 进行前端校验
	const validationErrors: string[] = []
	columns.forEach((column, index) => {
		const error = validateFields(column.value, index)
		if (error) {
			validationErrors.push(error)
		}
	})

	// 处理校验错误
	if (validationErrors.length == 0) {
		await useUpdatePasswordApi({
			password: columns[0].value,
			newPassword: columns[1].value
		})
		await userStore.getUserInfoAction()
		router.back()
	}
}

const userStore = useUserStore()
</script>
