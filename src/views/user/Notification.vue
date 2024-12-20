<script setup>
import { ref } from "vue";
import {Notice,NoticeSource,NoticeStatus} from "../../api/noteice.js";


const example_notice1 : Notice = {
  noticeId :1,
  noticeSource:NoticeSource.DISCOUNT_MESSAGE,
  title:"新品上架",
  content:"我们有新的商品上架了，快来看看吧！",
  createDate:"2024-12-20",
  noticeStatus:NoticeStatus.UNREAD,
};

const example_notice2 : Notice = {
  id: 1,
  source: "店家",
  title: "新品上架",
  content: "我们有新的商品上架了，快来看看吧！",
  date: "2024-12-20",
};

// 示例通知数据
const notifications = ref([
  {
    id: 2,
    source: "订单状态",
    title: "订单已发货",
    content: "您的订单 #123456 已经发货，请注意查收。",
    date: "2024-12-19",
  },
  {
    id: 3,
    source: "店家",
    title: "优惠活动",
    content: "本店大促销，所有商品享受八折优惠，限时两天！",
    date: "2024-12-18",
  },
]);

// 当前选中的通知
const selectedNotification = ref(notifications.value[0]);

// 点击通知切换右侧内容
function selectNotification(notification) {
  selectedNotification.value = notification;
}
</script>

<template>
  <div class="notification-container">
    <!-- 左侧通知列表 -->
    <div class="notification-list">
      <h3>通知列表</h3>
      <ul>
        <li
            v-for="notification in notifications"
            :key="notification.id"
            :class="{ selected: notification.id === selectedNotification.id }"
            @click="selectNotification(notification)"
        >
          <h4>{{ notification.title }}</h4>
          <p>{{ notification.source }} - {{ notification.date }}</p>
        </li>
      </ul>
    </div>

    <!-- 右侧通知内容 -->
    <div class="notification-detail">
      <h3>{{ selectedNotification.title }}</h3>
      <p><strong>来源：</strong>{{ selectedNotification.source }}</p>
      <p><strong>日期：</strong>{{ selectedNotification.date }}</p>
      <div class="content">{{ selectedNotification.content }}</div>
    </div>
  </div>
</template>

<style scoped>
.notification-container {
  display: flex;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

/* 左侧通知列表 */
.notification-list {
  width: 250px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  padding: 10px;
}

.notification-list h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
}

.notification-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-list li {
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-list li:hover {
  background-color: #f0f0f0;
}

.notification-list li.selected {
  background-color: #cce7ff;
}

.notification-list h4 {
  margin: 0 0 5px;
  font-size: 16px;
  color: #444;
}

.notification-list p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

/* 右侧通知内容 */
.notification-detail {
  flex: 1;
  padding: 20px;
}

.notification-detail h3 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;
}

.notification-detail p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

.notification-detail .content {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 14px;
  color: #333;
}
</style>
