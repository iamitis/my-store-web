<script setup lang="ts">
import {AddressInfo} from "../api/user.ts";
import {EditPen, Delete} from "@element-plus/icons-vue"

const props = defineProps<{
  addressInfo: AddressInfo,
  index: number,
}>()

const emit = defineEmits(['edit', 'remove', 'set-default'])
</script>

<template>
  <el-row class="a-i-container">
    <el-col :span="4" class="a-i-col">{{ props.addressInfo.receiver }}</el-col>
    <el-col :span="6" class="a-i-col">{{ props.addressInfo.phone }}</el-col>
    <el-col :span="8" class="a-i-col">{{ props.addressInfo.address }}</el-col>
    <el-col :span="6" class="a-i-col">
      <el-icon class="a-i-button" title="修改" @click="emit('edit', props.index)">
        <edit-pen/>
      </el-icon>
      <el-icon class="a-i-button" title="删除" @click="emit('remove', props.index)">
        <delete/>
      </el-icon>
      <span v-if="!addressInfo.isDefault" class="a-i-button"
            style="font-size: 18px" @click="emit('set-default', props.index)">
        设为默认
      </span>
      <span v-if="addressInfo.isDefault" class="a-i-default">
        默认地址
      </span>
    </el-col>
  </el-row>
</template>

<style scoped>
.a-i-container {
  border-radius: 10px;
  border-bottom: 1px solid #e7e7e7;
  height: 80px;
  align-items: center;
}

.a-i-container:hover {
  background-color: #f5f5f5;
}

.a-i-col {
  font-size: 18px;
  color: #262626;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.a-i-button {
  font-size: 24px;
  color: #84b9a8;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  margin: 0 8px;
}

.a-i-button:hover {
  color: white;
  background-color: #84b9a8;
}

.a-i-default {
  font-size: 19px;
  background-color: #8cc4b0;
  color: white;
  padding: 5px;
  border-radius: 5px;
  margin: 0 8px;
}
</style>