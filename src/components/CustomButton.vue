<template>
  <button
      class="custom-button"
      :class="{ square }"
      :style="buttonStyle"
      @click="handleClick"
  >
    <slot></slot> <!-- 插槽，用来传递按钮文字 -->
  </button>
</template>

<script setup lang="ts">

// 定义按钮颜色的枚举值
import {computed, PropType} from "vue";

const colorMap = {
  primary: '--van-primary-color',
  success: '--van-success-color',
  danger: '--van-danger-color',
  warning: '--van-warning-color',
}

// 接受外部传递的属性
const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'success' | 'danger' | 'warning'>,
    default: 'primary', // 默认颜色
  },
  backgroundColor: {
    type: String,
    default: '', // 自定义颜色
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
    default: false, // 默认不是方形按钮
  },
})

// 计算按钮的背景颜色
const buttonStyle = computed(() => {
  const backgroundColor = props.backgroundColor || `var(${colorMap[props.color]})`

  return {
    backgroundColor: backgroundColor,
    width: props.width,
    height: props.height,
    borderRadius: props.square ? '4px' : '50px', // 动态设置圆角值
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
