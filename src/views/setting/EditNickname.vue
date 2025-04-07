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
	<EditFieldForm :columns="columns" :on-confirm="handleConfirm" :validate="validateUsername" title="修改昵称" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import EditFieldForm, { Column } from '@/components/EditFieldForm.vue';
import { useRouter } from 'vue-router';
import { useUserInfoSubmitApi } from '@/api/sys/user';
import { useUserStore } from '@/store/user';

// 定义每一列的内容
const columns = reactive([
	{
		label: '昵称',
		value: '',
		placeholder: '请输入昵称 1-50位',
		error: ''
	}
] as Column[]);

const router = useRouter();

// 校验函数
const validateUsername = (value: string, index: number) => {
	// 校验长度
	if (value.length < 1 || value.length > 50) {
		return '昵称长度应为1到50位';
	}
	return '';
};

// 确认按钮处理
const handleConfirm = async () => {
	// 进行前端校验
	const validationErrors: string[] = [];
	columns.forEach((column, index) => {
		const error = validateUsername(column.value, index);
		if (error) {
			validationErrors.push(error);
		}
	});

	// 处理校验错误
	if (validationErrors.length == 0) {
		await useUserInfoSubmitApi({ nickname: columns[0].value });
		await userStore.getUserInfoAction();
		router.back();
	}
};

const userStore = useUserStore();
</script>
