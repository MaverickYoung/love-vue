<template>
  <div v-if="icon" class="love-icon">
    <svg :style="svgStyle" aria-hidden="true">
      <use :xlink:href="iconName"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  }
})

const iconName = computed(() => `#icon-${props.icon}`)
const svgStyle = computed(() => ({
  color: props.color,
  width: props.size,
  height: props.size,
}));
</script>

<style scoped>
.love-icon {
  display: inline-block;

  svg {
    width: 1rem;
    height: 1rem;
    vertical-align: -0.15rem;
    fill: currentColor;
    overflow: hidden;
    flex-shrink: 0;
  }
}
</style>
