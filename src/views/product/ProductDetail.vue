<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {
  formatPrice,
  getProductById, getProductOptions, getProductOptionValues, mockOptionColor, mockOptionMap, mockOptionSize,
  mockOptionValue1, mockOptionValue4,
  mockProduct,
  Product,
  ProductOption, ProductOptionValue
} from "../../api/product.ts";
import {useRoute} from "vue-router";
import {addToShoppingCart, CartItem, User} from "../../api/user.ts";
import {initRouter} from "../../router";
import OptionItem from "../../components/OptionItem.vue";

const currUser = inject('currUser') as User
const {navTo} = initRouter()
const productData = ref<Product>()
const productId = Number(useRoute().params.productId)

onMounted(async () => {
  // const response = await getProductById(productId)
  // if (response.data.code !== '200') {
  //   ElMessage.error("获取商品信息失败 " + response.data.msg)
  // } else {
  //   productData.value = response.data.result
  // }

  // TODO: change to above
  productData.value = mockProduct
})

const scrollToComment = () => {
  const commentSection = document.querySelector('.product-detail-comment');
  if (commentSection) {
    commentSection.scrollIntoView({behavior: 'smooth'});
  }
}

// 鼠标悬浮放大
function handleMouseMove(event: MouseEvent) {
  const imgContainer = event.currentTarget as HTMLElement;
  const img = imgContainer.querySelector('img') as HTMLImageElement;
  const rect = imgContainer.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  img.style.transformOrigin = `${x}px ${y}px`;
}

// 点击查看大图
const showModal = ref(false)
const largeImageSrc = ref('')

