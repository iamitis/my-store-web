<!-- TODO: 消息红点 -->

<script setup lang="ts" xmlns:el-col="http://www.w3.org/1999/html">
import {computed, inject, onMounted, onUnmounted, Ref, ref} from "vue";
import {initRouter} from "../router";
import {User, UserRole} from "../api/user.ts";
import LogInDialog from "./LogIn.vue";
import {updateHeaderVisible, updateUser} from "../main.ts";
import {UserFilled, Message, Search} from "@element-plus/icons-vue";
import eventBus from "../utils/eventBus.ts";
import {useRoute} from "vue-router";

const {currRouteName, navTo} = initRouter()
const searchText = ref<string>('')

function clickSearch() {
  console.log("click search")
}

// 控制登录弹窗显示
const showLogin = ref(false);
onMounted(() => {
  eventBus.on('showLogin', () => {
    showLogin.value = true;
  });
})
onUnmounted(() => {
  eventBus.off('showLogin');
})
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
    ElMessage.warning("请先登录")
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

function logout() {
  updateUser({
    id: -1,
    role: UserRole.CHILD,
    phone: '',
    password: '',
    related_phone: ''
  })
  navTo('Home');
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

function navToCategoryDetail(backEndName: string) {
  navTo('CategoryDetail', {backEndName: backEndName})
}

const route = useRoute()
function isSelected(backEndName: string) {
  return currRouteName.value === 'CategoryDetail' && route.params.backEndName === backEndName
}

const llmInputText = ref<string>(''); // 绑定左侧输入框的内容

function clickLLMInput() {
  if (!llmInputText.value.trim()) {
    ElMessage.warning("请输入内容后再发送");
    return;
  }

  console.log("用户输入的问题:", llmInputText.value);
  // 在这里调用你的 LLM 接口
  // 例如：
  // await fetchLLMResponse(llmInputText.value).then(response => {
  //   console.log("LLM 响应:", response);
  // });

  llmInputText.value = ''; // 清空输入框内容
}

</script>

<template>
  <LogInDialog v-model:visible="showLogin" @loginSuccess="handleLoginSuccess" @loginCancel="handleLoginCancel"/>
  <el-row class="header-container" :class="{'hidden': !isHeaderVisible}">
    <el-col :span="5"/>


    <el-col :span="5" class="header-item">
      <div class="header-input-container">
        <input v-model="llmInputText" placeholder="提问人工智能"
               class="header-input"/>
        <el-icon @click="clickLLMInput" title="发送问题"
                 style="cursor: pointer; color: #a1ccbf; width: 30px; height: 30px">
          <search style="width: 80%; height: 80%"/>
        </el-icon>
      </div>
    </el-col>



    <el-col :span="4" class="header-item">
      <el-avatar @click="navTo('Home')" title="返回首页"
                 src="src/assets/logo.png"
                 style="background-color: #a1ccbf; cursor: pointer; height: 85px; width: 85px"/>
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
               style="font-size: 18px; margin-top: 5px">
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

    <el-col :span="1">

      <el-button v-if="currUser.id !== -1"
                 @click="logout" title="退出登录"
                 style="font-size: 12px;margin-left: -25px ;margin-top: 40px; display: flex; align-items: center; cursor: pointer; text-decoration: none;">
        退出登录
      </el-button>
    </el-col>

    <!-- 分类菜单区域 -->
    <div class="menu-track" v-if="!isLogoOnly">
      <span class="menu-item-discount" title="查看折扣商品" @click="navTo('Discount')">折扣</span>
      <span class="menu-item" :class="{'isSelected': isSelected('FOOD')}" title="查看相关商品"
            @click="navToCategoryDetail('FOOD')">食品</span>
      <span class="menu-item" :class="{'isSelected': isSelected('APPAREL')}" title="查看相关商品"
            @click="navToCategoryDetail('APPAREL')">服装</span>
      <span class="menu-item" :class="{'isSelected': isSelected('ELECTRONICS')}" title="查看相关商品"
            @click="navToCategoryDetail('ELECTRONICS')">电子产品</span>
      <span class="menu-item" :class="{'isSelected': isSelected('PET_SUPPLIES')}" title="查看相关商品"
            @click="navToCategoryDetail('PET_SUPPLIES')">宠物用品</span>
      <span class="menu-item" :class="{'isSelected': isSelected('HEALTH_PRODUCTS')}" title="查看相关商品"
            @click="navToCategoryDetail('HEALTH_PRODUCTS')">保健品</span>
      <span class="menu-item" :class="{'isSelected': isSelected('BATH_PRODUCTS')}" title="查看相关商品"
            @click="navToCategoryDetail('BATH_PRODUCTS')">洗浴用品</span>
    </div>
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

  background-color: #f3f1f1;
  border-bottom: 1px dashed #d2d1d1;

  display: flex;
  justify-content: center;
}

.header-container.hidden {
  top: calc(-1.3 * var(--header-height));
}

.header-item {
  height: 80%;
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

.menu-track {
  height: 60px;
  padding: 0 50px;
  background: white;
  border-bottom: 1px dashed #e8e8e8;
  border-radius: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 45px;
  margin-top: -10px;
  z-index: 3;
}

.menu-item {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #5e5d5d;
}

.menu-item:hover, .isSelected {
  color: #a1ccbf;
}

.menu-item-discount {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #e3877d;
}

.menu-item-discount:hover {
  color: #a1ccbf;
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
  font-size: 18px; /* 根据左侧区域调整字体大小 */
}

.header-input:focus {
  outline: none;
}

</style>