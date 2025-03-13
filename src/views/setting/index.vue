<template>
  <div class="profile-wrapper">
    <router-view />
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 270px;
  padding: 20px;

  border-radius: 10px;
  box-shadow: 0 8px 16px var(--box-shadow-bottom);

  background: var(--van-background-2);
}
</style>
