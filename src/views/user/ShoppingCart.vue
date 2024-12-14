<script setup lang="ts">
import {formatPrice, Product} from "../../api/product.ts";
import {inject, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import {CartItem, getShoppingCart, mockCartItem, User} from "../../api/user.ts";
import ShoppingCartItem from "../../components/ShoppingCartItem.vue";
import {initRouter} from "../../router";

const shoppingCart = ref<CartItem[]>([]);
const totalQuantity = ref(0);
const totalPrice = ref(0);
const currUser = inject("currUser") as User;
const {navTo} = initRouter()

onMounted(async () => {
  // // 获取用户购物车列表
  // const response = await getShoppingCart(currUser.id!);
  // if (response.data.code !== '200') {
  //   ElMessage.error('获取用户购物车列表失败' + response.data.msg);
  // } else {
  //   shoppingCart.value = response.data.result
  //       .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
  //   totalQuantity.value = shoppingCart.value.reduce((acc, item) => acc + item.quantity!, 0);
  //   totalPrice.value = shoppingCart.value.reduce((acc, item) => acc + item.product!.productNowPrice! * item.quantity!, 0);
  // }

  // TODO: change to above
  shoppingCart.value = new Array(10)
      .fill(mockCartItem)
      .sort((a, b) => b.date - a.date)
  totalQuantity.value = shoppingCart.value.reduce((acc, item) => acc + item.quantity!, 0)
  totalPrice.value = shoppingCart.value.reduce((acc, item) => acc + item.product!.productNowPrice! * item.quantity!, 0)
})

function removeCartItem(cartItemId: number) {
  ElMessage.info('remove item: ' + cartItemId + " 没写接口")
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
    <el-row style="border-bottom: 1px dashed #c9c8c8; margin-bottom: 5px">
      <el-col :span="4">
        <p style="font-size: 24px; color: #333232;">商品</p>
      </el-col>
      <el-col :span="3" :offset="11">
        <p style="font-size: 24px; color: #343434; margin-left: 10px">数量</p>
      </el-col>
      <el-col :span="4" style="display: flex; color: #333232; justify-content: center">
        <p style="font-size: 24px">价格</p>
      </el-col>
    </el-row>

    <shopping-cart-item v-for="item in shoppingCart"
                        :cart-item="item"
                        v-on:remove-cart-item="removeCartItem"/>
  </div>

  <!-- 结算box -->
  <div class="summary-box" :style="{ top: summaryBoxTop }">
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
  margin: 30px 20px;
  border-radius: 20px;
  border: #e7e5e5 2px dashed;
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