<script setup lang="ts">
import {CartItem} from "../api/user.ts";
import {onMounted, ref} from "vue";
import {formatPrice} from "../api/product.ts";
import {initRouter} from "../router";
import {Delete} from "@element-plus/icons-vue";

const props = defineProps<{
  cartItem: CartItem
}>()
const emit = defineEmits(['removeCartItem'])

const {navTo} = initRouter()
const quantity = ref(1)

onMounted(() => {
  quantity.value = props.cartItem.quantity
})

function navToDetail() {
  navTo('ProductDetail', {productId: props.cartItem.product.productId})
}

function handleQuantityChange() {
  ElMessage.info('quantity changed to: ' + quantity.value + " 没写接口")
}

function handleRemove() {
  emit('removeCartItem', props.cartItem.cartItemId)
}
</script>

<template>
  <el-row class="cart-row">
    <el-col :span="4" class="cart-row-item" style="justify-content: center">
      <img :src="props.cartItem.product!.productCover!" alt="商品图片"
           title="查看商品详情" @click="navToDetail"
           class="cart-product-cover">
    </el-col>
    <el-col :span="11" class="cart-row-item"
            style="align-items: start;">
      <p class="cart-product-name" title="查看商品详情" @click="navToDetail">
        {{ props.cartItem.product!.productName! }}
      </p>
    </el-col>
    <el-col :span="3" class="cart-row-item">
      <input v-model="quantity" type="number"
             :min="1" title="修改商品数量"
             @change="handleQuantityChange"
             class="cart-product-quantity"/>
    </el-col>
    <el-col :span="4" class="cart-row-item">
      <p style="margin-top: 20px; font-size: 25px; color: #414040;">
        {{ formatPrice(props.cartItem.product!.productNowPrice!) }}
      </p>
    </el-col>
    <el-col :span="2" class="cart-row-item">
      <el-button circle @click="handleRemove" class="cart-remove-button">
        <el-icon style="width: 100%; height: 100%">
          <Delete style="width: 80%; height: 80%"/>
        </el-icon>
      </el-button>
    </el-col>
  </el-row>
</template>

<style scoped>
.cart-row {
  height: 200px;
  display: flex;
  align-items: center;
  border-radius: 10px;
}

.cart-row:hover {
  background-color: #f0f0f0;
}

.cart-row-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-overflow: ellipsis;
}

.cart-product-cover {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
}

.cart-product-cover:hover {
  border: #aed0c5 5px solid;
}

.cart-product-name {
  font-size: 25px;
  color: #414040;
  margin-left: 20px;
}

.cart-product-name:hover {
  cursor: pointer;
  color: #84b9a8;
  text-decoration: underline;
}

.cart-product-quantity {
  outline: none;
  border: none;
  width: 80px;
  height: 60px;
  font-size: 25px;
  margin-top: 10px;
  padding-left: 5px;
  border-radius: 10px;
  color: #414040;
}

.cart-product-quantity:focus {
  background-color: #d4ece4;
}

.cart-product-quantity:hover {
  border: #d4ece4 2px solid;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  padding: 10px;
  height: 20px;
}

.cart-remove-button {
  width: 50px;
  height: 50px;
  margin-top: 15px
}

.cart-remove-button:hover {
  border-color: #8abdab;
  background-color: #d8e8e3;
  color: #87b9a8;
}
</style>