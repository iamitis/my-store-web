<script setup lang="ts">
import {Order, OrderStatus} from "../api/order.ts";
import {onMounted, PropType, ref, computed} from "vue";
import {formatPrice} from "../api/product.ts";
import {initRouter} from "../router";
import {Delete} from "@element-plus/icons-vue";
import {dayjs} from "element-plus";
import {CartItem} from "../api/user.ts";

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

function formatDate(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm'); // 格式化为 'YYYY-MM-DD HH:mm'
}

const formattedCreateTime = computed(() => {
  return formatDate(order.value.createDate!);
})


function handleRemove() {
  emit('removeOrder', order.value.orderInfoId)
}

const isProductDropdownVisible = ref(false);

function toggleProductDropdown() {
  isProductDropdownVisible.value = !isProductDropdownVisible.value;
}

function navToDetail(cartItem: CartItem) {
  navTo('ProductDetail', {productId: cartItem.product!.productId})
}

async function hashOrderId(orderId: number) {
  const encoder = new TextEncoder();
  const data = encoder.encode(String(orderId));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return await Array.from(new Uint8Array(hash)).map(b => b.toString(10).padStart(2, '0')).join('');
}

const displayOrderId = ref('');
onMounted(async () => {
  displayOrderId.value = "ORD" + (await hashOrderId(order.value.orderInfoId!)).slice(0, 8);
})

function copyOrderId() {
  navigator.clipboard.writeText(displayOrderId.value);
  ElMessage.success('订单号已复制到剪贴板');
}
</script>

<template>
  <el-row class="order-row" v-if="order.products?.length! > 0">
    <el-col :span="3" class="order-row-item" style="align-items: center; justify-content: center">
      <img :src="order.products![0]!.product!.productImages![0]!" alt="商品图片"
           title="查看订单详情" @click="toggleProductDropdown"
           class="order-product-cover">
    </el-col>
    <el-col :span="6" class="order-row-item">
      <p class="order-id" title="复制订单号" @click="copyOrderId">
        {{ displayOrderId }}
      </p>
    </el-col>

    <!-- 订单创建时间列 -->
    <el-col :span="7" class="order-row-item">
      <p class="order-create-time">
        {{ formattedCreateTime }} <!-- 假设 'createTime' 是订单的创建时间 -->
      </p>
    </el-col>

    <el-col :span="4" class="order-row-item">
      <div :class="['order-status', order.orderStatus]">
        {{ statusText }}
      </div>
    </el-col>

    <el-col :span="3" class="order-row-item">
      <p style="margin-top: 20px; margin-left: 40px; text-align: center; font-size: 25px; color: #414040;">
        {{ formatPrice(order.totalPrice!) }}
      </p>
    </el-col>
  </el-row>

  <el-col :span="24">
    <div v-if="isProductDropdownVisible" class="product-dropdown">
      <ul>
        <li v-for="(cartItem, index) in order.products" :key="index">
          <img
              :src="cartItem.product!.productImages![0]"
              alt="商品图片"
              class="product-thumbnail"
              @click="navToDetail(cartItem)"
          />
          <div class="product-info">
            <!-- 商品名称 -->
            <span class="product-name" @click="navToDetail(cartItem)">
            {{ cartItem!.product!.productName }}
          </span>
            <!-- 商品属性 -->
            <div class="product-attributes">
            <span
                v-for="(option, idx) in cartItem.productOptionValues"
                :key="idx"
                class="product-attribute"
            >
              {{ option.productOptionName }}: {{ option.value }}
            </span>
            </div>
          </div>
          <!-- 商品价格 -->
          <span class="product-price">
          {{ formatPrice(cartItem!.product!.productNowPrice!) }}
        </span>
        </li>
      </ul>
    </div>
  </el-col>

</template>

<style scoped>
.order-row {
  height: 150px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  background-color: #f5f4f4;
  margin-top: 10px;
}

.order-row:hover {
  background-color: #e7e6e6;
}

.order-row-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  text-overflow: ellipsis;
}

.order-product-cover {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
}

.order-product-cover:hover {
  border: #aed0c5 5px solid;
}

.order-id {
  font-size: 20px;
  color: #414040;
  margin-left: 20px;
}

.order-id:hover {
  cursor: pointer;
  color: #84b9a8;
  text-decoration: underline;
}

.order-status {
  width: 100px;
  height: 40px;
  margin-top: 20px;
  border-radius: 10px;
  font-size: 20px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-status.UNPAID {
  background-color: #ffcccc;
}

.order-status.UNSEND {
  background-color: #ffd700;
}

.order-status.UNGET {
  background-color: #87cefa;
}

.order-status.DONE {
  background-color: #98fb98;
}

.order-create-time {
  font-size: 20px;
  color: #414040;
}

.product-dropdown {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* 更柔和的阴影 */
  padding: 20px; /* 增加内边距 */
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.product-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-dropdown li {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 保持两端对齐 */
  padding: 15px 10px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease; /* 添加悬停过渡效果 */
}

.product-dropdown li:last-child {
  border-bottom: none;
}

.product-dropdown li:hover {
  background-color: #f9f9f9; /* 添加悬停效果 */
}

.product-thumbnail {
  width: 60px; /* 调整图片大小 */
  height: 60px;
  object-fit: cover;
  border-radius: 6px; /* 更柔和的圆角 */
  margin-right: 20px;
  border: 1px solid #eee;
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* 添加缩放与阴影动画 */
}

.product-thumbnail:hover {
  transform: scale(1.05); /* 鼠标悬停时轻微放大 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.product-info {
  display: flex;
  flex-direction: column;
  flex: 1; /* 占据剩余空间 */
}

.product-name {
  font-size: 18px; /* 略微调整字体大小 */
  color: #333;
  font-weight: 600; /* 更加突出名称 */
  margin-bottom: 8px;
  cursor: pointer; /* 鼠标样式变为手型 */
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.product-name:hover {
  color: #409eff;
  text-decoration: underline;
}

.product-attributes {
  display: flex;
  flex-wrap: wrap; /* 自动换行 */
  gap: 10px; /* 增加属性之间的间距 */
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.product-attribute {
  background-color: #f5f5f5; /* 更浅的背景色 */
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 3px 8px; /* 调整内边距 */
  font-size: 13px;
  color: #555;
  white-space: nowrap; /* 防止换行 */
}

.product-price {
  font-size: 18px; /* 增大字体大小 */
  color: #84b9a8;
  font-weight: bold;
  margin-left: 15px;
  align-self: flex-end; /* 调整价格位置 */
}


</style>