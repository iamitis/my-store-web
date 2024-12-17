<script setup lang="ts">
import {Order, OrderStatus} from "../api/order.ts";
import {onMounted, PropType, ref, computed} from "vue";
import {formatPrice} from "../api/product.ts";
import {initRouter} from "../router";
import {Delete} from "@element-plus/icons-vue";

const order = defineModel(
    'order',
    {
      type: Object as PropType<Order>,
      required: true
    }
)
const emit = defineEmits(['removeOrder'])
const {navTo} = initRouter()

const statusText = computed(() => {
  const status = order.value.orderStatus;
  switch (status) {
    case OrderStatus.UNPAID:
        return '待支付';
    case OrderStatus.UNSEND:
        return '未发货';
    case OrderStatus.UNGET:
        return '未取货';
    case OrderStatus.DONE:
        return '订单完成';
    default:
        return '';
  }
});

function formatDate(date: Date) :string{
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const formattedCreateTime = computed(() => {
  return formatDate(order.value.createDate!);
})

function navToDetail() {
  navTo('OrderDetail', {orderId: order.value.orderId})
}

function handleRemove() {
  emit('removeOrder', order.value.orderId)
}
</script>

<template>
  <el-row class="order-row">
    <el-col :span="4" class="order-row-item" style="justify-content: center">
      <img :src="order.productList![0]!.product!.productCover!" alt="商品图片"
           title="查看订单详情" @click="navToDetail"
           class="order-product-cover">
    </el-col>
    <el-col :span="4" class="order-row-item"
            style="align-items: start;">
      <p class="order-id" title="查看订单详情" @click="navToDetail">
        {{ order.orderId!}}
      </p>
    </el-col>

    <!-- 订单创建时间列 -->
    <el-col :span="4" class="order-row-item" style="align-items: start;">
      <p class="order-create-time">
        {{formattedCreateTime}} <!-- 假设 'createTime' 是订单的创建时间 -->
      </p>
    </el-col>

    <el-col :span="4" class="order-row-item">
      <div :class="['order-status', order.orderStatus]">
        {{statusText}}
      </div>
    </el-col>

    <el-col :span="4" class="order-row-item">
      <p style="margin-top: 20px; font-size: 25px; color: #414040;">
        {{ formatPrice(order.totalPrice!) }}
      </p>
    </el-col>
    <el-col :span="2" class="order-row-item">
      <el-button circle @click="handleRemove" class="order-remove-button">
        <el-icon style="width: 100%; height: 100%">
          <Delete style="width: 80%; height: 80%"/>
        </el-icon>
      </el-button>
    </el-col>
  </el-row>
</template>

<style scoped>
.order-row {
  height: 200px;
  display: flex;
  align-items: center;
  border-radius: 10px;
}

.order-row:hover {
  background-color: #f0f0f0;
}

.order-row-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-overflow: ellipsis;
}

.order-product-cover {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
}

.order-product-cover:hover {
  border: #aed0c5 5px solid;
}

.order-id {
  font-size: 25px;
  color: #414040;
  margin-left: 20px;
}

.order-id:hover {
  cursor: pointer;
  color: #84b9a8;
  text-decoration: underline;
}

.order-status {
  width: 100%;
  height: 20px;
  border-radius: 10px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  color: white;
}

.order-status.UNPAID {
  background-color: #ffcccc;
}

.order-status.UNSEND {
  background-color: #ffd700;
}

.order-status.UNGET{
  background-color: #87cefa;
}

-order-status.DONE {
  background-color: #98fb98;
}

.order-remove-button {
  width: 50px;
  height: 50px;
  margin-top: 15px
}

.order-remove-button:hover {
  border-color: #8abdab;
  background-color: #d8e8e3;
  color: #87b9a8;
}
</style>