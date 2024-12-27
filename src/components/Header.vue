<!-- TODO: 消息红点 -->

<script setup lang="ts" xmlns:el-col="http://www.w3.org/1999/html">
import {computed, inject, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import {initRouter} from "../router";
import {getCartCount, User, UserRole} from "../api/user.ts";
import LogInDialog from "./LogIn.vue";
import LLMReplyDialog from "./LLM.vue";
import {updateHeaderVisible, updateUser} from "../main.ts";
import {UserFilled, Message, Search, ShoppingTrolley} from "@element-plus/icons-vue";
import eventBus from "../utils/eventBus.ts";
import {useRoute} from "vue-router";
import {isHaveUnreadNotice, isThereUnreadNotice, isUnreadNotice} from "../api/noteice.ts";

const {currRouteName, navTo} = initRouter()
const searchText = ref<string>('')

function clickSearch() {
  if (!searchText.value.trim()) {
    ElMessage.warning("请输入搜索内容");
    return;
  }
  sessionStorage.setItem('searchText', searchText.value)
  eventBus.emit('searchProduct')
  navTo('SearchPage')
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


const dialogVisible = ref(false); // 控制弹框显示
const llmInputText = ref<string>(''); // 绑定左侧输入框的内容
const llmResponse = ref<string>(''); // 绑定弹框中的内容

function clickLLMInput() {
  if (!llmInputText.value.trim()) {
    ElMessage.warning("请输入内容后再发送");
    return;
  }
  dialogVisible.value = true; // 显示弹框
  console.log("用户输入的问题:", llmInputText.value);

}

function handleLLMReplySuccess() {
  //llmResponse.value = response;
  dialogVisible.value = false;
}

function handleLLMReplyCancel() {
  dialogVisible.value = false;
}

function getLLMInput(): string {
  console.log('llmInputText:', llmInputText.value);

  return llmInputText.value;
}

watch(
    () => currUser.id, // 监听的变量
    (newId, oldId) => {
      console.log(`用户ID变化: 从 ${oldId} 到 ${newId}`);
      isHaveUnreadNotice();
    }
);
let intervalId:number;
onMounted(() => {
  intervalId = setInterval(isHaveUnreadNotice, 1000); // Call every 10 seconds
})
onUnmounted(() => {
  clearInterval(intervalId);
})

function clickCart() {
  console.log("click cart")
  if (currUser.id === -1) {
    // 说明未登录
    ElMessage.warning("请先登录")
    showLogin.value = true
  } else {
    navTo('ShoppingCart')
  }
}

const cartCount = ref(0)

async function updateCartCount() {
  if (currUser.id !== -1) {
    cartCount.value = await getCartCount(currUser.id!)
  }
}

onMounted(() => {
  eventBus.on('updateCartCount', updateCartCount)
  updateCartCount()
})
onUnmounted(() => {
  eventBus.off('updateCartCount')
})

const isInputExpanded = ref(false);

function expandInput() {
  isInputExpanded.value = !isInputExpanded.value;
}
</script>

<template>
  <LogInDialog v-model:visible="showLogin" @loginSuccess="handleLoginSuccess" @loginCancel="handleLoginCancel"/>
  <LLMReplyDialog v-model:visible="dialogVisible" :msg="getLLMInput()"/>

  <el-row class="header-container" :class="{'hidden': !isHeaderVisible}">
    <el-col :span="9" class="header-item"
            style="flex-direction: row; justify-content: start; gap: 10px">
      <img src="../assets/robot.svg" @click="expandInput" alt="robot"
           style="border-radius: 50%;
           width: 38px; height: 38px; padding: 7px;">
      <div class="llm-input-container" v-if="isInputExpanded">
        <input v-model="llmInputText" placeholder="提问人工智能"
               class="llm-input" @keyup.enter="clickLLMInput"/>
        <el-icon title="提问人工智能"
                 style="cursor: pointer; color: #a1ccbf; width: 30px; height: 30px"
                  @click="clickLLMInput">
          <search style="width: 80%; height: 80%"/>
        </el-icon>
      </div>
    </el-col>


    <el-col :span="4" class="header-item">
      <el-avatar @click="navTo('Home')" title="返回首页"
                 src="src/assets/logo.png"
                 style="background-color: #a1ccbf; cursor: pointer; height: 85px; width: 85px"/>
    </el-col>
    <el-col :span="4" class="header-item">
      <div class="header-input-container" v-if="!isLogoOnly">
        <input v-model="searchText" placeholder="搜索想要的商品"
               class="header-input" @keyup.enter="clickSearch"/>
        <el-icon @click="clickSearch" title="点击搜索"
                 style="cursor: pointer; color: var(--scheme-color-deep); width: 30px; height: 30px">
          <search style="width: 80%; height: 80%"/>
        </el-icon>
      </div>
    </el-col>

    <el-col :span="4" :offset="1" class="header-icon-container" style="margin-top: 10px">
      <!-- 购物车 -->
      <div class="header-icon" style="position: relative">
        <el-icon @click="clickCart" title="查看购物车"
                 style="cursor: pointer; background-color: white; color: var(--scheme-color-deep);
                 width: 50px; height: 50px; border-radius: 50%">
          <shopping-trolley style="width: 85%; height: 85%"/>
        </el-icon>
        <el-text @click="clickCart" title="查看购物车"
                 style="font-size: 18px; margin-top: 5px">
          购物车
        </el-text>
        <div v-if="currUser.id !== -1" class="cart-count">{{ cartCount }}</div>
      </div>

      <!-- 消息 -->
      <div class="header-icon">
        <div class="notification-container" @click="clickNotification" title="查看消息" v-if="!isLogoOnly">
          <el-icon
              style="cursor: pointer; background-color: white; color: var(--scheme-color-deep); width: 50px; height: 50px; border-radius: 50%">
            <message style="width: 70%; height: 70%"/>
          </el-icon>
          <!-- 红点 -->
          <div v-if="isUnreadNotice" class="notification-badge"></div>
        </div>
        <el-text v-if="!isLogoOnly" style="font-size: 18px; margin-top: 5px">消息</el-text>
      </div>

      <!-- 用户 -->
      <div class="header-icon">
        <!-- 未登录状态： -->
        <el-icon v-if="currUser.id === -1"
                 @click="clickUser" title="点击登录"
                 style="cursor: pointer; background-color: white; color: var(--scheme-color-deep);
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
                 style="cursor: pointer; background-color: white; color: var(--scheme-color-deep);
               width: 50px; height: 50px; border-radius: 50%">
          <user-filled style="width: 70%; height: 70%"/>
        </el-icon>
        <el-text v-if="currUser.id !== -1"
                 @click="clickUser" title="查看个人主页"
                 style="font-size: 18px; margin-top: 5px">
          个人主页
        </el-text>
      </div>
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

  background-color: #e7dfed;
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

.llm-input-container {
  height: 50px;
  width: 35%;
  border-radius: 25px;
  background-color: white;
  border: solid #a1ccbf;
  display: flex;
  align-items: center;
}

.llm-input {
  border: none;
  height: 80%;
  width: 85%;
  margin-left: 16px;
  font-size: 20px;
  color: #656464;
}

.llm-input:focus {
  outline: none;
}

.header-icon-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.header-icon {
  width: 85px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.cart-count {
  position: absolute;
  top: 10px;
  width: 20px;
  height: 20px;
  font-size: 13px;
  font-weight: bold;
  color: var(--scheme-color-deep);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  z-index: 3;
}

.menu-item {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #5e5d5d;
}

.menu-item:hover, .isSelected {
  color: var(--scheme-color-deep);
}

.menu-item-discount {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #e3877d;
}

.menu-item-discount:hover {
  color: var(--scheme-color-deep);
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

.notification-container {
  position: relative;
  display: inline-block;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 5px;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  border: 2px solid white; /* 添加一个白色边框，和背景分离 */
  z-index: 10;
}


</style>