<template>
  <div class="lo-input" :class="{focused:isFocused}">
    <lo-icon v-if="icon" :icon="icon" size="4rem" color="currentColor" class="lo-input-icon"/>
    <input :type="type" :placeholder="placeholder" @focus="isFocused=true" @blur="isFocused=false"/>
  </div>
</template>

<script setup lang="ts">
import LoIcon from "@/components/love/lo-icon.vue";
import {PropType, ref} from "vue";

const props = defineProps({
  type: {
    type: String as PropType<'text' | 'number' | 'password' | 'email'>,
    default: 'text'
  },
  icon: String,
  placeholder: String
})

const isFocused = ref(false)
</script>

<style scoped>
.lo-input {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--greyDark);

  input {
    width: 20.4rem;
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
    color: var(--greyDark);
    transition: .3s ease;
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