<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {User} from "../../api/user.ts";
import {Footprint, getFootprintByUserId} from "../../api/footprint.ts";
import FootprintItem from "../../components/FootprintItem.vue";

const currUser = inject('currUser') as User
const footprintList = ref<Footprint[]>([])
onMounted(async () => {
  const res = await getFootprintByUserId(currUser.id!)
  if (res.data.code !== '000') {
    ElMessage.error('获取浏览记录失败' + res.data.msg)
  } else {
    footprintList.value = res.data.result
  }
})
</script>

<template>
  <div class="f-container">
    <div class="f-list-container">
      <footprint-item v-for="footprint in footprintList" :footprint="footprint"/>
    </div>

    <!-- 空状态 -->
    <div v-if="footprintList.length === 0"
         style="font-size: 20px; color: #727171; padding-top: 20px">
      暂无浏览记录
    </div>
  </div>
</template>

<style scoped>
.f-container {
  padding: 10px 20px;
  margin: 0 20px 30px 20px;
  border-radius: 20px;
  border: #e7e5e5 2px dashed;
}

.f-list-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>