<script setup lang="ts">
import {inject, onMounted, onUnmounted, Ref, ref} from "vue";
import {useRoute} from "vue-router";
import {
  categoryNameMap, filterProducts,
  getAttributesByCategory, getAttributeValuesByCategory,
  mockProduct, mockProductAttributeFlavor, mockProductAttributeMap, mockProductAttributeSeason, Product,
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

  // TODO: change to above
  // productList.value = new Array(10).fill(mockProduct)
})

// 排序选项
const sortOptions = [
  {label: "销量从高到低", value: "bestSeller"},
  {label: "价格从高到低", value: "price_desc"},
  {label: "价格从低到高", value: "price_asc"},
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

  // // TODO: change to above
  // attrList.value = [mockProductAttributeFlavor, mockProductAttributeSeason]
  // attrValMap.value = mockProductAttributeMap
  // for (const attr of attrList.value) {
  //   selectedAttrValMap.value.set(attr.productAttributeName!, [])
  // }
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
}

async function handleFilter() {
  let values: string[] = []
  for (const [key, value] of selectedAttrValMap.value) {
    for (const attrValue of value) {
      values.push(attrValue.value!)
    }
  }
  ElMessage.success('已选择属性值：' + values.join(', '))

  // TODO: change to below
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
function isSelected(attrValue: ProductAttributeValue) {
  const attrName = attrValue.productAttribute!.productAttributeName!
  return selectedAttrValMap.value.get(attrName)!.includes(attrValue)
}
</script>

<template>
  <div style="padding: 40px 130px">
    <!-- 分类标题 -->
    <div class="cate-name">{{ categoryName }}</div>
    <div class="cate-desc">
      我们的电子产品专为现代老年人设计，旨在提升他们的生活质量和便利性。
      无论是简单易用的智能手机、带有大字体和清晰显示的平板电脑，还是健康监测设备，
      这些产品都考虑到了老年人的需求和使用习惯。
      我们还提供个性化的智能家居设备，帮助他们更轻松地管理日常生活，如智能语音助手和远程监控系统。
      通过这些现代科技，老年人可以与家人保持联系，享受娱乐，同时提升生活的舒适度和安全性，
      让他们的晚年生活更加丰富多彩。
    </div>

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
            <div class="attribute-card" :class="{active: isPopoverVisible[index]}">
              {{ attribute.displayName }}
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

          <!-- 确认 -->
          <el-button @click="handleFilter"
                     class="attr-button">
            确认
          </el-button>
        </el-popover>
      </el-col>

      <!-- 排序 -->
      <el-col :span="6" :offset="2" class="sort-container">
        <select v-model="selectedSort" class="sort-select">
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
  padding: 25px 30px;
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

.attribute-card:hover, .attribute-card.active {
  transform: scale(1.05);
  background-color: #84b9a8;
  color: white;
}

.attr-val-opt-container {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.attr-val-opt {
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  padding: 8px;
  font-size: 18px;
  cursor: pointer;
}

.attr-val-opt:hover {
  border-color: #84b9a8;
  color: #84b9a8;
}

.attr-val-opt.selected {
  background-color: #84b9a8;
  color: white;
}

.attr-button {
  margin: 20px 0 auto auto;
  width: 60px;
  padding: 18px 0;
  font-size: 18px;
  border: 1.5px solid #84b9a8;
  color: #84b9a8;
}

.attr-button:hover {
  background-color: #84b9a8;
  color: white;
}

.sort-container {
  display: flex;
  justify-content: end;
  align-items: center;
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
</style>
