<script setup lang="ts">
import {inject, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {
  categoryNameMap, filterProducts,
  getAttributesByCategory, getAttributeValuesByCategory,
  Product,
  ProductAttribute,
  ProductAttributeValue
} from "../api/product.ts";
import ProductItem from "../components/ProductItem.vue";

const route = useRoute();
const backEndName = String(route.params.backEndName)
const categoryName = categoryNameMap.get(backEndName)
const productList = ref<Product[]>([])
onMounted(async () => {
  const response = await filterProducts(backEndName, new Map())
  if (response.data.code !== '000') {
    ElMessage.error('获取商品列表失败' + response.data.msg)
  } else {
    productList.value = response.data.result
    console.log(productList.value)
  }
})

watch(() => route.params.backEndName, () => {
  // refresh
  window.location.reload()
})

// 排序选项
const sortOptions = [
  {label: "价格从高到低 ↓", value: "priceDesc"},
  {label: "价格从低到高 ↑", value: "priceAsc"},
  {label: "评分从高到低 ↓", value: "ratingDesc"},
];

// 初始化 `selectedSort`
const selectedSort = ref(sortOptions[0].value);

// 处理 attr-sort-row 的位置，使其在滚动时固定在页面顶部，但不遮挡header
const isHeaderVisible = inject('isHeaderVisible') as Ref<boolean>;
const attrSortRowTop = ref('60px');

function updateAttrSortRowPosition() {
  attrSortRowTop.value = isHeaderVisible.value ? 'var(--header-height)' : '0';
}

onMounted(() => {
  window.addEventListener('scroll', updateAttrSortRowPosition);
  updateAttrSortRowPosition()
});
onUnmounted(() => {
  window.removeEventListener('scroll', updateAttrSortRowPosition);
});

const attrList = ref<ProductAttribute[]>([])
const attrValMap = ref<Map<string, ProductAttributeValue[]>>(new Map())
const selectedAttrValMap = ref<Map<string, ProductAttributeValue[]>>(new Map())
onMounted(async () => {
  // 获取属性列表
  const response = await getAttributesByCategory(backEndName)
  if (response.data.code !== '000') {
    ElMessage.error('获取属性列表失败' + response.data.msg)
  } else {
    // 赋值attrList
    attrList.value = response.data.result
    // 初始化 map
    for (const attr of attrList.value) {
      attrValMap.value.set(attr.productAttributeName!, [])
      selectedAttrValMap.value.set(attr.productAttributeName!, [])
    }
    // 获取属性值列表
    const valueResponse = await getAttributeValuesByCategory(backEndName)
    if (valueResponse.data.code !== '000') {
      ElMessage.error('获取属性值列表失败' + valueResponse.data.msg)
    } else {
      // 赋值attrValMap
      for (const attr of valueResponse.data.result) {
        const attrName = attr.productAttribute!.productAttributeName!
        attrValMap.value.get(attrName)!.push(attr)
      }
    }
  }
})

function clickAttrVal(attrValue: ProductAttributeValue) {
  console.log(attrValue)
  const attrName = attrValue.productAttribute!.productAttributeName!
  const selectedAttrVal = selectedAttrValMap.value.get(attrName)!
  const index = selectedAttrVal.indexOf(attrValue)
  if (index === -1) {
    selectedAttrVal.push(attrValue)
  } else {
    selectedAttrVal.splice(index, 1)
  }
  handleFilter()
}

async function handleFilter() {
  const response = await filterProducts(backEndName, selectedAttrValMap.value)
  if (response.data.code !== '000') {
    ElMessage.error('筛选失败' + response.data.msg)
  } else {
    console.log(response.data.result)
    productList.value = response.data.result
    console.log(productList.value)
  }
}

const isPopoverVisible = ref<boolean[]>([])
onMounted(() => {
  for (let i = 0; i < attrList.value.length; i++) {
    isPopoverVisible.value.push(false)
  }
})

function hasSelectedAttr(attrName: string) {
  return selectedAttrValMap.value.get(attrName)!.length > 0
}

function isSelected(attrValue: ProductAttributeValue) {
  const attrName = attrValue.productAttribute!.productAttributeName!
  return selectedAttrValMap.value.get(attrName)!.includes(attrValue)
}

function clearSelectedAttr(attrName: string) {
  selectedAttrValMap.value.set(attrName, [])
  handleFilter()
}

function handleSort() {
  if (selectedSort.value === 'priceDesc') {
    productList.value.sort((a, b) => b.productNowPrice! - a.productNowPrice!)
  } else if (selectedSort.value === 'priceAsc') {
    productList.value.sort((a, b) => a.productNowPrice! - b.productNowPrice!)
  } else if (selectedSort.value === 'ratingDesc') {
    productList.value.sort((a, b) => b.productScore! - a.productScore!)
  }
}
</script>

<template>
  <div style="padding: 45px 130px">
    <el-row class="attr-sort-row" :style="{ top: attrSortRowTop }">
      <!-- 属性筛选 -->
      <el-col :span="16" class="cate-rol">
        <el-popover v-for="(attribute, index) in attrList"
                    trigger="click" width="300px"
                    :key="index"
                    v-on:before-leave="isPopoverVisible[index] = false"
                    v-on:before-enter="isPopoverVisible[index] = true">
          <!-- 属性类卡片 -->
          <template #reference>
            <div class="attribute-card"
                 :class="{'active': isPopoverVisible[index],
                          'has-select': hasSelectedAttr(attribute.productAttributeName!)}">
              {{ attribute.displayName }}
              <button v-if="hasSelectedAttr(attribute.productAttributeName!)"
                      class="close-btn" title="清除全部选择"
                      @click.stop="clearSelectedAttr(attribute.productAttributeName!)">
                x
              </button>
            </div>
          </template>

          <!-- 用于选择属性值的弹出框内容 -->
          <div class="attr-val-opt-container">
            <div v-for="attrValue in attrValMap.get(attribute.productAttributeName!)"
                 @click="clickAttrVal(attrValue)"
                 class="attr-val-opt" :class="{selected: isSelected(attrValue)}">
              {{ attrValue.value }}
            </div>
          </div>
        </el-popover>
      </el-col>

      <!-- 排序 -->
      <el-col :span="6" :offset="2" class="sort-container">
        <div style="display: flex; gap: 10px">
          <span style="font-size: 18px; color: #b2b2b2">找到</span>
          <span style="font-size: 18px; color: #b2b2b2">{{ productList.length }}</span>
          <span style="font-size: 18px; color: #b2b2b2">件商品</span>
        </div>
        <select v-model="selectedSort" class="sort-select" @change="handleSort">
          <option v-for="item in sortOptions"
                  :value="item.value"
                  class="sort-option">
            {{ item.label }}
          </option>
        </select>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6" v-for="product in productList" class="product-item-container">
        <product-item :product="product"/>
      </el-col>
    </el-row>

    <el-empty v-if="productList.length === 0" description=" "
              style="font-size: 20px; color: #727171; padding-top: 20px">
      暂无相关商品
    </el-empty>

    <div class="cate-detail-bottom">
      到底啦，看看别的吧~
    </div>
  </div>
