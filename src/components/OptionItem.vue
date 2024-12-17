<script setup lang="ts">
import {ProductOptionValue} from "../api/product.ts";

const props = defineProps<{
  optionValue: ProductOptionValue
}>()
</script>

<template>
  <div class="o-i-container">
    {{ props.optionValue.value }}
  </div>
</template>

<style scoped>
.o-i-container {
  border: 1px solid #e2e2e2;
  border-radius: 10px;
}
</style>