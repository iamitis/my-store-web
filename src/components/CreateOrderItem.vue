<script setup lang="ts">
import {CartItem} from "../api/user.ts";
import {formatPrice, getProductOptionValues, mockOptionMap, ProductOptionValue} from "../api/product.ts";
import {onMounted, PropType, ref} from "vue";

const item = defineModel('item', {
  type: Object as PropType<CartItem>,
  required: true
})

const optionMap = ref<Map<string, ProductOptionValue[]>>(new Map)
onMounted(async () => {
  // // 获取商品选项，用于重选
  // const response = await getProductOptionValues(item.value.product!.productId!)
  // if (response.data.code !== '000') {
  //   ElMessage.error('获取商品选项失败' + response.data.msg)
  // } else {
  //   const optionValues = response.data.result
  //   for (const optionValue of optionValues) {
  //     if (!optionMap.value.has(optionValue.productOptionName!)) {
  //       optionMap.value.set(optionValue.productOptionName!, [])
  //     }
  //     optionMap.value.get(optionValue.productOptionName!)!.push(optionValue)
  //   }
  // }

  // TODO: change to above
  optionMap.value = mockOptionMap
})

function handleChangeOption() {
}

const emit = defineEmits(['updateQuantity'])

function handleQuantityChange() {
  emit('updateQuantity')
}
</script>

<template>
  <el-row v-if="item.product" class="c-o-i-container">
    <el-col :span="2" class="c-o-i-col">
      <img :src="item.product.productCover" alt="商品图片"
           style="width: 100px; height: 100px; object-fit: cover; margin-left: 10px; border-radius: 10px">
    </el-col>
    <el-col :span="6" class="c-o-i-col" style="align-items: start">
      <p style="width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
        {{ item.product.productName }}
      </p>
    </el-col>
    <el-col :span="8" class="c-o-i-col" style="align-items: start; gap: 5px">
      <span v-for="option in item.productOptionValues" style="display: flex;">
        <span style="font-size: 17px; color: #676666; width: 100%">{{ option.productOptionName }}</span>
        <!--        <span class="c-o-i-option" title="更改" @click="handleChangeOption">-->
        <!--          {{ option.value }} ▼-->
        <!--        </span>-->
        <select v-model="option.value" class="c-o-i-select"
                   @change="handleChangeOption">
          <option v-for="value in optionMap.get(option.productOptionName!)!"
                  :value="value.value" class="c-o-i-option">
            {{ value.value }}
          </option>
        </select>
      </span>
    </el-col>
    <el-col :span="2" class="c-o-i-col">
      {{ formatPrice(item.product.productNowPrice!) }}
    </el-col>
    <el-col :span="2" :offset="1" class="c-o-i-col">
      <input v-model="item.quantity" type="number"
             :min="1" title="修改商品数量"
             @change="handleQuantityChange"
             class="c-o-i-product-quantity"/>
    </el-col>
    <el-col :span="2" :offset="1" class="c-o-i-col">
      {{ formatPrice(item.product.productNowPrice! * item.quantity!) }}
    </el-col>
  </el-row>
</template>

<style scoped>
.c-o-i-container {
  font-size: 20px;
  align-items: center;
  border-radius: 10px;
  padding-right: 10px;
}

.c-o-i-container:hover {
  background-color: #f0f0f0;
}

.c-o-i-col {
  text-align: center;
  color: #84b9a8;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.c-o-i-select {
  padding: 3px;
  margin-left: 10px;
  border: 1px solid #84b9a8;
  border-radius: 5px;
  font-size: 16px;
  color: #84b9a8;
  cursor: pointer;
  outline: none;
}
.c-o-i-select:hover, .c-o-i-select:focus {
  color: white;
  background-color: #84b9a8;
}

.c-o-i-option {
  color: #84b9a8;
  font-size: 16px;
  cursor: pointer;
  background-color: white;
}

.c-o-i-product-quantity {
  outline: none;
  border: none;
  width: 60px;
  height: 50px;
  font-size: 20px;
  margin-top: 10px;
  padding-left: 5px;
  border-radius: 10px;
  color: #84b9a8;
  margin-bottom: 6px;
  margin-left: 40px;
}

.c-o-i-product-quantity:focus {
  background-color: #d4ece4;
  color: #414040;
}

.c-o-i-product-quantity:hover {
  border: #d4ece4 2px solid;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  padding: 8px;
  height: 20px;
}
</style>