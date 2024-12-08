<template>
  <div class="color-select">
    <div class="saturation-value" ref="saturationValue" @mousedown="mousedownColorPalette"
         @touchstart="mousedownColorPalette">
      <div :style="`background-color: hsl(${hue}, 100%, 50%);`">
        <div class="point" :style="pointStyle"></div>
      </div>
      <div class="saturation-value-2"></div>
      <div class="saturation-value-3"></div>
    </div>
    <div class="color-select-middle">
      <div class="color-slider">
        <div class="hue-slider slider-item" ref="hueSlider" @mousedown="mousedownHue" @touchstart="mousedownHue">
          <div class="slider" :style="hueSliderStyle"></div>
        </div>
        <div class="alpha-slider slider-item" ref="alphaSlider" @mousedown="mousedownAlpha" @touchstart="mousedownAlpha"
             v-if="props.hasAlpha">
          <div class="slider" :style="alphaSliderStyle"></div>
          <div
              :style="`background: linear-gradient(to right, rgba(0,0,0,0), ${colorEnums.rgb});width: 100%;height: 100%`"
          ></div>
        </div>
      </div>
      <div class="color-diamond">
        <div
            :style="`background-color: ${colorEnums.rgba};width: 100%;height: 100%;box-shadow: inset 0 0 0 1px rgba(0, 0, 0, .15), inset 0 0 4px rgba(0, 0, 0, .25);`"
        ></div>
      </div>
    </div>
    <div class="color-value">
      <div class="hex">
        <label>
          <input :value="colorEnums.hex8" @input="hexChange" spellcheck="false"/>
        </label>
        <p>Hex</p>
      </div>
      <div class="rgba-r">
        <label>
          <input :value="red" @input="redChange"/>
        </label>
        <p>R</p>
      </div>
      <div class="rgba-g">
        <label>
          <input :value="green" @input="greenChange"/>
        </label>
        <p>G</p>
      </div>
      <div class="rgba-b">
        <label>
          <input :value="blue" @input="blueChange"/>
        </label>
        <p>B</p>
      </div>
      <div class="rgba-a" v-if="props.hasAlpha">
        <label>
          <input :value="alpha" @input="alphaChange"/>
        </label>
        <p>A</p>
      </div>
    </div>
    <ul class="predefine">
      <li
          class="predefine-item"
          v-for="(item,index) in predefine"
          :key="index"
          :style="`background-color: ${item}`"
          @click="predefineChange(item)"
      ></li>
    </ul>
    <div class="color-actions">
      <span class="cancel" @click="emits('close')">取消</span>
      <span class="confirm" @click="handleConfirm">确定</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, watch, onMounted, PropType} from 'vue'
import {hex2rgba, hsv2rgb, parseColor, rgb2hsv, Rgba, rgba2hex} from "@/utlis/color";


const props = defineProps({
  color: {
    type: Object as PropType<Rgba | string>,
    default() {
      return {
        r: 217,
        g: 128,
        b: 95,
        a: 1
      }
    }
  },
  predefine: {
    type: Array<string>,
    default() {
      return []
    }
  },
  hasAlpha: {
    type: Boolean,
    default: true
  },
  mode: {
    type: String,
    default: 'hex6' // hex6/hex8/rgb/rgba
  }
})

const emits = defineEmits(['update:color', 'close'])

const saturationValue = ref<HTMLElement | null>(null);
const hueSlider = ref<HTMLElement | null>(null);
const alphaSlider = ref<HTMLElement | null>(null);

const pointStyle = ref('top: 25%;left: 80%;');
const hueSliderStyle = ref('left: 0;');
const alphaSliderStyle = ref('left: calc(100% - 6px);');

const hue = ref(0);
const saturation = ref(1);
const value = ref(1);

const red = ref(255);
const green = ref(0);
const blue = ref(0);

const alpha = ref(1);

onMounted(() => {
  const parsedColor = parseColor(props.color);
  if (parsedColor) {
    const {r, g, b, a} = parsedColor;
    red.value = r;
    green.value = g;
    blue.value = b;
    alpha.value = a ?? 1;
  }
});

watch([red, green, blue], () => {
  const {h, s, v} = rgb2hsv(red.value, green.value, blue.value);

  hue.value = h;
  saturation.value = s;
  value.value = v;

  pointStyle.value = `top: ${100 - v * 100}%;left: ${s * 100}%;`;
  hueSliderStyle.value = `left: ${(hue.value / 360) * 100}%;`;
});

