<script setup lang="ts">
import {CartItem} from "../api/user.ts";
import {formatPrice} from "../api/product.ts";
import {PropType} from "vue";

const item = defineModel('item', {
  type: Object as PropType<CartItem>,
  required: true
})
</script>

<template>
  <el-row v-if="item.product" class="c-o-i-container">
    <el-col :span="2" class="c-o-i-col">
      <img :src="item.product.productImages![0]" alt="商品图片"
           style="width: 100px; height: 100px; object-fit: cover; margin-left: 10px; border-radius: 10px">
    </el-col>
    <el-col :span="6" class="c-o-i-col" style="padding-left: 30px; align-items: start">
      <div style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        {{ item.product.productName }}
      </div>
    </el-col>
    <el-col :span="8" class="c-o-i-col" style="align-items: start; gap: 5px">
      <div v-for="option in item.productOptionValues" style="display: flex;">
        <span style="font-size: 17px; color: #676666;">{{ option.productOptionName }}</span>
        <span class="c-o-i-select">{{ option.value }}</span>
      </div>
    </el-col>
    <el-col :span="2" class="c-o-i-col">
      {{ formatPrice(item.product.productNowPrice!) }}
    </el-col>
    <el-col :span="2" :offset="1" class="c-o-i-col">
      {{ item.quantity }}
    </el-col>
    <el-col :span="2" :offset="1" class="c-o-i-col">
      {{ formatPrice(item.product.productNowPrice! * item.quantity!) }}
    </el-col>
  </el-row>
</template>

<style scoped>
.c-o-i-container {
  font-size: 20px;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
}

.c-o-i-container:hover {
  background-color: #f0f0f0;
}

.c-o-i-col {
  text-align: center;
  color: #84b9a8;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.c-o-i-select {
  padding: 3px;
  margin-left: 10px;
  border: 1px solid #84b9a8;
  border-radius: 5px;
  font-size: 16px;
  color: #84b9a8;
  outline: none;
}

.c-o-i-product-quantity {
  outline: none;
  border: none;
  width: 60px;
  height: 50px;
  font-size: 20px;
  margin-top: 10px;
  padding-left: 5px;
  border-radius: 10px;
  color: #84b9a8;
  margin-bottom: 6px;
  margin-left: 40px;
}

.c-o-i-product-quantity:focus {
  background-color: #d4ece4;
  color: #414040;
}

.c-o-i-product-quantity:hover {
  border: #d4ece4 2px solid;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  padding: 8px;
  height: 20px;
}
</style>