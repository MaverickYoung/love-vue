<template>
  <EditFieldForm
      title="修改昵称"
      :columns="columns"
      :validate="validateUsername"
      :on-confirm="handleConfirm"
  />
</template>

<script setup lang="ts">
import {reactive} from "vue";
import EditFieldForm, {Column} from "@/components/EditFieldForm.vue";
import {useRouter} from "vue-router";
import {useUserInfoSubmitApi} from "@/api/sys/user";
import {useUserStore} from "@/store/user";

// 定义每一列的内容
const columns = reactive([
  {
    label: '昵称',
    value: '',
    placeholder: '请输入昵称 1-50位',
    error: ''
  }
] as Column[]);

const router = useRouter()

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
    await useUserInfoSubmitApi({'nickname': columns[0].value})
    await userStore.getUserInfoAction()
    router.back();
  }
};

const userStore=useUserStore();
</script>
