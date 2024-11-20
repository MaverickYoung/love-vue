<template>
  <div class="container">
    <div class="card-item">
      <image-wrapper src="/src/assets/poop-normal.svg" width="50%" alt="小便便图标"/>
    </div>

    <div class="card-item">
      <van-tabs v-model:active="activeTab" animated swipeable>
        <van-tab class="tab-content">
          <template #title>
            <image-wrapper src="/src/assets/poop-normal.svg" width="50%" alt="小便便图标"/>
          </template>
          <poop-message ref="poopMessageRef"/>
        </van-tab>
        <van-tab class="tab-content">
          <template #title>
            <image-wrapper src="/src/assets/poop-normal.svg" width="50%" alt="小便便图标"/>
          </template>
          <poop-reward/>
        </van-tab>
        <van-tab class="tab-content">
          <template #title>
            <image-wrapper src="/src/assets/poop-normal.svg" width="50%" alt="小便便图标"/>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <van-popover v-model:show="isPopoverVisible" actions-direction="horizontal"
                 placement="top">
      <van-row style="width: 250px">
        <van-col span="8" class="popover-item" v-for="poop in poopOptions" :key="poop.id">
          <image-wrapper :src="poop.src" width="80%" @click="onOptionClick(poop)"/>
        </van-col>
      </van-row>

      <template #reference>
        <image-wrapper :src="selectedType?.src?selectedType?.src:''" width="50%"/>
      </template>
    </van-popover>
    <van-button :color="selectedType?.color" @click="onSubmit">发射</van-button>
  </div>
</template>

<script setup lang="ts">
import ImageWrapper from "@/components/ImageWrapper.vue";
import {onMounted, ref} from "vue";
import PoopMessage from "@/views/poop/PoopMessage.vue";
import {Poop, usePoopStore} from "@/store/poop";
import {showSuccessToast} from "vant";
import {useLogSaveApi} from "@/api/poop/log";
import PoopReward from "@/views/poop/PoopReward.vue";

const selectedType = ref<Poop>();

const activeTab = ref('');

const isPopoverVisible = ref(false);

// 使用 ref 引用子组件实例
const poopMessageRef = ref<InstanceType<typeof PoopMessage> | null>(null);

const onOptionClick = (option: Poop) => {
  isPopoverVisible.value = false;
  selectedType.value = option;
};

const poopStore = usePoopStore();

onMounted(async () => {
  await poopStore.getPoopsAction();
  poopOptions.value = [...poopStore.poops.values()];
  setInitialOption();

  await poopMessageRef.value?.onLogPage();

  scrollToBottom(true);
});

const poopOptions = ref<Poop[]>([])

// 滚动到底部
const scrollToBottom = (immediate = false) => {
  if (poopMessageRef.value) {
    poopMessageRef.value.$el.scrollIntoView({
      behavior: immediate ? 'auto' : 'smooth', // 首次加载使用 'auto'，后续使用 'smooth'
      block: 'end',
    });
  }
};

const onSubmit = async () => {
  await useLogSaveApi(selectedType.value?.id);
  showSuccessToast('发射成功');

  await poopMessageRef.value?.onLogPage();

  scrollToBottom();
}


const setInitialOption = () => {
  onOptionClick(poopOptions.value[0]);
};
</script>

<style scoped>
.container {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.card-item {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 300px;
  text-align: center;
  transition: transform 0.2s;
  margin: 16px;
}

.tab-content {
  height: 250px;
  border-radius: 8px;
  overflow-y: auto;
}

.popover-item {
  padding: 8px;
}
</style>
