<template>
  <div
    :class="{ focused: isFocused, showPassword: isPassword }"
    class="lo-input">
    <lo-icon
      v-if="icon"
      :icon="icon"
      class="lo-input-icon"
      color="currentColor"
      size="2rem"
      style="left: 0.7rem" />

    <input
      ref="input"
      v-model="value"
      :placeholder="placeholder"
      :style="
        isPassword ? { paddingRight: '3.5rem' } : { paddingRight: '1rem' }
      "
      :type="inputType"
      @blur="isFocused = false"
      @focus="isFocused = true" />
    <div
      v-if="isPassword"
      ref="eye"
      class="eye-wrapper"
      @mousedown.prevent="toggleShowPassword">
      <lo-icon
        class="lo-input-icon"
        color="currentColor"
        icon="eye"
        size="2rem" />
      <div v-if="showPassword" class="eye-slash-wrapper">
        <div class="eye-slash-background" />
        <div class="eye-slash" />
      </div>
    </div>

    <lo-icon
      v-if="isCheck && !isFocused"
      :icon="onCheck ? 'right' : 'wrong'"
      class="lo-input-icon"
      size="2rem"
      style="right: -2.5rem" />
  </div>
</template>

<script lang="ts" setup>
import LoIcon from '@/components/love/lo-icon.vue';
import { computed, PropType, ref, useAttrs } from 'vue';

const props = defineProps({
  icon: String,
  onCheck: Function as PropType<(...args: any[]) => boolean>,
  placeholder: String,
});

const attrs = useAttrs();
const value = defineModel({
  type: String,
});

const isFocused = ref(false);
const showPassword = ref(false);

const isPassword = computed(
  () => attrs.password === '' || attrs.password === true,
);
const isCheck = computed(() => attrs.check === '' || attrs.check === true);
const inputType = computed(() =>
  isPassword.value ? (showPassword.value ? 'text' : 'password') : 'text',
);

const toggleShowPassword = () => {
  // 聚焦到 body 元素，间接使其他输入框失去焦点
  document.body.focus();

  showPassword.value = !showPassword.value;
  input.value?.focus(); // 重新聚焦到 input 元素
  const length = input.value?.value.length ?? 0;
  input.value?.setSelectionRange(length, length); // 设置光标位置到末尾
};

const input = ref<HTMLInputElement | null>();
const eye = ref<HTMLDivElement | null>();
</script>

<style scoped>
.lo-input {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--greyDark);
  /* 字体无法选中 */
  user-select: none;

  input {
    width: 18rem;
    height: 4rem;
    border: none;
    border-radius: 1rem;
    font-size: 1.4rem;
    padding-left: 3.8rem;
    box-shadow: var(--inner-shadow);
    background: none;
    font-family: inherit;
    color: var(--greyDark);

    &::placeholder {
      color: var(--greyLight-3);
    }
  }

  .lo-input-icon {
    position: absolute;
    transition: 0.3s ease;
  }

  .eye-wrapper {
    position: absolute;
    right: 1.8rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .eye-slash-wrapper {
      width: 2rem;
      height: 2rem;
      position: absolute;
      display: inline-block;

      .eye-slash-background,
      .eye-slash {
        position: absolute;
        width: 0;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        animation: slash-appear 0.3s forwards;
      }

      .eye-slash-background {
        height: 3px;
        background-color: var(--van-background);
      }

      .eye-slash {
        height: 1px;
        background: currentColor;
      }
    }
  }
}

@keyframes slash-appear {
  to {
    width: 100%;
  }
}

.focused {
  input {
    outline: none;
    box-shadow: var(--shadow);
  }

  color: var(--primary);
}
</style>
