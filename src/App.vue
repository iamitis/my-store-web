<script setup lang="ts">
import Header from "./components/Header.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { Top } from "@element-plus/icons-vue";
import { tsParticles } from "tsparticles";
import { loadFull } from "tsparticles";

// 返回顶部逻辑
const showBackToTop = ref(false);
function handleScroll() {
  showBackToTop.value = window.scrollY > 200;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

onMounted(() => {
  loadFull(tsParticles).then(() => {
    tsParticles.load("tsparticles", {
      particles: {
        number: { value: 80 },
        color: { value: "#dedede" },
        links: { enable: true, distance: 150, color: "#dedede" },
        move: { enable: true, speed: 2 },
      },
    });
  });
});

</script>

<template>

  <!-- 页面内容 -->
  <div id="app">
    <Header />

    <div class="home-body">
      <router-view />
    </div>

    <!-- 返回顶部按钮 -->
    <button
        v-if="showBackToTop"
        @click="scrollToTop"
        title="返回顶部"
        class="back-to-top"
    >
      <el-icon size="40">
        <top />
      </el-icon>
    </button>
  </div>
</template>

<style scoped>

/* 主内容区域 */
.home-body {
  margin-top: var(--header-height);
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 50px;
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #8fc0af;
  background-color: white;
  color: #91c4b3;
}

.back-to-top:hover {
  background-color: #c8e7dc;
}
</style>
