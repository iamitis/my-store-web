<script setup lang="ts">
import AddressItem from "../../components/AddressItem.vue";
import {inject, onMounted, ref} from "vue";
import {
  AddressInfo, copyAddressInfo,
  deleteAddressInfo,
  emptyAddressInfo,
  getAllAddressInfo, updateAddressInfo,
  User
} from "../../api/user.ts";
import AddressDialog from "../../components/AddressDialog.vue";

const currUser = inject('currUser') as User
const addressList = ref<AddressInfo[]>([])
const originalAddressInfo = ref<AddressInfo>()

onMounted(async () => {
  // 获取用户收货地址
  const response = await getAllAddressInfo(currUser.id!)
  if (response.data.code !== '000') {
    ElMessage.error('获取用户收货地址失败' + response.data.msg)
  } else {
    addressList.value = response.data.result
    console.log('addressList', addressList.value)
    // // 确认第一个为默认收货地址
    // if (addressList.value.length > 0 && !addressList.value[0].isDefault) {
    //   ElMessage.error('第一个不为默认地址！')
    // }
  }
})

async function handleRemove(index: number) {
  const response = await deleteAddressInfo(addressList.value[index].addressInfoId!)
  if (response.data.code !== '000') {
    ElMessage.error('删除地址失败' + response.data.msg)
  } else {
    addressList.value.splice(index, 1)
  }
}

function handleEdit(index: number) {
  ElMessage.info('编辑地址' + index)

  originalAddressInfo.value = copyAddressInfo(addressList.value[index])
  addressDialogVisible.value = true
}

async function handleSetDefault(index: number) {
  let addressInfo = addressList.value[index]
  addressInfo.isDefault = true
  const response = await updateAddressInfo(addressInfo)
  if (response.data.code !== '000') {
    ElMessage.error('设置默认地址失败' + response.data.msg)
  } else {
    ElMessage.success('成功设置默认地址')
    addressList.value = (await getAllAddressInfo(currUser.id!)).data.result
  }
}

const addressDialogVisible = ref(false)

function handleAdd() {
  ElMessage.info('添加地址')

  originalAddressInfo.value = emptyAddressInfo
  addressDialogVisible.value = true
}

async function emitEdit() {
  const response = await updateAddressInfo(originalAddressInfo.value!)
  if (response.data.code !== '000') {
    ElMessage.error('更新地址失败' + response.data.msg)
  } else {
    addressList.value = (await getAllAddressInfo(currUser.id!)).data.result
  }
}

async function emitAdd() {
  const response = await updateAddressInfo(originalAddressInfo.value!)
  if (response.data.code !== '000') {
    ElMessage.error('添加地址失败' + response.data.msg)
  } else {
    addressList.value = (await getAllAddressInfo(currUser.id!)).data.result
  }
}
</script>

<template>
  <div class="a-b-container">
    <!-- 标题行 -->
    <el-row style="border-bottom: 1px dashed #c9c8c8; height: 50px">
      <el-col :span="3" class="a-b-title-col">收货人</el-col>
      <el-col :span="4" class="a-b-title-col">电话</el-col>
      <el-col :span="5" class="a-b-title-col">区域</el-col>
      <el-col :span="6" class="a-b-title-col">详细地址</el-col>
      <el-col :span="6" class="a-b-title-col">操作</el-col>
    </el-row>

    <!-- 空状态 -->
    <div v-if="addressList.length === 0"
         style="font-size: 20px; color: #727171; padding-top: 20px">
      暂无收货地址
    </div>

    <!-- 地址列表 -->
    <address-item v-if="addressList.length > 0"
                  v-for="(item, index) in addressList"
                  :index="index"
                  :addressInfo="item"
                  v-on:edit="handleEdit"
                  v-on:set-default="handleSetDefault"
                  v-on:remove="handleRemove"/>

    <!-- 添加地址按钮 -->
    <el-button @click="handleAdd" class="a-b-add-button">添加地址</el-button>
  </div>

  <!-- 地址对话框 -->
  <address-dialog v-model:dialogVisible="addressDialogVisible"
                  v-model:address-info="originalAddressInfo"
                  v-on:add="emitAdd"
                  v-on:edit="emitEdit"/>
</template>

<style scoped>
.a-b-container {
  padding: 15px 20px;
  margin: 30px 20px;
  border-radius: 20px;
  border: #e7e5e5 2px dashed;
}

.a-b-title-col {
  text-align: center;
  font-size: 22px;
  color: #333232;
}

.a-b-add-button {
  width: 100px;
  height: 40px;
  margin-top: 20px;
  font-size: 20px;
  background-color: #95cbba;
  color: white;
}

.a-b-add-button:hover {
  background-color: #8ac0af;
}
</style>