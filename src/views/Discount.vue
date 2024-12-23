<!-- 打折商品页 -->

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getAllDiscountProduct, Product} from "../api/product.ts";
import ProductItem from "../components/ProductItem.vue";

const discountList = ref<Product[]>([])
onMounted(async () => {
  const response = await getAllDiscountProduct()
  if (response.data.code !== '000') {
    ElMessage.error('获取打折商品列表失败' + response.data.msg)
  } else {
    discountList.value = response.data.result
    displayList.value = discountList.value
  }
})
const displayList = ref<Product[]>([])

const currCate = ref<string>('ALL')

function clickCate(cateName: string) {
  currCate.value = cateName
  if (cateName === 'ALL') {
    displayList.value = discountList.value
  } else {
    displayList.value = discountList.value.filter(product => product.productCategory === cateName)
  }
}

function isSelected(cateName: string) {
  return currCate.value === cateName
}
</script>

<template>
  <div class="discount-container">
    <div class="discount-img-container">
      <img src="../assets/poster.png" alt="poster"
           style="width: 100%; height: 100%; object-fit: cover">
    </div>

    <div style="margin-top: 20px; width: 100%;
                display: flex; flex-direction: column; align-items: center">
      <div style="font-size: 22px; letter-spacing: 4px; color: #5e5d5d">
        当前打折分类
      </div>
      <div class="cate-container">
        <div class="cate-item" :class="{'isSelected': isSelected('ALL')}" title="查看相关商品"
              @click="clickCate('ALL')">全部</div>
        <div class="cate-item" :class="{'isSelected': isSelected('FOOD')}" title="查看相关商品"
              @click="clickCate('FOOD')">食品</div>
        <div class="cate-item" :class="{'isSelected': isSelected('APPAREL')}" title="查看相关商品"
              @click="clickCate('APPAREL')">服装</div>
        <div class="cate-item" :class="{'isSelected': isSelected('ELECTRONICS')}" title="查看相关商品"
              @click="clickCate('ELECTRONICS')">电子产品</div>
        <div class="cate-item" :class="{'isSelected': isSelected('PET_SUPPLIES')}" title="查看相关商品"
              @click="clickCate('PET_SUPPLIES')">宠物用品</div>
        <div class="cate-item" :class="{'isSelected': isSelected('HEALTH_PRODUCTS')}" title="查看相关商品"
              @click="clickCate('HEALTH_PRODUCTS')">保健品</div>
        <div class="cate-item" :class="{'isSelected': isSelected('BATH_PRODUCTS')}" title="查看相关商品"
              @click="clickCate('BATH_PRODUCTS')">洗浴用品</div>
      </div>
    </div>

    <el-row>
      <el-col :span="6" v-for="product in displayList" class="discount-item-container">
        <product-item :product="product"/>
      </el-col>
    </el-row>

    <el-empty v-if="displayList.length === 0" description=" "
              style="font-size: 20px; color: #727171; padding-top: 20px">
      暂无相关商品
    </el-empty>

    <div style="justify-self: center; margin-top: 30px;
    color: gray; font-size: 18px; letter-spacing: 3px">到底啦，看看别的吧~</div>
  </div>
</template>

<style scoped>
.discount-container {
  padding: 60px 130px;
}

.discount-img-container {
  height: 200px;
  margin-left: 30px;
}

.cate-container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  margin-left: 20px;
}

.cate-item {
  width: 180px;
  padding: 10px 0;
  font-size: 20px;
  letter-spacing: 3px;
  text-align: center;
  border-radius: 8px;
  background-color: #e0dfdf;
  color: #5e5d5d;
  cursor: pointer;
}

.cate-item:hover {
  background-color: var(--scheme-color);
  color: white;
}

.isSelected {
  background-color: var(--scheme-color);
  color: white;
}

.discount-item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}
</style>