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
const svgStyle = computed(() => {
  const baseStyle = {
    width: props.size,
    height: props.size,
  };

  if (props.color) {
    return {
      ...baseStyle,
      transform: 'translateX(-1000px)',
      filter: `drop-shadow(1000px 0 0 ${props.color})`,
    };
  }

  return baseStyle;
});

</script>

<style scoped>
.love-icon {
  display: inline-block;

  svg {
    width: 1rem;
    height: 1rem;
    vertical-align: -0.15rem;
    overflow: hidden;
    flex-shrink: 0;
  }
}
</style>
