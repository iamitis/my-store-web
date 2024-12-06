<script setup lang="ts">

import {initRouter} from "../router";

interface Category {
  categoryName: string;
  categoryImg: string;
}

const categories: Category[] = [
  {categoryName: "食品", categoryImg: "",},
  {categoryName: "服装", categoryImg: "",},
  {categoryName: "电子产品", categoryImg: "",},
  {categoryName: "宠物用品", categoryImg: "",},
  {categoryName: "保健品", categoryImg: "",},
  {categoryName: "洗浴用品", categoryImg: "",},
]

const {navTo} = initRouter()

function navToCategoryDetail(categoryName: string) {
  navTo('CategoryDetail', {categoryName})
}


</script>

<template>


  <div class="home-image-container">
    image
  </div>

  <el-row class="home-category-container">
    <el-col v-for="category in categories"
            :span="4" class="home-category-item">
      <el-avatar @click="navToCategoryDetail(category.categoryName)" title="查看相关商品"
                 class="home-category-img" :src="category.categoryImg"/>
      <el-text @click="navToCategoryDetail(category.categoryName)" title="查看相关商品"
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