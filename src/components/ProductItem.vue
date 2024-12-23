<script setup lang="ts">
import {formatPrice, Product} from "../api/product.ts";
import {initRouter} from "../router";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const props = defineProps<{
  product: Product;
}>();

const {navTo} = initRouter();
const router = useRouter()
const currImgIndex = ref(0);
const imgOpacity = computed(() => currImgIndex.value === 0 ? 1 : 0);
const secondImg = ref<string>('');
onMounted(() => {
  if (props.product.productImages!.length > 1) {
    secondImg.value = props.product.productImages![1];
  } else {
    secondImg.value = props.product.productImages![0];
  }
});

// 点击评分组件时跳转到商品详情页的评论区
function handleRateClick() {
  router.push({name: 'ProductDetail', params: {productId: props.product.productId}}).then(() => {
    const commentSection = document.querySelector('.product-detail-comment');
    if (commentSection) {
      commentSection.scrollIntoView({behavior: 'smooth'});
    }
  });
}
</script>

<template>
  <div title="查看详情" @click="navTo('ProductDetail', {productId: props.product.productId})"
       class="product-item" style="text-align: center; cursor: pointer">
    <div class="product-item-img-container">
      <img :src="props.product.productImages![0]" alt="product image"
           class="product-item-img" style="z-index: 1" :style="{opacity: imgOpacity}"
           @mouseover="currImgIndex=1" @mouseleave="currImgIndex=0">
      <img :src="secondImg" alt="product image"
           class="product-item-img"
           @mouseover="currImgIndex=1" @mouseleave="currImgIndex=0">
    </div>
    <div style="font-weight: bold; font-size: 19px; margin-top: 10px">{{ props.product.productName }}</div>
    <div style="margin-top: 4px">
      <span v-if="props.product.productOriginalPrice !== props.product.productNowPrice"
            class="product-item-price" style="text-decoration: line-through">
        {{ formatPrice(props.product.productOriginalPrice!) }}
      </span>
      <span v-if="props.product.productOriginalPrice !== props.product.productNowPrice"
            class="product-item-price" style="color: #ea0202;">
        {{ formatPrice(props.product.productNowPrice!) }}
      </span>
      <span v-if="props.product.productOriginalPrice === props.product.productNowPrice"
            class="product-item-price">
        {{ formatPrice(props.product.productNowPrice!) }}
      </span>
    </div>
    <el-rate v-if="props.product.productScoreCount! > 0"
             v-model="props.product.productScore" disabled allow-half
             :texts="new Array(5).fill(`(${props.product.productScoreCount})`)"
             show-text @click="handleRateClick" title="查看评论"
             class="product-item-rate"/>
  </div>
</template>

<style scoped>
.product-item {
  width: 300px;
}

.product-item-img-container {
  position: relative; /* 用于定位后面的隐藏图片 */
  width: 320px;
  height: 320px;
  overflow: hidden; /* 确保不会显示超出边界的内容 */
}

.product-item-img {
  width: 100%; /* 使图片填满容器 */
  height: 100%;
  border-radius: 10px; /* 圆角 */
  transition: opacity 1s ease; /* 添加过渡效果 */
  position: absolute; /* 使图片重叠 */
  top: 0; /* 使图片重叠 */
  left: 0; /* 使图片重叠 */
  border: 1px solid #e0e0e0;
}

.product-item-price {
  font-size: 18px;
  color: #858383;
}

.product-item-rate {
  width: 100%;
  height: 8px;
  margin-top: 12px;
  justify-content: center;
}

:deep(.product-item-rate .el-rate__item) {
  font-size: 14px;
  --el-rate-icon-size: 25px;
  --el-rate-icon-margin: 0;
  --el-rate-fill-color: #FFD000;
  cursor: pointer;
}
</style>