</template>

<style scoped>
.cate-name {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f4e4e;
  font-size: 40px;
  font-weight: bold;
  letter-spacing: 15px;
  text-align: center;
}

.cate-desc {
  padding: 30px 150px;
  color: #6c6c6c;
  font-size: 17px;
  text-align: center;
}

.attr-sort-row {
  padding: 38px 30px 25px 30px;
  position: sticky;
  transition: top 0.3s;
  z-index: 2;
  background-color: white;
}

.cate-rol {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.attribute-card {
  height: 20px;
  padding: 15px 15px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 19px;
  font-weight: bold;
  background-color: #f1f1f1;
  color: #525252;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.attribute-card:hover, .attribute-card.active, .attribute-card.has-select {
  transform: scale(1.05);
  background-color: var(--scheme-color);
  color: white;
}

.attr-val-opt-container {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.attr-val-opt {
  border-radius: 5px;
  padding: 8px;
  font-size: 18px;
  cursor: pointer;
  background-color: #f1f1f1;
}

.attr-val-opt:hover {
  border-color: var(--scheme-color);
  color: var(--scheme-color);
  scale: 1.1;
}

.attr-val-opt.selected {
  background-color: var(--scheme-color);
  color: white;
}

.close-btn {
  margin-left: 10px;
  font-size: 18px;
  color: #525252;
  background-color: #f1f1f1;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  text-align: center;
}

.close-btn:hover {
  scale: 1.1;
  color: var(--scheme-color);
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

.product-item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}

.cate-detail-bottom {
  justify-self: center;
  margin-top: 30px;
  color: gray;
  text-align: center;
  font-size: 18px;
  letter-spacing: 3px;
}
</style>
