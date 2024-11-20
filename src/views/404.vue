<template>
  <div @click="datePickerVisible= true">2024-10</div>
  <van-popup
      v-model:show="datePickerVisible"
      position="bottom"
      :style="{ height: '30%' }"
  >
    <van-date-picker
        v-model="currentDate"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        :columns-type="columnsType"
    />
  </van-popup>
</template>


<script setup lang="ts">
import {ref} from "vue";
import {DatePickerColumnType} from "vant";

const datePickerVisible = ref(false);
const currentDate = ref(['2024', '11']);
const columnsType: DatePickerColumnType[] = ['year', 'month'];

const minDate = new Date(2024, 10, 1);
const maxDate = new Date(2025, 10, 1);

const formatter = (type: string, option: any) => {
  if (type === 'year') {
    option.text += '年';
  }
  if (type === 'month') {
    option.text += '月';
  }
  return option;
};

</script>

<style scoped>

</style>