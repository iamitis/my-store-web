<script setup lang="ts">
import {formatPrice, Product} from "../../api/product.ts";
import {inject, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import {CartItem, deleteCartItem, getShoppingCart, User} from "../../api/user.ts";
import ShoppingCartItem from "../../components/ShoppingCartItem.vue";
import {initRouter} from "../../router";
import eventBus from "../../utils/eventBus.ts";

const shoppingCart = ref<CartItem[]>([]);
const totalQuantity = ref(0);
const totalPrice = ref(0);
const currUser = inject("currUser") as User;
const {navTo} = initRouter()

async function _getShoppingCart() {
  const response = await getShoppingCart(currUser.id!);
  if (response.data.code !== '000') {
    ElMessage.error('获取用户购物车列表失败' + response.data.msg);
  } else {
    shoppingCart.value = response.data.result
        .sort((a, b) => new Date(b.cartItemDate!).getTime() - new Date(a.cartItemDate!).getTime());
    totalQuantity.value = shoppingCart.value.reduce((acc, item) => acc + item.quantity!, 0);
    totalPrice.value = shoppingCart.value.reduce((acc, item) => acc + item.product!.productNowPrice! * item.quantity!, 0);
  }
}

onMounted(async () => {
  // 获取用户购物车列表
  await _getShoppingCart();
})

function updateQuantity() {
  totalQuantity.value = shoppingCart.value.reduce((acc, item) => acc + item.quantity!, 0)
  totalPrice.value = shoppingCart.value.reduce((acc, item) => acc + item.product!.productNowPrice! * item.quantity!, 0)
}

async function removeCartItem(cartItemId: number) {
  ElMessage.info('remove item: ' + cartItemId + " 没写接口")

  const response = await deleteCartItem(cartItemId)
  if (response.data.code !== '000') {
    ElMessage.error('删除购物车商品失败' + response.data.msg)
  } else {
    shoppingCart.value = shoppingCart.value.filter(item => item.cartItemId !== cartItemId)
    totalQuantity.value = shoppingCart.value.reduce((acc, item) => acc + item.quantity!, 0)
    totalPrice.value = shoppingCart.value.reduce((acc, item) => acc + item.product!.productNowPrice! * item.quantity!, 0)
  }

  eventBus.emit('updateCartCount')
}

function handleSubmit() {
  sessionStorage.setItem('productList',
      JSON.stringify(shoppingCart.value))
  navTo('CreateOrder')
}

// 使结算box在userNavBox下方
const userNavBoxBottom = inject('userNavBoxBottom') as Ref<number>;
const summaryBoxTop = ref('0');
onMounted(async () => {
  window.addEventListener('scroll', updateSummaryBoxPosition);
  summaryBoxTop.value = (await inject('userNavBoxBottom') as Ref<number>).value + 50 + 'px';
});
onUnmounted(() => {
  window.removeEventListener('scroll', updateSummaryBoxPosition);
});

function updateSummaryBoxPosition() {
  summaryBoxTop.value = (userNavBoxBottom.value + 50) + 'px';
}
</script>

<template>
  <div class="cart-list-container">
    <el-row class="cart-title-row">
      <el-col :span="4">
        <p style="font-size: 24px; color: #333232; margin-left: 16px">商品</p>
      </el-col>
      <el-col :span="6" :offset="5">
        <p style="font-size: 24px; color: #333232;">属性</p>
      </el-col>
      <el-col :span="3">
        <p style="font-size: 24px; color: #343434; margin-left: 10px">数量</p>
      </el-col>
      <el-col :span="4" style="display: flex; color: #333232; justify-content: center">
        <p style="font-size: 24px">单价</p>
      </el-col>
    </el-row>

    <shopping-cart-item v-for="(item, index) in shoppingCart"
                        v-model:cart-item="shoppingCart[index]"
                        v-on:update-quantity="updateQuantity"
                        v-on:remove-cart-item="removeCartItem"/>


    <!-- 空状态 -->
    <div v-if="shoppingCart.length === 0"
         style="font-size: 20px; color: #727171; padding-top: 20px">
      暂无购物车商品
    </div>
  </div>

  <!-- 结算box -->
  <div class="summary-box" :style="{ top: summaryBoxTop }" v-if="shoppingCart.length > 0">
    <p style="font-size: 24px; color: #111111; margin: 0;">
      付款详情
    </p>
    <p class="summary-line" style="margin-top: 30px">
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

    <!-- 结算按钮 -->
    <el-button @click="handleSubmit" class="submit-button">去结算</el-button>
  </div>
</template>

<style scoped>
.cart-list-container {
  padding: 10px 20px;
  margin: 0 20px 30px 20px;
  border-radius: 20px;
  border: #e7e5e5 2px dashed;
}

.cart-title-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
  background-color: #f5f4f4;
  border-radius: 10px;
}

.summary-box {
  width: 240px;
  justify-self: center;
  border-radius: 20px;
  padding: 15px 15px;
  background: #e4fcf3;

  position: fixed;
  left: 140px;
  transition: bottom 0.3s;
}

.summary-line {
  font-size: 20px;
  color: #111111;
  margin: 10px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.summary-line:hover {
  background-color: #f0f0f0;
}

.summary-digit {
  font-size: 20px;
  color: #e34f4f;
  /* background-color: #d6f3ea; */
  margin-right: 0;
  margin-left: auto;
  padding: 5px;
  border-radius: 5px;
}

.submit-button {
  width: 100%;
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