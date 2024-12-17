<template>
  <div class="lo-switch">
    <label :class="{checked:isChecked}" @click="isChecked = !isChecked"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';

const isChecked = ref(false);
</script>

<style scoped>
.lo-switch {
  width: 6rem;

  label {
    display: flex;
    align-items: center;
    width: 100%;
    height: 3rem;
    box-shadow: var(--shadow);
    background: rgba(255, 255, 255, 0);
    position: relative;
    cursor: pointer;
    border-radius: 1.6rem;

    &::after {
      content: "";
      position: absolute;
      left: .4rem;
      width: 2.1rem;
      height: 2.1rem;
      border-radius: 50%;
      background: var(--greyDark);
      transition: all .4s ease;
    }

    &::before {
      content: '';
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(330deg, var(--primary-dark) 0%, var(--primary) 50%, var(--primary-light) 100%);
      opacity: 0;
      transition: all .4s ease;
    }

  }

  .checked::before {
    opacity: 1;
  }

  .checked::after {
    left: 57%;
    background: var(--greyLight-1);
  }
}
</style>
