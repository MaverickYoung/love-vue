<template>
  <EditFieldForm
      title="修改用户名"
      :columns="columns"
      :validate="validateFields"
      :on-confirm="handleConfirm"
  />
</template>

<script setup lang="ts">
import {reactive} from "vue";
import EditFieldForm, {Column} from "@/components/EditFieldForm.vue";
import {useUserInfoSubmitApi} from "@/api/sys/user";
import {useRouter} from "vue-router";
import {useUserStore} from "@/store/user";

// 定义每一列的内容
const columns = reactive([
  {
    label: '用户名',
    placeholder: '请输入用户名 2-50位',
    value: ''
  }
] as Column[]);

// 校验函数
const validateFields = (value: string, index: number) => {
  // 校验长度
  if (value.length < 2 || value.length > 50) {
    return '用户名长度应为2到50位';
  }
  return '';
};

const router = useRouter()

// 确认按钮处理
const handleConfirm = async () => {
  // 进行前端校验
  const validationErrors: string[] = [];
  columns.forEach((column, index) => {
    const error = validateFields(column.value, index);
    if (error) {
      validationErrors.push(error);
    }
  });

  // 处理校验错误
  if (validationErrors.length == 0) {
    await useUserInfoSubmitApi({username: columns[0].value})
    await userStore.getUserInfoAction()
    router.back();
  }
};

const userStore=useUserStore();
</script>
