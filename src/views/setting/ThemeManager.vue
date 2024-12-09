<template>
  <div class="theme-manager-container">
    <h2>主题配置</h2>
    <div class="info-item">
      <div class="label">主题切换</div>
      <label>
        <input
            type="radio"
            name="themeOptions"
            value="light"
            v-model="selectedTheme"
        />
        <span class="option">亮色</span>
      </label>
      <label>
        <input
            type="radio"
            name="themeOptions"
            value="dark"
            v-model="selectedTheme"
        />
        <span class="option">暗色</span>
      </label>
      <div class="slider"></div>
    </div>

    <br/>
    <div>
      <div class="info-item">
        <div class="label">主要背景色</div>
        <div class="value">
          <van-popover v-model:show="showPopover" placement="left">
            <color-picker :color="backgroundColor" @update:color="onUpdateBackground"/>
            <template #reference>
              <div class="color-box"
                   :style="{ backgroundColor: backgroundColor }"/>
            </template>
          </van-popover>
        </div>
      </div>

      <div class="info-item">
        <div class="label">次要背景色</div>
        <div class="value">
          <van-popover v-model:show="showPopover2" placement="left">
            <color-picker :color="backgroundColor2" @update:color="onUpdateBackground2"/>
            <template #reference>
              <div class="color-box"
                   :style="{ backgroundColor: backgroundColor2 }"/>
            </template>
          </van-popover>
        </div>
      </div>

      <div class="info-item">
        <div class="label">辅助背景色</div>
        <div class="value">
          <van-popover v-model:show="showPopover3" placement="left">
            <color-picker :color="backgroundColor3" @update:color="onUpdateBackground3"/>
            <template #reference>
              <div class="color-box"
                   :style="{ backgroundColor: backgroundColor3 }"/>
            </template>
          </van-popover>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">

import {useAppStore} from "@/store/app";
import {onMounted, ref} from "vue";
import ColorPicker from "@/components/ColorPicker.vue";

const appStore = useAppStore()
const selectedTheme = ref('light');

const backgroundColor = ref<string>();
const backgroundColor2 = ref<string>();
const backgroundColor3 = ref<string>();

const showPopover = ref(false);
const showPopover2 = ref(false);
const showPopover3 = ref(false);

const onUpdateBackground = (color: string) => {
  showPopover.value = false;
  backgroundColor.value = color;
}

const onUpdateBackground2 = (color: string) => {
  showPopover2.value = false;
  backgroundColor2.value = color;
}

const onUpdateBackground3 = (color: string) => {
  showPopover3.value = false;
  backgroundColor3.value = color;
}

onMounted(() => {
  backgroundColor.value = appStore.theme.styles['--van-background'];
  backgroundColor2.value = appStore.theme.styles['--van-background-2'];
  backgroundColor3.value = appStore.theme.styles['--van-background-3'];
})

</script>

<style scoped>
.theme-manager-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h2 {
    margin-bottom: 20px;
  }

  /* 子容器样式 */

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 250px;
    padding: 10px;
    border: 1px solid var(--van-border-color);
    border-radius: 8px;
    margin: 8px 0;

    /* 标签样式 */

    .label {
      font-weight: bold;
      text-align: left;
      flex: 1;
    }

    /* 值样式 */

    .value {
      color: var(--van-text-color-2);
      text-align: right;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      /* 添加 ">" 符号 */

      &::after {
        content: ">";
        margin-left: 8px;
      }

      .color-box {
        position: relative;
        width: 16px;
        height: 16px;
        border-radius: 3px;
        overflow: hidden;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRIiWM8fubkfwYygKWJOSM5+mCAhRLNoxaPWjxq8ajFoxbTyeL/DAfJ0Xjs3Cl7Siwmu4Yht1aDgZEYx6MWj1o8avGoxaMWD3qLya5X//4nqx6HAQC7RBGFzolqTAAAAABJRU5ErkJggg==');
        background-size: 16px 16px;
      }
    }
  }
}

</style>