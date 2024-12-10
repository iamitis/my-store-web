<script setup lang="ts">
import {Product} from "../../api/product.ts";
import {inject, onMounted, ref} from "vue";
import {CartItem, getShoppingCart, mockCartItem, User} from "../../api/user.ts";
import ShoppingCartItem from "../../components/ShoppingCartItem.vue";

const shoppingCart = ref<CartItem[]>([]);
const currUser = inject("currUser") as User;

onMounted(async () => {
  // // 获取用户收藏列表
  // const response = await getShoppingCart(currUser.userId!);
  // if (response.data.code !== '200') {
  //   ElMessage.error('获取用户收藏列表失败' + response.data.msg);
  // } else {
  //   shoppingCart.value = response.data.result
  //       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  //   // 以日期排序
  // }

  // TODO: change to above
  shoppingCart.value = new Array(10)
      .fill(mockCartItem)
      .sort((a, b) => b.date - a.date)
})

function removeCartItem(cartItemId: number) {
  ElMessage.info('remove item: ' + cartItemId + " 没写接口")
}
</script>

<template>
  <div class="cart-list-container">
    <el-row style="border-bottom: 1px dashed #b4b4b4">
      <el-col :span="4">
        <p style="font-size: 24px; color: #333232;">商品</p>
      </el-col>
      <el-col :span="3" :offset="11">
        <p style="font-size: 24px; color: #343434; display: flex; justify-content: center">数量</p>
      </el-col>
      <el-col :span="4" style="display: flex; color: #333232; justify-content: center">
        <p style="font-size: 24px">价格</p>
      </el-col>
    </el-row>

    <shopping-cart-item v-for="item in shoppingCart"
                        :cart-item="item"
                        v-on:remove-cart-item="removeCartItem"/>
  </div>
</template>

<style scoped>
.cart-list-container {
  padding: 10px 20px;
  margin: 30px 20px;
  border-radius: 20px;
  border: #e7e5e5 2px dashed;
}
</style>