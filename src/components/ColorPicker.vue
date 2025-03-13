<template>
  <div class="color-picker-container">
    <div class="layout-flex">
      <div
        ref="saturationValue"
        class="saturation-value"
        @mousedown="mousedownColorPalette"
        @touchstart="mousedownColorPalette">
        <div :style="`background-color: hsl(${hue}, 100%, 50%);`">
          <div :style="pointStyle" class="point"></div>
        </div>
        <div class="saturation-value-2"></div>
        <div class="saturation-value-3"></div>
      </div>
      <div class="color-picker-middle">
        <div class="color-slider">
          <div
            ref="hueSlider"
            class="hue-slider slider-item"
            @mousedown="mousedownHue"
            @touchstart="mousedownHue">
            <div :style="hueSliderStyle" class="slider"></div>
          </div>
          <div
            v-if="props.hasAlpha"
            ref="alphaSlider"
            class="alpha-slider slider-item"
            @mousedown="mousedownAlpha"
            @touchstart="mousedownAlpha">
            <div :style="alphaSliderStyle" class="slider"></div>
            <div
              :style="`background: linear-gradient(to bottom, rgba(0,0,0,0), ${colorEnums.rgb});width: 100%;height: 100%`" />
          </div>
        </div>
      </div>
    </div>

    <div class="color-value">
      <div class="hex">
        <p>HEX</p>
        <input :value="colorEnums.hex8" spellcheck="false" @input="hexChange" />
      </div>
      <div class="rgba">
        <p v-if="props.hasAlpha">RGBA</p>
        <p v-else>RGB</p>
        <input :value="red" @input="redChange" />
        <input :value="green" @input="greenChange" />
        <input :value="blue" @input="blueChange" />
        <input v-if="props.hasAlpha" :value="alpha" @input="alphaChange" />
      </div>
    </div>
    <ul class="predefine">
      <li
        v-for="(item, index) in predefine"
        :key="index"
        :style="`background-color: ${item}`"
        class="predefine-item"
        @click="predefineChange(item)" />
    </ul>
    <div class="color-actions">
      <custom-button :color="'warning'" square @click="emits('close')"
        >取 消</custom-button
      >
      <custom-button square @click="handleConfirm">确 认</custom-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, ref, watch } from 'vue';
import {
  hex2rgba,
  hsv2rgb,
  parseColor,
  rgb2hsv,
  Rgba,
  rgba2hex,
} from '@/utlis/color';
import CustomButton from '@/components/CustomButton.vue';

const props = defineProps({
  color: {
    type: [Object, String] as PropType<Rgba | string | null>,
    default() {
      return {
        r: 217,
        g: 128,
        b: 95,
        a: 1,
      };
    },
  },
  predefine: {
    type: Array<string>,
    default() {
      return [
        '#FF4D4F',
        '#FF7A45',
        '#FFC53D',
        '#73D13D',
        '#36CFC9',
        '#40A9FF',
        '#9254DE',
        '#000000',
        '#FFFFFF',
      ];
    },
  },
  hasAlpha: {
    type: Boolean,
    default: true,
  },
  mode: {
    type: String as PropType<'hex6' | 'hex8' | 'rgb' | 'rgba'>,
    default: 'hex8',
  },
});

const emits = defineEmits(['update:color', 'close']);

const saturationValue = ref<HTMLElement | null>(null);
const hueSlider = ref<HTMLElement | null>(null);
const alphaSlider = ref<HTMLElement | null>(null);

const pointStyle = ref('top: 25%;left: 80%;');
const hueSliderStyle = ref('top: 0;');
const alphaSliderStyle = ref('top: 100%;');

const hue = ref(0);
const saturation = ref(1);
const value = ref(1);

const red = ref(255);
const green = ref(0);
const blue = ref(0);

const alpha = ref(1);

onMounted(() => {
  const parsedColor = parseColor(props.color ?? '#FFFFFF');
  if (parsedColor) {
    const { r, g, b, a } = parsedColor;
    red.value = r;
    green.value = g;
    blue.value = b;
    alpha.value = a ?? 1;
  }
});

watch([red, green, blue], () => {
  const { h, s, v } = rgb2hsv(red.value, green.value, blue.value);

  hue.value = h;
  saturation.value = s;
  value.value = v;

  pointStyle.value = `top: ${100 - v * 100}%;left: ${s * 100}%;`;
  hueSliderStyle.value = `top: ${(hue.value / 360) * 100}%;`;
});

