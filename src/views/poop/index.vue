<template>
  <div class="container">
    <div class="card">
      <ImageWrapper name="poop-normal.svg" width="50%" alt="小便便图标"/>
    </div>

    <div class="card">
      <van-tabs v-model:active="active" animated swipeable>
        <van-tab class="content">
          <template #title>
            <ImageWrapper name="poop-normal.svg" width="50%" alt="小便便图标"/>
          </template>
          <PoopMsg/>
        </van-tab>
        <van-tab class="content">
          <template #title>
            <ImageWrapper name="poop-normal.svg" width="50%" alt="小便便图标"/>
          </template>
        </van-tab>
        <van-tab class="content">
          <template #title>
            <ImageWrapper name="poop-normal.svg" width="50%" alt="小便便图标"/>
          </template>

        </van-tab>
      </van-tabs>
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
          <ImageWrapper :name="option.name" width="80%" @click="handleClick(option)"/>
        </van-col>
      </van-row>

      <template #reference>
        <ImageWrapper :name="type.name"
                      width="50%"/>
      </template>
    </van-popover>
    <van-button :type="type.type">发射</van-button>
  </div>
</template>

<script setup lang="ts">
import ImageWrapper from "@/components/ImageWrapper.vue";
import {onMounted, reactive, ref} from "vue";
import PoopMsg from "@/views/poop/PoopMsg.vue";

const active = ref('');
const options = [{name: 'poop-normal.svg', type: 'warning'},
  {name: 'poop-fiery.svg', type: 'danger'}, {name: 'poop-runny.svg', type: 'primary'}];

const showPopover = ref(false);
const type = reactive({
  name: '',
  type: '',
})

const handleClick = (options) => {
  showPopover.value = false;
  type.name = options.name;
  type.type = options.type;
}

onMounted(() => {
  handleClick(options[0]);
})
</script>

<style scoped>
.container {
  padding: 0 16px; /* 设定容器的内边距，适应屏幕边缘 */
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 水平居中 */
  height: 100vh;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 300px;
  text-align: center;
  transition: transform 0.2s;
  margin: 16px;
}

.content {
  height: 250px;
  overflow-y: auto; /* 允许垂直滚动 */
  border-radius: 8px;
}


.type-1 {
  padding: 8px;
}
</style>