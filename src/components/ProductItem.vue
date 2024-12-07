<script setup lang="ts">
import {Product} from "../api/product.ts";
import {initRouter} from "../router";

const props = defineProps<{
  product: Product;
}>();

const {navTo} = initRouter()
</script>

<template>
  <div @click="navTo('ProductDetail', {productId: 1})"
       class="product-item" style="text-align: center; cursor: pointer">
    <img :src="props.product.productCover" alt="product image" style="width: 300px; height: 300px; border-radius: 10%">
    <div>
      <p style="font-weight: bold; font-size: 20px">{{ props.product.productName }}</p>
      <p style="font-size: 18px">{{ props.product.productPrice }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>