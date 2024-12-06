<script setup lang="ts">

import {useRoute} from "vue-router";

const categoryName = useRoute().params.categoryName


</script>

<template>
  <h1>{{categoryName}}</h1>
</template>

<style scoped>

</style>