watch(alpha, () => {
  alphaSliderStyle.value = `top: ${
    alpha.value >= 1 ? 'calc(100% - 6px)' : alpha.value * 100 + '%'
  };`;
});

const colorEnums = computed(() => {
  const r = red.value;
  const g = green.value;
  const b = blue.value;
  const a = alpha.value;
  const h = hue.value;
  const s = saturation.value;
  const v = value.value;

  return {
    rgb: `rgb(${r},${g},${b})`,
    rgba: `rgba(${r},${g},${b},${a})`,
    hex6: rgba2hex(r, g, b),
    hex8: rgba2hex(r, g, b, a),
    hsv: `hsv(${h},${s},${v})`,
  };
});

const handleConfirm = () => {
  emits('update:color', (colorEnums.value as any)[props.mode]);
};

// 处理色调变化的函数，传入事件对象 e
const mousedownHue = (e: TouchEvent | MouseEvent): void => {
  // 先调用初始处理函数
  handleChangeHue(e);

  // 判断设备类型，添加合适的事件监听器
  if (e instanceof TouchEvent) {
    window.addEventListener('touchmove', handleChangeHue);
    window.addEventListener('touchend', mouseupHue);
  } else {
    window.addEventListener('mousemove', handleChangeHue);
    window.addEventListener('mouseup', mouseupHue);
  }
};

// 处理色调结束的函数，传入事件对象 e
const mouseupHue = (e: TouchEvent | MouseEvent): void => {
  // 判断设备类型，移除合适的事件监听器
  if (e instanceof TouchEvent) {
    window.removeEventListener('touchmove', handleChangeHue);
    window.removeEventListener('touchend', mouseupHue);
  } else {
    window.removeEventListener('mousemove', handleChangeHue);
    window.removeEventListener('mouseup', mouseupHue);
  }
};

// 处理 alpha 变化的函数，传入事件对象 e
const mousedownAlpha = (e: TouchEvent | MouseEvent): void => {
  handleChangeAlpha(e);

  // 判断设备类型，添加合适的事件监听器
  if (e instanceof TouchEvent) {
    window.addEventListener('touchmove', handleChangeAlpha);
    window.addEventListener('touchend', mouseupAlpha);
  } else {
    window.addEventListener('mousemove', handleChangeAlpha);
    window.addEventListener('mouseup', mouseupAlpha);
  }
};

// 处理 alpha 结束的函数，传入事件对象 e
const mouseupAlpha = (e: TouchEvent | MouseEvent): void => {
  // 判断设备类型，移除合适的事件监听器
  if (e instanceof TouchEvent) {
    window.removeEventListener('touchmove', handleChangeAlpha);
    window.removeEventListener('touchend', mouseupAlpha);
  } else {
    window.removeEventListener('mousemove', handleChangeAlpha);
    window.removeEventListener('mouseup', mouseupAlpha);
  }
};

// 鼠标按下处理函数
const mousedownColorPalette = (e: MouseEvent | TouchEvent): void => {
  // 处理颜色调色盘变化
  handleChangeColorPalette(e);

  // 判断事件类型，分别处理鼠标事件和触摸事件
  if (e instanceof MouseEvent) {
    // 为桌面设备添加鼠标移动和鼠标松开事件监听
    window.addEventListener('mousemove', handleChangeColorPalette);
    window.addEventListener('mouseup', mouseupColorPalette);
  } else if (e instanceof TouchEvent) {
    // 为触摸设备添加触摸移动和触摸结束事件监听
    window.addEventListener('touchmove', handleChangeColorPalette);
    window.addEventListener('touchend', mouseupColorPalette);
  }
};

// 鼠标松开处理函数
const mouseupColorPalette = (e: MouseEvent | TouchEvent): void => {
  // 判断事件类型，移除相应的事件监听器
  if (e instanceof MouseEvent) {
    window.removeEventListener('mousemove', handleChangeColorPalette);
    window.removeEventListener('mouseup', mouseupColorPalette);
  } else if (e instanceof TouchEvent) {
    window.removeEventListener('touchmove', handleChangeColorPalette);
    window.removeEventListener('touchend', mouseupColorPalette);
  }
};

