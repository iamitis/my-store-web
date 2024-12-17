<script setup lang="ts">
import {ProductOptionValue} from "../api/product.ts";
import {computed} from "vue";

const props = defineProps<{
  optionValue: ProductOptionValue
  selectedValue: ProductOptionValue
}>()

const isSelected = computed(() => {
  return props.optionValue.value === props.selectedValue.value
})

const fontColor = computed(() => {
  return isSelected.value ? '#84b9a8' : '#333232'
})

const borderColor = computed(() => {
  return isSelected.value ? '#84b9a8' : '#e2e2e2'
})
</script>

<template>
  <div class="o-i-container">
    {{ props.optionValue.value }}
  </div>
</template>

<style scoped>
.o-i-container {
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  color: v-bind(fontColor);
  border: 1px solid v-bind(borderColor);
  margin-left: 10px;
  margin-bottom: 10px;
}

.o-i-container:hover {
  color: #84b9a8;
  border-color: #84b9a8;
}
</style>