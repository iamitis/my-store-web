<script setup lang="ts">

import {CartItem} from "../api/user.ts";
import {formatPrice} from "../api/product.ts";

const props = defineProps<{
  item: CartItem
}>()
</script>

<template>
  <el-row v-if="props.item.product" class="c-o-i-container">
    <el-col :span="2">
      <img :src="props.item.product.productCover" alt="商品图片"
           style="width: 100px; height: 100px; object-fit: cover; margin-left: 10px; border-radius: 10px">
    </el-col>
    <el-col :span="2" :offset="8" class="c-o-i-col">
      <p class="c-o-i-digit">{{ props.item.product.productName }}</p>
    </el-col>
    <el-col :span="2" :offset="4" class="c-o-i-col">
      <p class="c-o-i-digit">{{ formatPrice(props.item.product.productNowPrice!) }}</p>
    </el-col>
    <el-col :span="2" :offset="1" class="c-o-i-col">
      <p class="c-o-i-digit">{{ props.item.quantity }}</p>
    </el-col>
    <el-col :span="2" :offset="1" class="c-o-i-col">
      <p class="c-o-i-digit">{{ formatPrice(props.item.product.productNowPrice! * props.item.quantity!) }}</p>
    </el-col>
  </el-row>

</template>

<style scoped>
.c-o-i-container {
  font-size: 20px;

  align-items: center;
  border-radius: 10px;
}
.c-o-i-container:hover {
  background-color: #f0f0f0;
}

.c-o-i-col {
  text-align: center;

  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-o-i-digit {
  border-radius: 5px;
  padding: 5px;
  color: #84b9a8;
}
</style>