<!-- 下单页 -->

<script setup lang="ts">
import {
  AddressInfo,
  CartItem,
  copyAddressInfo,
  emptyAddressInfo,
  getAllAddressInfo,
  mockAddressInfo,
  User
} from "../api/user.ts";
import {computed, inject, onMounted, onUnmounted, Ref, ref} from "vue";
import CreateOrderItem from "../components/CreateOrderItem.vue";
import {formatPrice} from "../api/product.ts";
import AddressBox from "../components/AddressBox.vue";
import AddressDialog from "../components/AddressDialog.vue";

// 地址
const currUser = inject('currUser') as User
const addressList = ref<AddressInfo[]>([])
const selectIdx = ref(0)
const addressDialogVisible = ref(false)
const originalAddressInfo = ref<AddressInfo>()

onMounted(async () => {
  // const response = await getAllAddressInfo(currUser.id!)
  // if (response.data.code !== '000') {
  //   ElMessage.error('获取用户收货地址失败' + response.data.msg)
  // } else {
  //   addressList.value = response.data.result
  // }

  // TODO: change to above
  addressList.value = new Array(3).fill(mockAddressInfo)
  addressList.value.unshift({...mockAddressInfo, isDefault: true})
})

function handleAdd() {
  originalAddressInfo.value = emptyAddressInfo
  addressDialogVisible.value = true
}

function handleEdit(index: number) {
  ElMessage.info('编辑地址' + index)

  originalAddressInfo.value = copyAddressInfo(addressList.value[index])
  addressDialogVisible.value = true
}

function handleSelect(index: number) {
  selectIdx.value = index
}

async function emitEdit() {
  ElMessage.info('emitEdit')

  // TODO: change to below
  // const response = await updateAddressInfo(originalAddressInfo.value!)
  // if (response.data.code !== '000') {
  //   ElMessage.error('更新地址失败' + response.data.msg)
  // } else {
  //   addressList.value = (await getAllAddressInfo(currUser.id!)).data.result
  // }
}

async function emitAdd() {
  ElMessage.info('emitAdd')

  // TODO: change to below
  // const response = await updateAddressInfo(originalAddressInfo.value!)
  // if (response.data.code !== '000') {
  //   ElMessage.error('添加地址失败' + response.data.msg)
  // } else {
  //   addressList.value = (await getAllAddressInfo(currUser.id!)).data.result
  // }
}

const productList = ref<CartItem[]>([])
const totalQuantity = ref(0)
const totalPrice = ref(0)

// 从路由获取商品列表
onMounted(() => {
  productList.value = JSON.parse(sessionStorage.getItem('productList') || '[]')
  totalQuantity.value = productList.value.reduce((acc, item) => acc + item.quantity!, 0)
  totalPrice.value = productList.value.reduce((acc, item) => acc + item.product!.productNowPrice! * item.quantity!, 0)
})

// 处理 summary-box 的位置，使其在滚动时固定在页面顶部，但不遮挡header
const isHeaderVisible = inject('isHeaderVisible') as Ref<boolean>;
const summaryBoxTop = ref('60px');

function updateSummaryBoxPosition() {
  summaryBoxTop.value = isHeaderVisible.value ? 'calc(var(--header-height) + 20px)' : '20px';
}

onMounted(() => {
  window.addEventListener('scroll', updateSummaryBoxPosition);
});
onUnmounted(() => {
  window.removeEventListener('scroll', updateSummaryBoxPosition);
});

function navBack() {
  history.back()
}
</script>

