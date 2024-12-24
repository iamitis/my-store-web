<script setup lang="ts">
import {computed, inject, onMounted, onUnmounted, provide, Ref, ref} from "vue";
import {initRouter} from "../../router";
import {userPageTitleMap, UserRole} from "../../api/user.ts";
import {curUser_role, updateUser} from "../../main.ts";

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

function isSelect(navName: string) {
  return currRouteName.value === navName ? 'user-nav-selected' : '';
}

// logout
const logoutDialogVisible = ref(false)

function clickLogout() {
  logoutDialogVisible.value = true
}

function confirmLogout() {
  sessionStorage.removeItem('curUser')
  updateUser({
    id: -1,
    role: UserRole.CHILD,
    phone: '',
    password: '',
    related_phone: ''
  })
  logoutDialogVisible.value = false
  navTo('Home')
}
</script>

<template>
  <el-row class="user-page-body">
    <!-- 用户页面导航 -->
    <el-col :span="6" class="user-nav-col">
      <div class="user-nav-box" :style="{ top: userNavBoxTop }">
        <div class="user-nav-text" :class="isSelect('Overview')"
             @click="navTo('Overview')">总览
        </div>
        <div class="user-nav-text" :class="isSelect('Order')"
             @click="navTo('Order')">我的订单
        </div>
        <div class="user-nav-text" :class="isSelect('ShoppingCart')"
             @click="navTo('ShoppingCart')">我的购物车
        </div>
        <div class="user-nav-text" :class="isSelect('History')"
             @click="navTo('History')">浏览记录
        </div>
        <div class="user-nav-text" :class="isSelect('AddressBook')"
             @click="navTo('AddressBook')">管理收货地址
        </div>
        <div class="user-nav-text" :class="isSelect('Notification')"
             @click="navTo('Notification')">我的消息
        </div>
        <div class="user-nav-logout" @click="clickLogout">
          <img src="../../assets/logout.svg" alt="logout" style="width: 24px; height: 24px">
          退出登录
        </div>
      </div>
    </el-col>

    <!-- 用户页面内容 -->
    <el-col :span="18" class="user-content-col">
      <router-view/>
    </el-col>
  </el-row>

  <!-- 退出登录确认框 -->
  <el-dialog title="确定要退出登录吗？"
             v-model="logoutDialogVisible"
             width="300px"
             center>
    <div slot="footer" style="display: flex; justify-content: center">
      <el-button class="logout-cancel-button" @click="logoutDialogVisible=false">取消</el-button>
      <el-button class="logout-confirm-button" @click="confirmLogout">确定</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.user-page-body {
  height: calc(100vh - var(--header-height) - 130px);
  margin-top: 30px;
  width: 90%;
  justify-self: center;
}

.user-content-col {
  padding-top: 44px;
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

.user-nav-selected {
  color: #84b9a8;
}

.user-nav-logout {
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  font-size: 18px;
  color: var(--scheme-color-deep);
  letter-spacing: 2px;
  cursor: pointer;
}

.user-nav-logout:hover {
  text-decoration-line: underline;
}

.logout-confirm-button {
  background-color: var(--scheme-color-deep);
  color: white;
}

.logout-confirm-button:hover {
  background-color: var(--scheme-color);
}

.logout-cancel-button {
  border: 1px solid var(--scheme-color);
  color: var(--scheme-color);
}
</style>