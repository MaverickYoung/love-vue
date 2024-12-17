<template>
  <div class="lo-checkbox">
    <label :class="{checked:isChecked}" @click="isChecked = !isChecked">
      <lo-icon icon="right" size="2rem" :color="'currentColor'"/>
    </label>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import LoIcon from "@/components/love/lo-icon.vue";

const isChecked = ref(false)
</script>

<style scoped>
.lo-checkbox {
  width: 6rem;
  display: flex;
  justify-content: center;

  label {
    box-shadow: var(--shadow);
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .5rem;
    width: 2.8rem;
    height: 2.8rem;
    color: var(--greyDark);
    transition: .3s ease;

    &:hover {
      color: var(--primary);
    }

  }

  .checked {
    box-shadow: var(--inner-shadow);
    color: var(--primary);
  }
}

</style>