<template>
  <image-popup :src="src" :show="show" @update:show="updateShow">
    <image-popup-button :label="changeLabel" @click="triggerFileSelect"/>
    <input
        type="file"
        ref="fileInput"
        accept="image/*"
        style="display: none;"
        @change="handleFileChange"
    />
    <image-popup-button v-if="src" :label="saveLabel" @click="saveImage"/>
  </image-popup>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import ImagePopup from "@/components/ImagePopup/index.vue";
import ImagePopupButton from "@/components/ImagePopup/ImagePopupButton.vue";

const props = defineProps<{
  src?: string,
  show: boolean,
  updateShow: (val: boolean) => void,
  changeLabel: string,
  saveLabel: string,
  onFileChange: (event: Event) => void,
  onSave: () => void,
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  props.onFileChange(event);
};

const saveImage = () => {
  props.onSave();
};
</script>
