<script setup lang="ts">
import Header from "./components/Header.vue";

</script>

<template>
  <Header ref =loginDialogRef />

  <div class="home-body">
    <router-view/>
  </div>

</template>

<style scoped>
.home-body {
  margin-top: var(--header-height);
}
</style>