watch(alpha, () => {
  alphaSliderStyle.value = `left: ${
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

  let w = hueSlider.value.clientWidth;
  let x: number;

  // 处理触摸事件和鼠标事件
  if (e instanceof MouseEvent) {
    x = e.pageX - saturationValue.value.getBoundingClientRect().left;
  } else if (e instanceof TouchEvent) {
    // 对于触摸事件，计算触摸点的 x 坐标
    const touch = e.touches[0]; // 获取第一个触摸点
    x = touch.pageX - saturationValue.value.getBoundingClientRect().left;
  } else {
    return; // 其他不支持的事件类型
  }

  // 边界检查，确保 x 在有效范围内
  x = Math.max(0, Math.min(w, x));

  // 计算色调（hue）值，范围是 [0, 360]
  hue.value = Math.floor((x / w) * 360 + 0.5);

  // hsv转化为rgb
  const {r, g, b} = hsv2rgb(hue.value, saturation.value, value.value);

  red.value = r;
  green.value = g;
  blue.value = b;

  // 移动滑块
  hueSliderStyle.value = `left: ${x >= w - 6 ? w - 6 : x}px;`;
};

// 透明度变化处理函数
const handleChangeAlpha = (e: MouseEvent | TouchEvent): void => {
  if (!alphaSlider.value || !saturationValue.value) {
    return;
  }

  let w = alphaSlider.value.clientWidth;
  let x: number;

  // 处理鼠标事件和触摸事件
  if (e instanceof MouseEvent) {
    x = e.pageX - saturationValue.value.getBoundingClientRect().left;
  } else if (e instanceof TouchEvent) {
    // 处理触摸事件，获取触摸点的水平坐标
    const touch = e.touches[0];
    x = touch.pageX - saturationValue.value.getBoundingClientRect().left;
  } else {
    return; // 如果是其他类型的事件，直接返回
  }

  // 边界检查，确保 x 在有效范围内
  x = Math.max(0, Math.min(w, x));

  // 计算透明度，范围是 [0, 1]
  alpha.value = Math.floor((x / w) * 100 + 0.5) / 100;

  // 移动滑块
  alphaSliderStyle.value = `left: ${x >= w - 6 ? w - 6 : x}px;`;
}


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
  const {r, g, b} = hsv2rgb(hue.value, saturation.value, value.value);

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
    const {r, g, b, a} = hex2rgba(v);
    red.value = r;
    green.value = g;
    blue.value = b;
    alpha.value = a ?? 1;
  }
};

const redChange = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  const v = target.value;
  const numValue = parseInt(v);  // 转换字符串为数字

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
  const numValue = parseInt(v);  // 转换字符串为数字

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
  const numValue = parseInt(v);  // 转换字符串为数字

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
  const numValue = parseInt(v);  // 转换字符串为数字

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
    const {r, g, b, a} = hex2rgba(item);
    red.value = r;
    green.value = g;
    blue.value = b;
    alpha.value = a ?? 1;
  }
};


</script>

<style scoped>

.color-select {
  position: relative;
  user-select: none;
  width: 300px;
  background: #fff;
  padding: 10px;
  /*border: 1px solid #ccc;*/
  /*border-radius: 10px;*/
}

/* 饱和度和亮度 */
.saturation-value {
  cursor: pointer;
  width: 100%;
  height: 200px;
  position: relative;
  margin-bottom: 10px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
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
  width: 6px;
  height: 6px;
  background-color: transparent;
  border: 2px solid #ccc;
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
.color-select-middle {
  width: 100%;
  display: flex;
  margin-bottom: 10px;
}

.slider-item + .slider-item {
  margin-top: 6px;
}

/* 色调滑块条 */
.hue-slider {
  position: relative;
  height: 10px;
  background: linear-gradient(90deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  width: 100%;
}

/* 透明度滑块条 */
.alpha-slider {
  position: relative;
  height: 10px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  background: #fff url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRIiWM8fubkfwYygKWJOSM5+mCAhRLNoxaPWjxq8ajFoxbTyeL/DAfJ0Xjs3Cl7Siwmu4Yht1aDgZEYx6MWj1o8avGoxaMWD3qLya5X//4nqx6HAQC7RBGFzolqTAAAAABJRU5ErkJggg==');
  background-size: 10px 10px;
  width: 100%;
}

/* 滑块 */
.slider {
  position: absolute;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
  width: 6px;
  height: 100%;
  background-color: #fff;
}

.color-slider {
  flex: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* 颜色方块 */
.color-diamond {
  position: relative;
  margin-left: 5px;
  width: 26px;
  height: 26px;
  border-radius: 3px;
  overflow: hidden;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVRIiWM8fubkfwYygKWJOSM5+mCAhRLNoxaPWjxq8ajFoxbTyeL/DAfJ0Xjs3Cl7Siwmu4Yht1aDgZEYx6MWj1o8avGoxaMWD3qLya5X//4nqx6HAQC7RBGFzolqTAAAAABJRU5ErkJggg==');
  background-size: 10px 10px;
}

/* 颜色的值 hex rgba */
.color-value {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.color-value div {
  padding: 0 3px;
  text-align: center;
}

.color-value input {
  font-size: 12px;
  box-sizing: border-box;
  width: 34px;
  height: 24px;
  padding: 0;
  margin: 0;
  outline: none;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
}

.color-value p {
  font-size: 12px;
  margin: 3px 0 0;
}

.color-value .rgba-a {
  padding-right: 0;
}

.color-value .hex {
  flex: 1;
  padding-left: 0;
}

.color-value .hex input {
  width: 100%;
  height: 24px;
}

/* 预设颜色  */
.predefine {
  width: 100%;
  padding: 0;
  margin: 10px 0 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.predefine-item {
  width: 20px;
  height: 20px;
  margin-bottom: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.predefine-item + .predefine-item {
  margin-left: 6px;
}

.predefine-item:nth-child(12n) {
  margin-left: 0;
}

.color-actions {
  font-size: 12px;
  text-align: right;
}

.color-actions span {
  padding: 5px 12px;
  line-height: 12px;
  display: inline-block;
  box-sizing: border-box;
  border: 1px solid transparent;
}

.color-actions .cancel:hover {
  background-color: #f5f7fa;
}

.color-actions .confirm {
  border-color: #dcdfe6;
  border-radius: 4px;
  margin-left: 10px;
}

.color-actions .confirm:hover {
  color: #1677ff;
  border-color: #1677ff;
}
</style>
