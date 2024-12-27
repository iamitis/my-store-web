<script setup lang="ts">
import {inject, onMounted, onUnmounted, Ref, ref} from "vue";
import {Product, searchProduct} from "../api/product.ts";
import ProductItem from "../components/ProductItem.vue";
import eventBus from "../utils/eventBus.ts";

const searchText = ref('')
const resultList = ref<Product[]>([])
const noProduct = ref(false)
const isLoading = ref(false)
onMounted(async () => {
  isLoading.value = true
  searchText.value = sessionStorage.getItem('searchText')!
  if (searchText.value) {
    const response = await searchProduct(searchText.value)
    if (response.data.code !== '000') {
      ElMessage.error(response.data.msg)
    } else {
      resultList.value = response.data.result
      noProduct.value = response.data.result.length === 0
      handleSort()
      isLoading.value = false
    }
  }
})

async function search() {
  isLoading.value = true
  searchText.value = sessionStorage.getItem('searchText')!
  const response = await searchProduct(searchText.value)
  if (response.data.code !== '000') {
    ElMessage.error(response.data.msg)
  } else {
    resultList.value = response.data.result
    noProduct.value = response.data.result.length === 0
    handleSort()
    isLoading.value = false
  }
}
onMounted(() => {
  eventBus.on('searchProduct', search)
})
onUnmounted(() => {
  eventBus.off('searchProduct', search)
})

// 处理 sort-row 的位置，使其在滚动时固定在页面顶部，但不遮挡header
const isHeaderVisible = inject('isHeaderVisible') as Ref<boolean>;
const sortRowTop = ref('60px');

function updateSortRowPosition() {
  sortRowTop.value = isHeaderVisible.value ? 'var(--header-height)' : '0';
}

onMounted(() => {
  window.addEventListener('scroll', updateSortRowPosition);
  updateSortRowPosition()
});
onUnmounted(() => {
  window.removeEventListener('scroll', updateSortRowPosition);
});


// 排序选项
const sortOptions = [
  {label: "销量从高到低 ↓", value: "salesDesc"},
  {label: "价格从高到低 ↓", value: "priceDesc"},
  {label: "价格从低到高 ↑", value: "priceAsc"},
  {label: "评分从高到低 ↓", value: "ratingDesc"},
];

// 初始化 `selectedSort`
const selectedSort = ref(sortOptions[0].value);

function handleSort() {
  if (selectedSort.value === 'priceDesc') {
    resultList.value.sort((a, b) => b.productNowPrice! - a.productNowPrice!)
  } else if (selectedSort.value === 'priceAsc') {
    resultList.value.sort((a, b) => a.productNowPrice! - b.productNowPrice!)
  } else if (selectedSort.value === 'ratingDesc') {
    resultList.value.sort((a, b) => b.productScore! - a.productScore!)
  } else if (selectedSort.value === 'salesDesc') {
    resultList.value.sort((a, b) => b.productScoreCount! - a.productScoreCount!)
  }
}
</script>

<template>
  <div style="padding: 45px 130px">
    <div class="sort-row" :style="{ top: sortRowTop }">
      <div  class="searchTitle">
        搜索结果
        <div style="display: flex; gap: 10px">
          <span style="font-size: 18px; color: #b2b2b2">找到</span>
          <span style="font-size: 18px; color: #b2b2b2">{{ resultList.length }}</span>
          <span style="font-size: 18px; color: #b2b2b2">件商品</span>
        </div>
      </div>

      <!-- 排序 -->
      <div class="sort-container">
        <select v-model="selectedSort" class="sort-select" @change="handleSort">
          <option v-for="item in sortOptions"
                  :value="item.value"
                  class="sort-option">
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-loading="isLoading" element-loading-text="正在为您寻找商品..." class="result-list-container">
      <div v-for="product in resultList" class="product-item-container">
        <product-item :product="product"/>
      </div>
    </div>

    <el-empty v-if="noProduct" description=" "
              style="font-size: 20px; color: #727171; padding-top: 20px">
      暂无相关商品
    </el-empty>

    <div v-if="resultList.length > 0" class="search-bottom">
      到底啦，看看别的吧~
    </div>
  </div>

</template>

<style scoped>
.sort-row {
  position: sticky;
  transition: top 0.3s;
  z-index: 2;
  background-color: white;
  padding: 15px 30px 15px 30px;
  margin-top: -1px;
  display: flex;
  justify-content: space-between;
}

.searchTitle {
  font-size: 24px;
  color: #2f2f2f;
  display: flex;
  align-items: center;
  gap: 20px;
}

.sort-container {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 20px;
}

.sort-select {
  padding: 10px;
  border-radius: 15px;
  font-size: 18px;
  background-color: #e1e0e0;
  color: #2f2f2f;
  cursor: pointer;
  border: none;
  outline: none;
}

.sort-select:hover, .sort-select:focus {
  background-color: #c7c5c5;
}

.sort-option {
  color: #525252;
  font-size: 16px;
  cursor: pointer;
  background-color: white;
}

.result-list-container {
  margin-top: 20px;
  display: flex;
  flex-flow: row wrap;
  gap: 40px 65px;
}

.product-item-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-bottom {
  justify-self: center;
  margin-top: 30px;
  color: gray;
  text-align: center;
  font-size: 18px;
  letter-spacing: 3px;
}
</style>