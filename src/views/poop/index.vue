<!--
  - MIT License
  -
  - Copyright (c) 2025 Maverick Young
  -
  - Permission is hereby granted, free of charge, to any person obtaining a copy
  - of this software and associated documentation files (the "Software"), to deal
  - in the Software without restriction, including without limitation the rights
  - to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  - copies of the Software, and to permit persons to whom the Software is
  - furnished to do so, subject to the following conditions:
  -
  - The above copyright notice and this permission notice shall be included in all
  - copies or substantial portions of the Software.
  -
  - THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  - IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  - FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  - AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  - LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  - OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  - SOFTWARE.
  -->

<template>
	<div class="container">
		<div class="card-item">
			<image-wrapper :src="NormalPoopIcon" alt="小便便图标" height="120px" width="120px" />
		</div>

		<div class="card-item">
			<van-tabs v-model:active="activeTab" animated swipeable>
				<van-tab class="tab-content">
					<template #title>
						<image-wrapper :src="MessageIcon" alt="消息图标" width="30px" />
					</template>
					<keep-alive>
						<poop-message v-if="loadedTabs.includes(0) || activeTab === 0" />
					</keep-alive>
				</van-tab>

				<van-tab class="tab-content">
					<template #title>
						<image-wrapper :src="RewardIcon" alt="记录图标" width="30px" />
					</template>
					<keep-alive>
						<poop-reward v-if="loadedTabs.includes(1) || activeTab === 1" />
					</keep-alive>
				</van-tab>

				<van-tab class="tab-content">
					<template #title>
						<image-wrapper :src="StatsIcon" alt="日志图标" width="30px" />
					</template>
					<keep-alive>
						<poop-stats v-if="loadedTabs.includes(2) || activeTab === 2" />
					</keep-alive>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script lang="ts" setup>
import ImageWrapper from '@/components/ImageWrapper.vue';
import { ref, watch } from 'vue';
import PoopMessage from '@/views/poop/PoopMessage.vue';
import PoopReward from '@/views/poop/PoopReward.vue';
import PoopStats from '@/views/poop/PoopStats.vue';
import { MessageIcon, NormalPoopIcon, RewardIcon, StatsIcon } from '@/assets';

// 默认加载第一个tab
const activeTab = ref<number>(0);
const loadedTabs = ref<number[]>([0]);
watch(activeTab, newVal => {
	// 标记已加载的tab
	if (!loadedTabs.value.includes(newVal)) {
		loadedTabs.value.push(newVal);
	}
});
</script>

<style scoped>
.container {
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.card-item {
	border-radius: 10px;
	box-shadow: 0 8px 16px var(--box-shadow-bottom);
	padding: 16px 0 16px 0;
	width: 300px;
	text-align: center;
	margin: 16px 0 16px 0;
}

.tab-content {
	height: 440px;
	position: relative;
}
</style>