// 色调变化处理函数
const handleChangeHue = (e: MouseEvent | TouchEvent): void => {
  if (!hueSlider.value || !saturationValue.value) {
    return;
  }

  let h = hueSlider.value.clientHeight;
  let y: number;

  // 处理触摸事件和鼠标事件
  if (e instanceof MouseEvent) {
    y = e.pageY - saturationValue.value.getBoundingClientRect().top;
  } else if (e instanceof TouchEvent) {
    // 对于触摸事件，计算触摸点的 y 坐标
    const touch = e.touches[0]; // 获取第一个触摸点
    y = touch.pageY - saturationValue.value.getBoundingClientRect().top;
  } else {
    return; // 其他不支持的事件类型
  }

  // 边界检查，确保 x 在有效范围内
  y = Math.max(0, Math.min(h, y));

  // 计算色调（hue）值，范围是 [0, 360]
  hue.value = Math.floor((y / h) * 360 + 0.5);

  // hsv转化为rgb
  const { r, g, b } = hsv2rgb(hue.value, saturation.value, value.value);

  red.value = r;
  green.value = g;
  blue.value = b;

  // 移动滑块
  hueSliderStyle.value = `top: ${y >= h ? h : y}px;`;
};

// 透明度变化处理函数
const handleChangeAlpha = (e: MouseEvent | TouchEvent): void => {
  if (!alphaSlider.value || !saturationValue.value) {
    return;
  }

  let h = alphaSlider.value.clientHeight;
  let y: number;

  // 处理鼠标事件和触摸事件
  if (e instanceof MouseEvent) {
    y = e.pageY - saturationValue.value.getBoundingClientRect().top;
  } else if (e instanceof TouchEvent) {
    // 处理触摸事件，获取触摸点的水平坐标
    const touch = e.touches[0];
    y = touch.pageY - saturationValue.value.getBoundingClientRect().top;
  } else {
    return; // 如果是其他类型的事件，直接返回
  }

  // 边界检查，确保 y 在有效范围内
  y = Math.max(0, Math.min(h, y));

  // 计算透明度，范围是 [0, 1]
  alpha.value = Math.floor((y / h) * 100 + 0.5) / 100;

  // 移动滑块
  alphaSliderStyle.value = `top: ${y >= h ? h : y}px;`;
};

// 计算选中点的颜色值
const handleChangeColorPalette = (e: MouseEvent | TouchEvent): void => {
  if (!saturationValue.value) {
    return;
  }

  let w = saturationValue.value.clientWidth;
  let h = saturationValue.value.clientHeight;
  let x: number, y: number;

  // 处理鼠标事件和触摸事件
  if (e instanceof MouseEvent) {
    x = e.pageX - saturationValue.value.getBoundingClientRect().left;
    y = e.pageY - saturationValue.value.getBoundingClientRect().top;
  } else if (e instanceof TouchEvent) {
    const touch = e.touches[0]; // 获取第一个触摸点
    x = touch.pageX - saturationValue.value.getBoundingClientRect().left;
    y = touch.pageY - saturationValue.value.getBoundingClientRect().top;
  } else {
    return; // 处理其他类型的事件
  }

  // 边界检查，确保 x 和 y 在有效范围内
  x = Math.max(0, Math.min(w, x));
  y = Math.max(0, Math.min(h, y));

  // 计算饱和度和亮度
  saturation.value = Math.floor((x / w) * 100 + 0.5) / 100;
  value.value = Math.floor((1 - y / h) * 100 + 0.5) / 100;

  // hsv转化为rgb
  const { r, g, b } = hsv2rgb(hue.value, saturation.value, value.value);

  red.value = r;
  green.value = g;
  blue.value = b;

  // 移动背景板圆圈
  pointStyle.value = `top: ${y}px; left: ${x}px;`;
};

const hexChange = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const v = target.value;
  if (/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)) {
    const { r, g, b, a } = hex2rgba(v);
    red.value = r;
    green.value = g;
    blue.value = b;
    alpha.value = a ?? 1;
  }
};

const redChange = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const v = target.value;
  const numValue = parseInt(v); // 转换字符串为数字

  if (v !== '') {
    if (numValue > 255) {
      red.value = 255;
    } else if (numValue < 0) {
      red.value = 0;
    } else if (numValue >= 0 && numValue <= 255) {
      red.value = numValue;
    }
  }
};

const greenChange = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const v = target.value;
  const numValue = parseInt(v); // 转换字符串为数字

  if (v !== '') {
    if (numValue > 255) {
      red.value = 255;
    } else if (numValue < 0) {
      red.value = 0;
    } else if (numValue >= 0 && numValue <= 255) {
      red.value = numValue;
    }
  }
};

