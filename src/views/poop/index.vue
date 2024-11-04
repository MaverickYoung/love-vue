<template>
  <div class="container">
    <div class="card">
      <ImageWrapper name="poop-normal.svg" width="50%" alt="小便便图标"/>
    </div>

    <van-row>
      <van-col span="8" class="type">
        <ImageWrapper name="poop-normal.svg"/>
      </van-col>
      <van-col span="8" class="type">
        <ImageWrapper name="poop-normal.svg"/>
      </van-col>
      <van-col span="8" class="type">
        <ImageWrapper name="poop-normal.svg"/>
      </van-col>
    </van-row>

    <div class="card msg">
      <PoopMsg/>
    </div>

    <van-popover
        v-model:show="showPopover"
        :actions="options"
        actions-direction="horizontal"
        placement="top"
    >
      <van-row style="width: 250px">
        <van-col span="8" class="type-1" v-for="(option,index) in options" :key="index"
        >
          <ImageWrapper :name="option.name" width="80%" @click="handleClick(option.name)"/>
        </van-col>
      </van-row>

      <template #reference>
        <ImageWrapper :name="type"
                      width="50%"/>
      </template>
    </van-popover>
    <van-button type="primary">发射</van-button>
  </div>
</template>

<script setup lang="ts">
import ImageWrapper from "@/components/ImageWrapper.vue";
import {onMounted, ref} from "vue";
import PoopMsg from "@/views/poop/PoopMsg.vue";

const options = [{name: 'poop-normal.svg'},
  {name: 'poop-fiery.svg'}, {name: 'poop-runny.svg'}];

const showPopover = ref(false);
const type = ref('')

const handleClick = (name: string) => {
  showPopover.value = false;
  type.value = name
}

onMounted(() => {
  type.value = options[0].name;
})
</script>

<style scoped>
.container {
  padding: 0 16px; /* 设定容器的内边距，适应屏幕边缘 */
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 水平居中 */
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 300px;
  text-align: center;
  transition: transform 0.2s;
  margin-bottom: 16px;
}

.type {
  padding: 16px;
}

.msg {
  height: 250px;
  margin-bottom: 16px;
}

.type-1 {
  padding: 8px;
}
</style>