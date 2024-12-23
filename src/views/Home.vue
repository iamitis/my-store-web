<script setup lang="ts">

import {initRouter} from "../router";

interface Category {
  categoryName: string;
  categoryImg: string;
  backEndName: string;
}

const categories: Category[] = [
  {categoryName: "食品", categoryImg: "src/assets/FOOD.jpg", backEndName: "FOOD"},
  {categoryName: "服装", categoryImg: "src/assets/APPAREL.png", backEndName: "APPAREL"},
  {categoryName: "电子产品", categoryImg: "src/assets/ELECTRONICS.jpg", backEndName: "ELECTRONICS"},
  {categoryName: "宠物用品", categoryImg: "src/assets/PET_SUPPLIES.jpg", backEndName: "PET_SUPPLIES"},
  {categoryName: "保健品", categoryImg: "src/assets/HEALTH_PRODUCTS.jpg", backEndName: "HEALTH_PRODUCTS"},
  {categoryName: "洗浴用品", categoryImg: "src/assets/BATH_PRODUCTS.jpg", backEndName: "BATH_PRODUCTS"},
]

const {navTo} = initRouter()

function navToCategoryDetail(backEndName: string) {
  navTo('CategoryDetail', {backEndName: backEndName})
}

function scrollDown() {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  });
}
</script>

<template>
  <div class="home-image-container">
    <img src="../assets/discount.png" alt="折扣" @click="navTo('Discount')"
         style="width: 100%; height: 100%; object-fit: cover; cursor: pointer"/>
    <button class="scroll-down-btn" @click="scrollDown">往下⬇滑动</button>
  </div>

  <el-row class="home-category-container">
    <el-col v-for="category in categories"
            :span="4" class="home-category-item">
      <div style="position: relative">
        <img @click="navToCategoryDetail(category.backEndName)" title="查看相关商品"
             class="home-category-img"
             :src="category.categoryImg" alt="分类图片"/>
        <div class="home-cate-img-shadow" @click="navToCategoryDetail(category.backEndName)"/>
      </div>
      <el-text @click="navToCategoryDetail(category.backEndName)" title="查看相关商品"
               class="home-category-name">
        {{ category.categoryName }}
      </el-text>
    </el-col>
  </el-row>
</template>

<style scoped>
.home-image-container {
  background-color: burlywood;
  height: calc(100vh - var(--header-height));
  position: relative;
}

.scroll-down-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  outline: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 30px;
  letter-spacing: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-down-btn:hover {
  background-color: rgba(0, 0, 0, 0.6);
}

.home-category-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  cursor: pointer;
}

.home-category-item:hover .home-category-img {
  scale: 1.1;
}

.home-category-item:hover .home-category-name {
  color: #a1ccbf;
}

.home-category-item:hover .home-cate-img-shadow {
  scale: 1.1;
}

.home-category-img {
  height: 160px;
  width: 160px;
  border-radius: 50%;
  transition: all 0.3s;
  box-shadow: inset 0 0 10px 5px rgba(0, 0, 0, 0.2);
}

.home-cate-img-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset 0 0 10px 8px rgb(231, 223, 237);
  transition: all 0.3s;
}

.home-category-container {
  background-color: rgb(231, 223, 237);
  height: 300px;
}

.home-category-name {
  font-size: 20px;
  font-weight: bold;
}
</style>