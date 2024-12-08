<template>
  <form class="edit-field-form">
    <h2>{{ title }}</h2>
    <div v-for="(column, index) in columns" :key="index" class="form-item">
      <div class="label">{{ column.label }}</div>
      <input
          v-model="column.value"
          :type="column.type || 'text'"
          :placeholder="column.placeholder"
          @blur="handleBlur(column, index)"
          class="input-field"
      />
      <p v-if="column.error" class="error">{{ column.error }}</p>
    </div>

    <div class="button-group">
      <custom-button color="danger" @click="router.back()">返 回</custom-button>
      <custom-button @click="onConfirm()">确 认</custom-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {onMounted, PropType} from "vue";
import {router} from "@/router";
import CustomButton from "@/components/CustomButton.vue";

export interface Column {
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  type?: "text" | "password";
  allowSpace?: boolean;
}

// 接收 props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  columns: {
    type: Array as PropType<Column[]>, // 明确类型
    required: true,
    default: () => [], // 提供默认值（空数组，避免 null 引起的问题）
  },
  validate: {
    type: Function as PropType<(value: string, index: number) => string>,
    required: true,
  },
  onConfirm: {
    type: Function,
    required: true,
  },
});

// 初始化列数据，仅将需要响应的字段提取出来
const initializeColumns = () => {
  props.columns.map((col) => ({
    label: col.label,
    value: col.value,
    placeholder: col.placeholder ?? "",
    error: col.error ?? "",
    type: col.type ?? "text",
    allowSpace: col.allowSpace ?? false,
  }))
};

// 输入框失去焦点时处理逻辑
const handleBlur = (column: Column, index: number) => {
  if (!column.allowSpace) {
    column.value = column.value.replace(/\s+/g, "");
  }

  // 调用校验函数并设置错误信息
  column.error = props.validate(column.value, index);
};

onMounted(() => {
  initializeColumns();
})
</script>

<style scoped>
.edit-field-form {
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
