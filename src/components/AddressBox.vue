<!-- 下单页的地址项 -->

<script setup lang="ts">
import {AddressInfo} from "../api/user.ts";
import {computed, ref} from "vue";

const props = defineProps<{
  addressInfo: AddressInfo,
  index: number,
  selectedIdx: number,
}>()

const emit = defineEmits(['edit', 'select'])

function handleSelect() {
  emit('select', props.index)
}

function handleEdit() {
  emit('edit', props.index)
}

const mouseHover = ref(false)

const selected = computed(() => {
  return props.index === props.selectedIdx
})
const borderColor = computed(() => {
  return mouseHover.value || selected.value ? '#84b9a8' : '#c0bfbf'
})
</script>

<template>
  <div class="a-box-container" title="点击选择" @click="handleSelect"
       @mouseover="mouseHover = true" @mouseleave="mouseHover = false">
    <span class="a-box-area">{{ addressInfo.areaAddress.join(' ') }}</span>
    <span class="a-box-detail">{{ addressInfo.detailAddress }}aaaaaaaaaaaaaaaaaa</span>
    <span class="a-box-private">{{ addressInfo.receiver }}&emsp;{{ addressInfo.phone }}</span>
    <div style="display: flex">
      <div v-if="selected" class="a-box-checked">已选中</div>
      <div v-if="!selected">&emsp;</div>
      <div v-if="mouseHover" class="a-box-edit" @click="handleEdit">编辑</div>
    </div>
  </div>
</template>

<style scoped>
.a-box-container {
  width: 95%;
  margin-top: 15px;
  border-radius: 10px;
  border: 2px solid v-bind(borderColor);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
}
.a-box-container:hover {
  background-color: #f0f0f0;
}

.a-box-area {
  margin: 15px 15px 0 15px;
  font-size: 16px;
  color: #262626;
}

.a-box-detail {
  margin: 0 15px;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #262626;
}

.a-box-private {
  margin: 0 15px;
  font-size: 16px;
  color: #262626;
}

.a-box-checked {
  background-color: #84b9a8;
  color: white;
  border-bottom-left-radius: 8px;
  border-top-right-radius: 10px;
  width: 80px;
  text-align: center;
}

.a-box-edit {
  width: 60px;
  color: #84b9a8;
  text-align: center;
  margin-left: auto;
}
</style>