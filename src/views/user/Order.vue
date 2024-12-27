<script setup lang="ts">
import {formatPrice} from "../../api/product.ts";
import {Order, mockOrder, getAllOrders} from "../../api/order.ts"
import {inject, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import {User} from "../../api/user.ts";
import OrderItem from "../../components/OrderItem.vue";
import {initRouter} from "../../router";

const orders = ref<Order[]>([]);
const currUser = inject("currUser") as User;
const {navTo} = initRouter()

async function getOrder() {
  getAllOrders(currUser.id!)
      .then(res => {
        if (res.data.code !== '000') {
          ElMessage.error('获取用户订单失败' + res.data.msg);
        } else {
          orders.value = res.data.result
              .sort((a, b) => new Date(b.createDate!).getTime() - new Date(a.createDate!).getTime());
        }
      })
}

onMounted(async () => {
  // // 获取用户购物车列表
  // await _getShoppingCart();

  // TODO: change to above
  console.log("Component mounted");
  //await getOrder();
  // orders.value = new Array(10)
  //     .fill(mockOrder)
  //     .sort((a, b) => b.date - a.date)
  await getOrder();
})

async function removeOrder(cartItemId: number) {
  ElMessage.info('remove item: ' + cartItemId + " 没写接口")

  // TODO: change to below
  // const response = await deleteCartItem(cartItemId)
  // if (response.data.code !== '200') {
  //   ElMessage.error('删除购物车商品失败' + response.data.msg)
  // } else {
  // }
}
</script>

<template>
  <div class="order-list-container">
    <el-row class="order-title-row">
      <el-col :span="3" class="order-title-col">
        <p class="order-title-text"
           style="margin-left: 30px">订单</p>
      </el-col>
      <!-- 订单号列 -->
      <el-col :span="6" class="order-title-col">
        <p class="order-title-text" style="margin-left: 25px">订单号</p>
      </el-col>
      <!-- 订单创建时间列 -->
      <el-col :span="7" class="order-title-col">
        <p class="order-title-text">订单创建时间</p>
      </el-col>
      <el-col :span="4" class="order-title-col">
        <p class="order-title-text">订单状态</p>
      </el-col>
      <el-col :span="3" class="order-title-col">
        <p class="order-title-text" style="margin-left: 50px">总价格</p>
      </el-col>
    </el-row>

    <order-item v-for="(item, index) in orders"
                v-model:order="orders[index]"
                v-on:remove-order-item="removeOrder"/>
  </div>
</template>

<style scoped>
.order-list-container {
  padding: 10px 20px;
  margin: 0 20px 30px 20px;
  border-radius: 20px;
  border: #e7e5e5 2px dashed;
}

.order-title-row {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.order-title-col {
  display: flex;
  align-items: center;
}

.order-title-text {
  font-size: 24px;
  color: #333232;
}
</style>