const blueChange = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const v = target.value;
  const numValue = parseInt(v); // 转换字符串为数字

  if (v !== '') {
    if (numValue > 255) {
      red.value = 255;
    } else if (numValue < 0) {
      red.value = 0;
    } else if (numValue >= 0 && numValue <= 255) {
      red.value = numValue;
    }
  }
};

const alphaChange = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const v = target.value;
  const numValue = parseInt(v); // 转换字符串为数字

  if (v !== '') {
    if (numValue > 255) {
      red.value = 255;
    } else if (numValue < 0) {
      red.value = 0;
    } else if (numValue >= 0 && numValue <= 255) {
      red.value = numValue;
    }
  }
};

// 点击预设方块事件
const predefineChange = (item: string): void => {
  if (/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(item)) {
    const { r, g, b, a } = hex2rgba(item);
    red.value = r;
    green.value = g;
    blue.value = b;
    alpha.value = a ?? 1;
  }
};
</script>

<style scoped>
.color-picker-container {
  position: relative;
  user-select: none;
  width: 200px;
  background: var(--van-background);
  padding: 16px;
  border-radius: 8px;
}

.layout-flex {
  display: flex;
  flex-direction: row;
  height: 150px;
  margin-bottom: 8px;
}

/* 饱和度和亮度 */
.saturation-value {
  width: 150px;
  height: 100%;
  position: relative;
  margin-right: 10px;
}

.saturation-value > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 圆圈 */
.point {
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  z-index: 9;
}

.saturation-value-2 {
  background: linear-gradient(to right, white, #ffffff00);
}

.saturation-value-3 {
  background: linear-gradient(to top, black, #ffffff00);
}

/* 色调 透明度 */
.color-picker-middle {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.slider-item + .slider-item {
  margin-left: 8px;
}

/* 色调滑块条 */
.hue-slider {
  position: relative;
  width: 16px;
  background: linear-gradient(
    180deg,
    red 0,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    red
  );
  box-shadow: 1px 1px 1px var(--box-shadow-top);
  height: 100%;
}

/* 透明度滑块条 */
.alpha-slider {
  position: relative;
  width: 16px;
  box-shadow: 1px 1px 1px var(--box-shadow-top);
  background: #fff
    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRIiWM8fubkfwYygKWJOSM5+mCAhRLNoxaPWjxq8ajFoxbTyeL/DAfJ0Xjs3Cl7Siwmu4Yht1aDgZEYx6MWj1o8avGoxaMWD3qLya5X//4nqx6HAQC7RBGFzolqTAAAAABJRU5ErkJggg==');
  background-size: 10px 10px;
  height: 100%;
}

/* 滑块 */
.slider {
  position: absolute;
  top: 50%;
  left: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
  height: 6px;
  width: 120%;
  background-color: #fff;
  transform: translate(-50%, -50%);
}

.color-slider {
  flex: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* 颜色的值 hex rgba */
.color-value {
  * {
    background-color: var(--van-background-2);
  }

  p {
    font-size: 14px;
    text-align: center;
    height: 24px;
    line-height: 24px;
    color: var(--van-text-color-2);
    width: 60px;
    border-right: 1px solid var(--van-text-color-3);
    margin-right: 5px;
  }

  div {
    display: flex;
    border-radius: 4px;
    padding: 2px;
    margin: 8px 0;
  }

  input {
    flex: 1;
    width: 30px;
    font-size: 14px;
    height: 24px;
    outline: none;
    text-align: center;
    border-radius: 0;
    border: 0;

    &:focus {
      box-shadow: inset 0 0 0 1px var(--van-primary-color);
    }
  }
}

/* 预设颜色  */
.predefine {
  width: 100%;
  margin: 10px 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.predefine-item {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin: 8px;
}

.predefine-item:nth-child(1n) {
  margin-left: 0; /* 确保新行第一个项左边距为 0 */
}

.predefine-item:last-child {
  margin-right: 0; /* 最后一项右边距为 0 */
}

.color-actions {
  display: flex;
  height: 36px;
  padding: 0 2px;
  margin-top: 8px;

  * {
    margin-right: 24px;
    font-size: 14px !important;
    word-spacing: 8px !important;
  }

  *:last-child {
    margin-right: 0;
  }
}
</style>
