<!-- TODO: 消息红点 -->

<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, Ref, ref} from "vue";
import {initRouter} from "../router";
import {User} from "../api/user.ts";
import LogInDialog from "./LogIn.vue";
import {updateHeaderVisible} from "../main.ts";
import {UserFilled, Message, Search} from "@element-plus/icons-vue";

const {currRouteName, navTo} = initRouter()
const searchText = ref<string>('')

function clickSearch() {
  console.log("click search")
}

// 控制登录弹窗显示
const showLogin = ref(false);
// 登录成功处理
const handleLoginSuccess = (userInfo: { username: string; password: string }) => {
  console.log('登录成功:', userInfo);
  // 可以在这里调用登录接口，或跳转到用户页面
};

// 登录取消处理
const handleLoginCancel = () => {
  console.log('用户取消了登录');
};


const currUser = inject('currUser') as User

function clickNotification() {
  console.log("click notification")
  if (currUser.id === -1) {
    // 说明未登录
    ElMessage.info("请先登录")
    showLogin.value = true
  } else {
    navTo('Notification')
  }
}

function clickUser() {
  console.log("click user")
  if (currUser.id === -1) {
    // 说明未登录
    showLogin.value = true
  } else {
    navTo('UserPage', {userId: currUser.id})
  }
}

// Header向上滚动时显示，向下滚动时隐藏
let lastScrollTop = 0;
const isHeaderVisible = inject('isHeaderVisible') as Ref<boolean>;

function handleScroll() {
  if (isLogoOnly.value) {
    return
  }
  console.log("scroll")
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    updateHeaderVisible(false); // Scrolling down
  } else {
    updateHeaderVisible(true); // Scrolling up
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})

// 在某些页面只显示 Logo，不显示其他
const isLogoOnly = computed(() => {
  return somePage.includes(String(currRouteName.value))
})

const somePage = ['CreateOrder']
</script>

<template>
  <LogInDialog v-model:visible="showLogin" @loginSuccess="handleLoginSuccess" @loginCancel="handleLoginCancel"/>
  <el-row class="header-container" :class="{'hidden': !isHeaderVisible}">
    <el-col :span="10"/>
    <el-col :span="4" class="header-item">
      <el-avatar @click="navTo('Home')" title="返回首页"
                 style="background-color: #a1ccbf; cursor: pointer; height: 80px; width: 80px"/>
    </el-col>
    <el-col :span="5" class="header-item">
      <div class="header-input-container" v-if="!isLogoOnly">
        <input v-model="searchText" placeholder="搜索想要的商品"
               class="header-input"/>
        <el-icon @click="clickSearch" title="点击搜索"
                 style="cursor: pointer; color: #a1ccbf; width: 30px; height: 30px">
          <search style="width: 80%; height: 80%"/>
        </el-icon>
      </div>
    </el-col>
    <el-col :span="1" :offset="1" class="header-item" style="margin-top: 10px">
      <el-icon @click="clickNotification" title="查看消息" v-if="!isLogoOnly"
               style="cursor: pointer; background-color: white; color: #7fad9f;
               width: 50px; height: 50px; border-radius: 50%">
        <message style="width: 70%; height: 70%"/>
      </el-icon>
      <el-text v-if="!isLogoOnly" style="font-size: 18px; margin-top: 5px">消息</el-text>
    </el-col>
    <el-col :span="2" class="header-item" style="margin-top: 10px;" v-if="!isLogoOnly">
      <!-- 未登录状态： -->
      <el-icon v-if="currUser.id === -1"
               @click="clickUser" title="点击登录"
               style="cursor: pointer; background-color: white; color: #72a294;
               width: 50px; height: 50px; border-radius: 50%">
        <user-filled style="width: 70%; height: 70%"/>
      </el-icon>
      <el-text v-if="currUser.id === -1"
               @click="clickUser" title="点击登录"
               style="font-size: 18px">
        登录
      </el-text>
      <!-- 已登录状态： -->
      <el-icon v-if="currUser.id !== -1"
               @click="clickUser" title="查看个人主页"
               style="cursor: pointer; background-color: white; color: #76a899;
               width: 50px; height: 50px; border-radius: 50%">
        <user-filled style="width: 70%; height: 70%"/>
      </el-icon>
      <el-text v-if="currUser.id !== -1"
               @click="clickUser" title="查看个人主页"
               style="font-size: 18px; margin-top: 5px">
        个人主页
      </el-text>
    </el-col>
  </el-row>
</template>

<style scoped>
.header-container {
  height: var(--header-height);
  width: 100%;
  position: fixed;
  top: 0;
  transition: top 0.3s;
  z-index: 200; /* 保证在最上层 */

  background-color: #ecebeb;
  border-bottom: 1px dashed #d2d1d1;
}

.header-container.hidden {
  top: calc(-1 * var(--header-height));
}

.header-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header-input-container {
  height: 50px;
  width: 100%;
  border-radius: 25px;
  background-color: white;
  border: solid #a1ccbf;

  display: flex;
  align-items: center;
}

.header-input {
  border: none;
  height: 80%;
  width: 85%;
  margin-left: 16px;
  font-size: 20px;
}

.header-input:focus {
  outline: none;
}
</style>