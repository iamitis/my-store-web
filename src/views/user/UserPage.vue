<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, provide, Ref, ref} from "vue";
import {initRouter} from "../../router";
import {userPageTitleMap, UserRole} from "../../api/user.ts";
import {curUser_role} from "../../main.ts";

const {currRouteName, navTo} = initRouter()
const currTitle = computed(() => {
  if (typeof currRouteName.value === 'undefined') {
    console.log('currRouteName.value is undefined: ' + currRouteName.value)
    return '未知页面'
  } else if (typeof currRouteName.value === 'string') {
    return userPageTitleMap.get(currRouteName.value) || '未知页面'
  }
})

// 处理 user-nav-box 的位置，使其在滚动时固定在页面顶部，但不遮挡header
const isHeaderVisible = inject('isHeaderVisible') as Ref<boolean>;
const userNavBoxTop = ref('60px');
const userNavBoxBottom = ref(0); // 提供给子页面使用
function updateUserNavBoxPosition() {
  userNavBoxTop.value = isHeaderVisible.value ? 'calc(var(--header-height) + 60px)' : '60px';
  const userNavBox = document.querySelector('.user-nav-box');
  if (userNavBox) {
    userNavBoxBottom.value = userNavBox.getBoundingClientRect().bottom;
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateUserNavBoxPosition);
  updateUserNavBoxPosition()
});
onUnmounted(() => {
  window.removeEventListener('scroll', updateUserNavBoxPosition);
});

provide('userNavBoxBottom', userNavBoxBottom);
</script>

<template>
  <!-- 用户页面标题 -->
  <el-row class="user-page-title">
    <span style="font-size: 40px; letter-spacing: 8px">{{ currTitle }}</span>
  </el-row>

  <el-row class="user-page-body">
    <!-- 用户页面导航 -->
    <el-col :span="6" class="user-nav-col">
      <div class="user-nav-box" :style="{ top: userNavBoxTop }">
        <span class="user-nav-text" @click="navTo('Overview')">总览</span>
        <span class="user-nav-text" @click="navTo('Order')">我的订单</span>
        <span class="user-nav-text" @click="navTo('ShoppingCart')">我的购物车</span>
        <span class="user-nav-text" @click="navTo('AddressBook')">管理收货地址</span>
        <span class="user-nav-text" @click="navTo('Notification')">我的消息</span>
      </div>
    </el-col>

    <!-- 用户页面内容 -->
    <el-col :span="18" class="user-content-col">
      <router-view/>
    </el-col>
  </el-row>

</template>

<style scoped>
.user-page-title {
  height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.user-page-body {
  height: calc(100vh - var(--header-height) - 130px);
  width: 90%;
  justify-self: center;
  border-top: 1px dashed #d2d1d1;
}

.user-nav-col {
}

.user-content-col {
  background: white;
}

.user-nav-box {
  width: 60%;
  justify-self: center;
  margin-top: 60px;
  padding: 20px 0;
  border-radius: 10px;
  outline: #ecebeb 20px solid;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: sticky;
  transition: top 0.3s;
}

.user-nav-text {
  font-size: 24px;
  color: #313030;
  letter-spacing: 2px;
  margin: 10px;
  cursor: pointer;
}

.user-nav-text:hover {
  color: #84b9a8;
  text-decoration-line: underline;
}
</style>