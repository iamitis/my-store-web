<script setup lang="ts">
import {Footprint} from "../api/footprint.ts";
import {dayjs} from "element-plus";
import {Calendar} from "@element-plus/icons-vue";
import {formatPrice} from "../api/product.ts";
import {initRouter} from "../router";

const props = defineProps<{
  footprint: Footprint
}>()

function formatDate(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD'); // 格式化为 'YYYY-MM-DD HH:mm'
}

const {navTo} = initRouter()
function navToDetail(productId: number) {
  navTo('ProductDetail', {productId: productId})
}
</script>

<template>
  <div class="f-i-container">
    <div style="margin-top: 10px; display: flex; gap: 10px; align-items: center; color: #2a2a2a">
      <div class="f-i-date">
        <el-icon><calendar/></el-icon>
        {{ formatDate(props.footprint.footprintDate) }}
      </div>
      <div>
        浏览了
        {{ props.footprint.productList.length }}
        件商品
      </div>
    </div>
    <div class="f-i-product-list">
      <div v-for="product in props.footprint.productList"
           class="f-i-product" title="查看详情" @click="navToDetail(product.productId!)">
        <div>
          <img :src="product.productImages![0]" alt="product image"
               class="f-i-product-img">
        </div>
        <div class="f-i-product-name" :title="product.productName">
          {{product.productName }}
        </div>
        <div class="f-i-product-price">
          {{ formatPrice(product.productNowPrice!) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.f-i-date {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #2a2a2a;
}

.f-i-product-list {
  margin-top: 10px;
  display: flex;
  flex-flow: row wrap;
  gap: 20px;
}

.f-i-product {
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #2a2a2a;
  cursor: pointer;
}

.f-i-product:hover {
  color: var(--scheme-color-deep);
}

.f-i-product-img {
  width: 150px;
  height: 150px;
  border-radius: 10px;
}

.f-i-product-name {
  width: 100%;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>