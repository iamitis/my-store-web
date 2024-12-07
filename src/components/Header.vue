<!-- TODO: 消息红点 -->

<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref} from "vue";
import {initRouter} from "../router";
import {User} from "../api/user.ts";
import LogInDialog from "../views/LogInDialog.vue";

const {navTo} = initRouter()
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
  if (currUser.userId === -1) {
    // 说明未登录
    ElMessage.info("请先登录")
    showLogin.value = true
  } else {
    navTo('Notification')
  }
}

function clickUser() {
  console.log("click user")
  if (currUser.userId === -1) {
    // 说明未登录
    showLogin.value = true
  } else {
    navTo('User', {userId: currUser.userId})
  }
}

const isHeaderVisible = ref(true)
let lastScrollTop = 0;

function handleScroll() {
  console.log("scroll")
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    isHeaderVisible.value = false; // Scrolling down
  } else {
    isHeaderVisible.value = true; // Scrolling up
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})
</script>

<template>
  <LogInDialog v-model:visible="showLogin" @loginSuccess="handleLoginSuccess" @loginCancel="handleLoginCancel"/>
  <el-row class="header-container" :class="{'hidden': !isHeaderVisible}">
    <el-col :span="10"/>
    <el-col :span="4" class="header-item">
      <el-avatar @click="navTo('Home')" title="返回首页"
                 style="cursor: pointer; height: 70px; width: 70px"/>
    </el-col>
    <el-col :span="5" class="header-item">
      <div class="header-input-container">
        <input v-model="searchText" placeholder="搜索想要的商品"
               class="header-input"/>
        <img @click="clickSearch" title="点击搜索"
             src="../assets/search.svg" alt="search" style="cursor: pointer"/>
      </div>
    </el-col>
    <el-col :span="1" :offset="1" class="header-item" style="margin-top: 10px">
      <img @click="clickNotification" title="查看消息"
           src="../assets/notification.svg" alt="notification"
           style="cursor: pointer; width: 40px; height: 40px"/>
      <el-text style="font-size: 18px">消息</el-text>
    </el-col>
    <el-col :span="2" class="header-item" style="margin-top: 10px;">
      <!-- 未登录状态： -->
      <img v-if="currUser.userId === -1"
           @click="clickUser" title="点击登录"
           src="../assets/user.svg" alt="user"
           style="cursor: pointer; width: 40px; height: 40px"/>
      <el-text v-if="currUser.userId === -1"
               @click="clickUser" title="点击登录"
               style="font-size: 18px">
        登录
      </el-text>
      <!-- 已登录状态： -->
      <img v-if="currUser.userId !== -1"
           @click="clickUser" title="查看个人主页"
           :src="currUser.userAvatar" alt="user"
           style="cursor: pointer; width: 40px; height: 40px"/>
      <el-text v-if="currUser.userId !== -1"
               @click="clickUser" title="查看个人主页"
               style="font-size: 18px">
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
  background-color: gray;
  z-index: 200; /* 保证在最上层 */
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
  border: solid;
  background-color: white;

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