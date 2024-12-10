<script setup lang="ts">
import {ref} from "vue";
import {useRoute} from "vue-router";
import {categoryNameMap, mockProduct, productAttributes} from "../api/product.ts";
import ProductItem from "../components/ProductItem.vue";

const route = useRoute();

// 确保 `backEndName` 有默认值
const backEndName = String(route.params.backEndName)
const categoryName = categoryNameMap.get(backEndName) || backEndName;

const mockProductList = new Array(10).fill(mockProduct);

// 排序选项
const sortOptions = [
  {label: "销量从高到低", value: "bestSeller"},
  {label: "价格从高到低", value: "price_desc"},
  {label: "价格从低到高", value: "price_asc"},
];

// 初始化 `selectedSort`
const selectedSort = ref(sortOptions[0].value);
</script>

<template>
    <h1 class="title">{{ backEndName }}</h1>
    <h1 class="title">{{ categoryName }}</h1>
    <el-row>
      <el-col :span="16" style="height: 100%">
        <el-row type="flex" justify="start" align="middle" class="attribute-container">
          <el-col
              v-for="(attribute, index) in productAttributes"
              :key="index"
              :span="4"
              class="attribute-col"
          >
            <div class="attribute-card">{{ attribute }}</div>
          </el-col>
        </el-row>
      </el-col>

      <!-- 添加右下角的 Sort By 组件 -->
      <el-col :span="8" class="sort-container">
        <div class="sort-wrapper">
          <span class="sort-label">Sorted by:</span>
          <el-select v-model="selectedSort" placeholder="Select" class="sort-select">
            <el-option
                v-for="(option, index) in sortOptions"
                :key="index"
                :label="option.label"
                :value="option.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>

    <el-row class="product-list-container">
      <!-- 按照原型的话是四等分，所以这里设置span为6，可修改 -->
      <el-col :span="6" v-for="product in mockProductList" style="margin-top: 30px">
        <product-item :product="product"/>
      </el-col>
    </el-row>
</template>

<style scoped>
.title {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #696969;
  height: 60px;
}

.attribute-card {
  text-align: center;
  background-color: #f7f7f7;
  border-radius: 20px;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.attribute-card:hover {
  transform: scale(1.05);
  background-color: #eaeaea;
}

.attribute-col {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.attribute-container {
  /* width: 70%; /* 让内容只占据屏幕的左侧 50% */
  margin-left: 0; /* 确保靠左对齐 */
}

.sort-container {
  display: flex;
  justify-content: center;
  align-items: end;
  margin-top: 20px; /* 与分类按钮间距 */
  /* margin-right: 5%; /* 与屏幕右侧的距离 */
}

.sort-wrapper {
  display: flex;
  align-items: center;
  margin-left: 200px;
}

.sort-label {
  font-size: 14px;
  color: #696969;
  margin-right: 10px; /* 标签与选择框的间距 */
}

.sort-select {
  min-width: 150px; /* 确保选择框足够宽，显示完整选项 */
}

.product-list-container {
  margin-top: 50px;
}
</style>
