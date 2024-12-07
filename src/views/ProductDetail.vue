<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getProductById, mockProductList, Product} from "../api/product.ts";

const productData = ref<Product>()

// 示例：获取商品信息，当后端好后取消注释

// onMounted(async () => {
//   const response = await getProductById(1)
//   if (response.data.code !== '200') {
//     ElMessage.error("获取商品信息失败 " + response.data.msg)
//   } else {
//     productData.value = response.data.result
//   }
// })

productData.value = mockProductList[0]
</script>

<template>
  <h1>{{productData!.productName}}</h1>
</template>

<style scoped>

</style>