function openModal(src: string) {
  largeImageSrc.value = src;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

const productOptionList = ref<ProductOption[]>([])
const optionMap = ref<Map<string, ProductOptionValue[]>>(new Map()) // 选项名 -> 选项值
const selectedValues = ref<Map<string, ProductOptionValue>>(new Map()) // 每个类选中的值
onMounted(async () => {
      // // 获取商品的选项类
      // const response = await getProductOptions(productId)
      // if (response.data.code !== '000') {
      //   ElMessage.error("获取商品选项失败 " + response.data.msg)
      // } else {
      //   productOptionList.value = response.data.result
      //   // 初始化selectedValues
      //   for (const option of productOptionList.value) {
      //     selectedValues.value.set(option.productOptionName!, {})
      //   }
      //   // 获取商品的所有选项值
      //   const optionValueResponse = await getProductOptionValues(productId)
      //   if (optionValueResponse.data.code !== '000') {
      //     ElMessage.error("获取商品选项值失败 " + optionValueResponse.data.msg)
      //   } else {
      //     // 将选项值按选项名存入map
      //     for (const value of optionValueResponse.data.result) {
      //       if (!optionMap.value.has(value.productOptionName!)) {
      //         optionMap.value.set(value.productOptionName!, [])
      //       }
      //       optionMap.value.get(value.productOptionName!)!.push(value)
      //     }
      //   }
      //
      // }

      // TODO: change to above
      productOptionList.value = [mockOptionColor, mockOptionSize]
      optionMap.value = mockOptionMap
      for (const option of productOptionList.value) {
        selectedValues.value.set(option.productOptionName!, {})
      }
    }
)

function emitSelect(optionName: string, value: ProductOptionValue) {
  const oldValue = selectedValues.value.get(optionName)
  if (oldValue?.value === value.value) {
    selectedValues.value.set(optionName, {})
    return;
  }
  selectedValues.value.set(optionName, value)
}

const quantity = ref(1) // 购买数量
async function handleAddCart() {
  if (currUser.id === -1) {
    ElMessage.info('请先登录');
    // TODO: login dialog
    return;
  }

  // 检查是否选择了所有选项
  let pleaseSelect: string[] = []
  for (const [key, value] of selectedValues.value) {
    if (value.value === undefined) {
      pleaseSelect.push(key)
    }
  }
  if (pleaseSelect.length > 0) {
    ElMessage.warning('请选择 ' + pleaseSelect.join('、'))
    return;
  }

  ElMessage.info('加入购物车: ' + productData.value?.productName + '没接后端');

  // TODO: change to below
  // const cartItem: CartItem = {
  //   userId: currUser.id!,
  //   product: productData.value!,
  //   productOptionValues: [],
  //   quantity: quantity.value,
  //   cartItemDate: new Date(),
  // }
  // for (const [key, value] of selectedValues.value) {
  //   cartItem.productOptionValues!.push(value)
  // }
  // const response = await addToShoppingCart(cartItem)
  // if (response.data.code !== '000') {
  //   ElMessage.error("加入购物车失败 " + response.data.msg)
  // } else {
  //   ElMessage.success("加入购物车成功")
  // }
}

function handleBuy() {
  if (currUser.id === -1) {
    ElMessage.warning('请先登录');
    // TODO: login dialog
    return;
  }

  // 检查是否选择了所有选项
  let pleaseSelect: string[] = []
  for (const [key, value] of selectedValues.value) {
    if (value.value === undefined) {
      pleaseSelect.push(key)
    }
  }
  if (pleaseSelect.length > 0) {
    ElMessage.warning('请选择 ' + pleaseSelect.join('、'))
    return;
  }

  sessionStorage.setItem('productList',
      JSON.stringify([{
        product: productData.value!,
        productOptionValues: Array.from(selectedValues.value.values()),
        quantity: quantity.value
      }]))
  navTo('CreateOrder')
}

</script>

<template>
  <el-row v-if="productData">
    <!-- 商品图片 -->
    <el-col :span="13">
      <div class="product-detail-img-container"
           @click="openModal(productData.productCover!)"
           @mousemove="handleMouseMove">
        <img :src="productData.productCover" alt="商品图片"
             style="object-fit: cover; width: 100%; height: 100%; border-radius: inherit">
      </div>
    </el-col>

    <!-- 商品信息 -->
    <el-col :span="9" class="product-detail-info">
      <!-- 商品评分 -->
      <el-rate v-if="productData.productScoreCount! > 0"
               v-model="productData.productScore" disabled
               :texts="new Array(5).fill(`(${productData.productScoreCount})`)"
               show-text
               @click="scrollToComment" title="查看评论"
               class="product-detail-rate"/>

      <!-- 商品名称 -->
      <span style="font-size: 30px; font-weight: bold">
        {{ productData.productName }}
      </span>

      <!-- 商品价格 -->
      <div style="">
        <span v-if="productData.productOriginalPrice !== productData.productNowPrice"
              style="font-size: 20px; text-decoration: line-through; color: #999;">
          {{ formatPrice(productData.productOriginalPrice! * quantity) }}
        </span>
        <span v-if="productData.productOriginalPrice !== productData.productNowPrice"
              style="font-size: 25px; color: #ea0202;">
          {{ formatPrice(productData.productNowPrice! * quantity) }}
        </span>
        <span v-if="productData.productOriginalPrice === productData.productNowPrice"
              style="font-size: 25px; color: #363636">{{ formatPrice(productData.productNowPrice! * quantity) }}</span>
      </div>

      <!-- 用户操作区 -->
      <div class="product-detail-operation-box">
        <el-row v-for="option in productOptionList" style="font-size: 18px;">
          <el-col :span="4" class="product-detail-operation-title" style="margin-top: 10px">
            {{ option.productOptionName }}
          </el-col>
          <el-col :span="20" style="display: flex; flex-flow: row wrap">
            <option-item v-for="item in optionMap.get(option.productOptionName!)"
                         :optionValue="item"
                         :selected-value="selectedValues.get(item.productOptionName!)"
                         @click="emitSelect(item.productOptionName!, item)"/>
          </el-col>
        </el-row>
        <el-row style="font-size: 18px">
          <el-col :span="4" class="product-detail-operation-title">
            数量
          </el-col>
          <el-input-number v-model="quantity" :min="1" :max="999" style="width: 100px; margin-left: 10px"/>
        </el-row>
        <el-row class="product-detail-button-group">
          <el-col :span="8" class="product-detail-add-cart" @click="handleAddCart">
            加入购物车
          </el-col>
          <el-col :span="16" class="product-detail-buy" @click="handleBuy">
            立即购买
          </el-col>
        </el-row>
      </div>
    </el-col>

    <!-- 查看大图 -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <img :src="largeImageSrc" alt="商品图片" class="modal-content">
    </div>
  </el-row>

  <!-- 商品详情 -->
  <div v-if="productData" class="product-detail-desc">
    <p style="font-size: 20px; color: #252424">
      商品详情
    </p>
    <p v-if="productData.productDescription"
       style="font-size: 18px; color: #444343">
      {{ productData!.productDescription }}
    </p>
  </div>

  <!-- 商品评论 -->
  <div v-if="productData"
       class="product-detail-comment">
    <p style="font-size: 20px; color: #252424">
      商品评论
    </p>
    <p v-if="!productData.productCommentList"
       style="font-size: 20px; color: #252424">
      暂无评论
    </p>
  </div>
</template>

<style scoped>
.product-detail-img-container {
  height: 760px;
  width: 760px;
  margin: 30px 0 auto auto;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  cursor: zoom-in;
}

.product-detail-img-container img {
  transition: transform 0.3s ease-in; /* 放大过程持续0.3s，逐渐加速 */
}

.product-detail-img-container:hover img {
  transform: scale(1.5); /* 放大1.5倍 */
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

.modal-content {
  width: 850px;
  height: 850px;
  object-fit: cover;
}

.product-detail-info {
  height: 80vh;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-top: 30px;
}

.product-detail-rate {
  height: 8px;
  margin-top: 30px;
}

:deep(.product-detail-rate .el-rate__item) {
  font-size: 14px;
  --el-rate-icon-size: 30px;
  --el-rate-icon-margin: 0;
  cursor: pointer;
}

.product-detail-operation-box {
  width: 80%;
  border: 1px solid #dcdcdc;
  border-radius: 20px;
  margin: 20px;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-detail-operation-title {
  text-align: justify;
  text-align-last: justify;
  padding-right: 8px;
  color: #727171;
}

.product-detail-button-group {
  width: 90%;
  height: 60px;
  border-radius: 30px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  font-size: 20px;
}

.product-detail-add-cart {
  background-color: #f6c937;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-detail-add-cart:hover {
  background-color: #f8da44;
}

.product-detail-buy {
  background-color: #fc2626;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-detail-buy:hover {
  background-color: #fa4d26;
}

.product-detail-desc {
  width: calc(70% + 20px);
  justify-self: center;
  border-radius: 20px;
  border: 1px solid #dcdcdc;
  padding: 20px;
  margin-top: 40px;
}

.product-detail-comment {
  width: calc(70% + 20px);
  justify-self: center;
  border-radius: 20px;
  border: 1px solid #dcdcdc;
  padding: 20px;
  margin-top: 40px;
}
</style>