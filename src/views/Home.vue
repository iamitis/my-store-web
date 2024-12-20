<script setup lang="ts">

import {initRouter} from "../router";

interface Category {
  categoryName: string;
  categoryImg: string;
  backEndName:string;
}

const categories: Category[] = [
  {categoryName: "食品", categoryImg: "", backEndName: "FOOD"},
  {categoryName: "服装", categoryImg: "", backEndName: "APPAREL"},
  {categoryName: "电子产品", categoryImg: "", backEndName: "ELECTRONICS"},
  {categoryName: "宠物用品", categoryImg: "", backEndName: "PET_SUPPLIES"},
  {categoryName: "保健品", categoryImg: "", backEndName: "HEALTH_PRODUCTS"},
  {categoryName: "洗浴用品", categoryImg: "", backEndName: "BATH_PRODUCTS"},
]

const {navTo} = initRouter()

function navToCategoryDetail(backEndName: string) {
  navTo('CategoryDetail', {backEndName: backEndName})
}


</script>

<template>


  <div class="home-image-container">
    image
  </div>

  <el-row class="home-category-container">
    <el-col v-for="category in categories"
            :span="4" class="home-category-item">
      <el-avatar @click="navToCategoryDetail(category.backEndName)" title="查看相关商品"
                 class="home-category-img" :src="category.categoryImg"/>
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
  height: calc(100vh - var(--header-height) - 300px);
}

.home-category-container {
  background-color: darkgray;
  height: 300px;
}

.home-category-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.home-category-img {
  height: 160px;
  width: 160px;
  cursor: pointer;
}

.home-category-name {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
</style>