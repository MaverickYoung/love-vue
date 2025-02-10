<template>
  <div
    :class="{ checked: isChecked }"
    class="lo-checkbox"
    @click="isChecked = !isChecked">
    <label>
      <lo-icon :color="'currentColor'" icon="done" size="2rem" />
    </label>
    <p>{{ resolvedLabel }}</p>
  </div>
</template>

<script lang="ts" setup>
import LoIcon from '@/components/love/lo-icon.vue';
import { computed } from 'vue';

const props = defineProps<{
  value: string | number;
  label?: string;
}>();
const resolvedLabel = computed(() => props.label || props.value);
const isChecked = defineModel({ type: Boolean });
</script>

<style scoped>
.lo-checkbox {
  width: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--greyDark);
  transition: 0.3s ease;

  &:hover {
    color: var(--primary);
  }

  label {
    box-shadow: var(--shadow);
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.5rem;
    width: 2.8rem;
    height: 2.8rem;
    color: inherit;
  }

  p {
    margin-left: 0.4rem;
    font-size: 1.3rem;
    color: inherit;
  }
}

.checked {
  color: var(--primary);

  label {
    box-shadow: var(--inner-shadow);
  }
}
</style>
