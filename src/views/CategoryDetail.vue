<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 确保 `backEndName` 有默认值
const backEndName = route.params.backEndName

const categoryNameMap = new Map<string, string>([
  ["FOOD", "食品"],
  ["APPAREL", "服装"],
  ["ELECTRONICS", "电子产品"],
  ["PET_SUPPLIES", "宠物用品"],
  ["HEALTH_PRODUCTS", "保健品"],
  ["BATH_PRODUCTS", "洗浴用品"],
]);

const categoryName = categoryNameMap.get(backEndName) || "未知分类";

// 分类属性
const productAttribute: string[] = [
  "品牌",
  "产地",
  "规格",
  "颜色",
  "价格",
  "用途",
  "价格",
  "品牌",
];



// 排序选项
const sortOptions = [
  { label: "销量从高到低", value: "bestSeller" },
  { label: "价格从高到低", value: "price_desc" },
  { label: "价格从低到高", value: "price_asc" },
];

// 初始化 `selectedSort`
const selectedSort = ref(sortOptions[0].value);
</script>

<template>
  <h1 class="title">{{ backEndName }}</h1>
  <h1 class="title">{{ categoryName }}</h1>
  <el-row type="flex" justify="start" align="middle" class="attribute-container">
    <el-col
        v-for="(attribute, index) in productAttribute"
        :key="index"
        :span="4"
        class="attribute-col"
    >
      <div class="attribute-card">{{ attribute }}</div>
    </el-col>
  </el-row>

  <!-- 添加右下角的 Sort By 组件 -->
  <el-col :span="24" class="sort-container">
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
</template>

<style scoped>
.title {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #696969;
  height: 100px;
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
  width: 70%; /* 让内容只占据屏幕的左侧 50% */
  margin-left: 0; /* 确保靠左对齐 */
}

.sort-container {
  display: flex;
  justify-content: flex-end; /* 靠右对齐 */
  align-items: center;
  margin-top: 20px; /* 与分类按钮间距 */
  margin-right: 5%; /* 与屏幕右侧的距离 */
}

.sort-wrapper {
  display: flex;
  align-items: center;
}

.sort-label {
  font-size: 14px;
  color: #696969;
  margin-right: 10px; /* 标签与选择框的间距 */
}

.sort-select {
  min-width: 150px; /* 确保选择框足够宽，显示完整选项 */
}
</style>
