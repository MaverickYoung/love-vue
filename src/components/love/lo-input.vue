<template>
  <div class="lo-input" :class="{'focused':isFocused,'showPassword':isPassword}">
    <lo-icon v-if="icon"
             :icon="icon"
             size="2rem"
             color="currentColor"
             class="lo-input-icon"
             style="left: .7rem;"/>

    <input :type="inputType"
           :placeholder="placeholder"
           :style="isPassword?{paddingRight:'3.5rem'}:{paddingRight:'1rem'}"
           @focus="isFocused=true"
           @blur="isFocused=false"
           ref="input">
    <div v-if="isPassword" class="eye-wrapper" ref="eye" @click="toggleShowPassword">
      <lo-icon icon="eye"
               size="2rem"
               color="currentColor"
               class="lo-input-icon"
      />
      <div v-if="showPassword" class="eye-slash-wrapper">
        <div class="eye-slash-background"/>
        <div class="eye-slash"/>
      </div>
    </div>

    <lo-icon v-if="isCheck&&!isFocused"
             :icon="onCheck?'right':'wrong'"
             size="2rem"
             class="lo-input-icon"
             style="right: -2.5rem;"/>
  </div>
</template>

<script setup lang="ts">
import LoIcon from "@/components/love/lo-icon.vue";
import {computed, onBeforeUnmount, onMounted, PropType, ref, useAttrs} from "vue";

const props = defineProps({
  icon: String,
  onCheck: Function as PropType<(...args: any[]) => boolean>,
  placeholder: String
})

const attrs = useAttrs()
const value = defineModel({
  type: String
})

const isFocused = ref(false)
const showPassword = ref(false)

const isPassword = computed(() => attrs.password === '' || attrs.password === true);
const isCheck = computed(() => attrs.check === '' || attrs.check === true);
const inputType = computed(() => isPassword.value ? (showPassword.value ? 'text' : 'password') : 'text');

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
  if (!isFocused.value) {
    isFocused.value = true
    input.value?.focus();
  }
}
let isClickingEye = false;
const input = ref<HTMLInputElement | null>()
const eye = ref<HTMLDivElement | null>()

const onMouseDown = (event: MouseEvent) => detectEyeClick(event.target as Node);

const onTouchStart = (event: TouchEvent) => detectEyeClick(event.target as Node);

const detectEyeClick = (target: Node | null) => {
  isClickingEye = !!(eye.value && eye.value.contains(target));
};

const onBlur = (event: FocusEvent) => {
  // 如果是点击了 eye，则阻止失去焦点
  if (isClickingEye) {
    event.preventDefault();  // 阻止焦点丧失
    input.value?.focus();  // 重新聚焦到 input 元素
  }
};

onMounted(() => {
  // 监听鼠标点击事件
  window.addEventListener('mousedown', onMouseDown);

  // 监听触摸事件
  window.addEventListener('touchstart', onTouchStart);

  if (input.value) {
    // 监听输入框的失去焦点事件
    input.value.addEventListener('blur', onBlur);
  }
});

onBeforeUnmount(() => {
  // 清理事件监听
  window.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('touchstart', onTouchStart);

  if (input.value) {
    input.value.removeEventListener('blur', onBlur);
  }
});
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
    transition: .3s ease;
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