<template>
  <el-row class="c-o-container">
    <el-col :span="18" class="c-o-operation-col">
      <!-- 收货地址 -->
      <div class="c-o-addr-container">
        <p style="font-size: 24px; font-weight: bold; color: #111111; margin: 0">
          确认收货信息
        </p>
        <el-row>
          <el-col :span="8" v-if="addressList.length > 0" v-for="(addr, index) in addressList">
            <address-box :addressInfo="addr" :index="index" :selected-idx="selectIdx"
            v-on:edit="handleEdit" v-on:select="handleSelect"/>
          </el-col>
        </el-row>
        <!-- 空状态 -->
        <div v-if="addressList.length === 0"
             style="font-size: 20px; color: #727171; padding-top: 20px">
          暂无收货地址
        </div>
        <el-button @click="handleAdd" class="c-o-add-button">添加地址</el-button>
      </div>

      <!-- 商品列表 -->
      <div class="c-o-product-container">
        <p style="font-size: 24px; font-weight: bold; color: #111111; margin: 0">
          确认订单信息
        </p>

        <!-- 标题列 -->
        <el-row class="c-o-product-title">
          <el-col :span="2">商品</el-col>
          <el-col :span="2" :offset="8">属性</el-col>
          <el-col :span="2" :offset="4">价格</el-col>
          <el-col :span="2" :offset="1">数量</el-col>
          <el-col :span="2" :offset="1">小计</el-col>
        </el-row>

        <!-- 商品列表 -->
        <create-order-item v-for="item in productList" :item="item" style="margin-top: 10px"/>
      </div>
    </el-col>

    <el-col :span="6" class="summary-col">
      <!-- 付款详情，悬浮于右上角 -->
      <div class="summary-box" :style="{ top: summaryBoxTop }">
        <p style="font-size: 24px; font-weight: bold; color: #111111; margin: 0;">
          付款详情
        </p>
        <p class="summary-line" style="margin-top: 40px">
          商品件数
          <span class="summary-digit">
            {{ totalQuantity }}
          </span>
        </p>
        <p class="summary-line">
          总&emsp;&emsp;计
          <span class="summary-digit">
            {{ formatPrice(totalPrice) }}
          </span>
        </p>

        <!-- 提交按钮 -->
        <div class="summary-button-group">
          <el-button @click="navBack" class="back-button">返回</el-button>
          <el-button class="submit-button">提交订单</el-button>
        </div>
      </div>
    </el-col>
  </el-row>

  <div style="height: 250px; background-color: #ecebeb"/>

  <!-- 地址对话框 -->
  <address-dialog v-model:dialogVisible="addressDialogVisible"
                  v-model:address-info="originalAddressInfo"
                  v-on:add="emitAdd"
                  v-on:edit="emitEdit"/>
</template>

<style scoped>
.c-o-container {
  width: 100%;
  padding: 0 5%;
  justify-self: center;
  background-color: #ecebeb;
}

.c-o-operation-col {
  padding-top: 20px;
}

.c-o-addr-container {
  border-radius: 20px;
  padding: 20px 25px;
  background-color: white;
}

.c-o-add-button {
  width: 100px;
  height: 40px;
  margin-top: 20px;
  font-size: 20px;
  background-color: #95cbba;
  color: white;
}

.c-o-add-button:hover {
  background-color: #8ac0af;
  border: none;
}

.c-o-product-container {
  border-radius: 20px;
  padding: 20px 25px;
  margin-top: 20px;
  background-color: white;
}

.c-o-product-title {
  font-size: 20px;
  text-align: center;
  color: #252424;

  height: 50px;
  align-items: center;
  margin-top: 10px;
  border-radius: 10px;
  background-color: #eeeeee;
}

.summary-col {
  padding-top: 20px;
}

.summary-box {
  width: 80%;
  justify-self: center;
  border-radius: 20px;
  padding: 15px 15px;
  background: #e4fcf3;

  position: sticky;
  transition: top 0.3s;
}

.summary-line {
  font-size: 20px;
  color: #111111;
  margin: 20px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.summary-line:hover {
  background-color: #f0f0f0;
}

.summary-digit {
  font-size: 20px;
  /* background-color: #d6f3ea; */
  margin-right: 0;
  margin-left: auto;
  padding: 5px;
  border-radius: 5px;
}

.summary-button-group {
  display: flex;
  justify-content: end;
  margin-top: 30px;
}

.back-button {
  width: 30%;
  height: 40px;
  font-size: 18px;
  border: 2px solid #939191;
  color: #939191;
}

.back-button:hover {
  background-color: #939191;
  color: white;
}

.submit-button {
  width: 70%;
  height: 40px;
  font-size: 18px;
  border: 2px solid #fc3838;
  color: #fc3838;
}

.submit-button:hover {
  background-color: #fc3838;
  color: white;
}
</style>