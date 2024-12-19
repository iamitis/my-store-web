<script setup lang="ts">
import {CartItem, updateCartItem} from "../api/user.ts";
import {computed, onMounted, PropType, ref} from "vue";
import {formatPrice, getProductOptionValues, mockOptionMap, ProductOptionValue} from "../api/product.ts";
import {initRouter} from "../router";
import {Delete} from "@element-plus/icons-vue";

const cartItem = defineModel(
    'cartItem',
    {
      type: Object as PropType<CartItem>,
      required: true
    }
)
const emit = defineEmits(['removeCartItem', 'updateQuantity'])
const {navTo} = initRouter()

function navToDetail() {
  navTo('ProductDetail', {productId: cartItem.value.product!.productId})
}

const optionMap = ref<Map<string, ProductOptionValue[]>>(new Map)
onMounted(async () => {
  // // 获取商品选项，用于重选
  // const response = await getProductOptionValues(cartItem.value.product!.productId!)
  // if (response.data.code !== '000') {
  //   ElMessage.error('获取商品选项失败' + response.data.msg)
  // } else {
  //   const optionValues = response.data.result
  //   for (const optionValue of optionValues) {
  //     if (!optionMap.value.has(optionValue.productOptionName!)) {
  //       optionMap.value.set(optionValue.productOptionName!, [])
  //     }
  //     optionMap.value.get(optionValue.productOptionName!)!.push(optionValue)
  //   }
  // }

  // TODO: change to above
  optionMap.value = mockOptionMap
})

async function handleChangeOption() {
  // TODO: change to below
  // const response = await updateCartItem(cartItem.value)
  // if (response.data.code !== '000') {
  //   ElMessage.error('更新购物车商品选项失败' + response.data.msg)
  // } else {
  //   ElMessage.success('更新购物车商品选项成功')
  // }
}

async function handleQuantityChange() {
  ElMessage.info('quantity changed to: ' + cartItem.value.quantity + " 没写接口")

  // // TODO: change to below
  // const response = await updateCartItem(cartItem.value)
  // if (response.data.code !== '000') {
  //   ElMessage.error('更新购物车商品数量失败' + response.data.msg)
  // } else {
  emit('updateQuantity')
  // }
}

function handleRemove() {
  emit('removeCartItem', cartItem.value.cartItemId)
}
</script>

<template>
  <el-row class="cart-row">
    <el-col :span="4" class="cart-row-item" style="justify-content: center">
      <img :src="cartItem.product!.productImages![0]" alt="商品图片"
           title="查看商品详情" @click="navToDetail"
           class="cart-product-cover">
    </el-col>
    <el-col :span="5" class="cart-row-item"
            style="align-items: start; padding: 0 8px">
      <p class="cart-product-name" title="查看商品详情" @click="navToDetail">
        {{ cartItem.product!.productName! }}
      </p>
    </el-col>
    <el-col :span="6" class="cart-row-item" style="align-items: start; padding: 24px 0; gap: 5px">
      <span v-for="option in cartItem.productOptionValues" style="display: flex;">
        <span style="font-size: 17px; color: #676666; width: 100%">{{ option.productOptionName }}</span>
        <!--        <span class="c-o-i-option" title="更改" @click="handleChangeOption">-->
        <!--          {{ option.value }} ▼-->
        <!--        </span>-->
        <span class="cart-select-container">
        <select v-model="option.value" class="cart-select"
                @change="handleChangeOption">
          <option v-for="value in optionMap.get(option.productOptionName!)!"
                  :value="value.value" class="cart-option">
            {{ value.value }}
          </option>
        </select>
        </span>
      </span>
    </el-col>
    <el-col :span="3" class="cart-row-item">
      <input v-model="cartItem.quantity" type="number"
             :min="1" title="修改商品数量"
             @change="handleQuantityChange"
             class="cart-product-quantity"/>
    </el-col>
    <el-col :span="4" class="cart-row-item">
      <p style="margin-top: 20px; font-size: 25px; color: #414040;">
        {{ formatPrice(cartItem.product!.productNowPrice!) }}
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
  font-size: 22px;
  color: #414040;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-product-name:hover {
  cursor: pointer;
  color: #84b9a8;
  text-decoration: underline;
}

.cart-select-container {
  width: 100%;
}

.cart-select {
  padding: 3px;
  margin-left: 10px;
  border: 1px solid #84b9a8;
  border-radius: 5px;
  font-size: 16px;
  color: #84b9a8;
  cursor: pointer;
  outline: none;
  /* 若选项长度过长，不换行，显示省略号 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.cart-select:hover, .cart-select:focus {
  color: white;
  background-color: #84b9a8;
}

.cart-option {
  color: #84b9a8;
  font-size: 16px;
  cursor: pointer;
  background-color: white;
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