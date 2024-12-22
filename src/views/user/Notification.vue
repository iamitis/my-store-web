<script setup lang="ts">
import {onMounted, ref} from "vue";
import {createNotice, getNoticeByUserId, Notice, NoticeSource, NoticeStatus, readNotice} from "../../api/noteice.js";
import {User} from "../../api/user.ts";
import {currUser} from "../../main.ts";
import {dayjs} from "element-plus";

// 示例通知数据
const notifications = ref<Notice[]>([]);

const example_notice1: Notice = {
  noticeId: 1,
  userId: 1,
  noticeSource: NoticeSource.DISCOUNT_MESSAGE,
  title: "新品上架",
  content: "我们有新的商品上架了，快来看看吧！",
  createTime: new Date(),
  noticeStatus: NoticeStatus.UNREAD,
};

const example_notice2: Notice = {
  noticeId: 2,
  userId: 1,
  noticeSource: NoticeSource.ORDER_STATUS,
  title: "订单已发货",
  content: "您的订单已发货，请注意查收！",
  createTime: new Date(),
  noticeStatus: NoticeStatus.UNREAD,
};

const example_notice3: Notice = {
  noticeId: 3,
  userId: 1,
  noticeSource: NoticeSource.ORDER_STATUS,
  title: "订单已取消",
  content: "您的订单已取消，如有疑问请联系客服。",
  createTime: new Date(),
  noticeStatus: NoticeStatus.READ,
};

// 当前选中的通知
const selectedNotification = ref<Notice | null>(null);

// 更新通知状态为已读
function updateNotificationStatus(notification: Notice) {
  if (notification.noticeStatus === NoticeStatus.UNREAD) {
    readNotice(notification.noticeId!);
    getNotifications();
  }
}

// 点击通知切换右侧内容并更新状态
function selectNotification(notification: Notice) {
  selectedNotification.value = notification;
  updateNotificationStatus(notification); // 更新通知状态为已读
}

// 通知来源和状态映射
const noticeSourceMap = {
  ORDER_STATUS: "订单状态",
  CONSUME_MESSAGE: "消费消息",
  DISCOUNT_MESSAGE: "折扣消息",
  PARENT_MESSAGE: "家长消息",
};

// 格式化时间
function formatDate(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm'); // 格式化为 'YYYY-MM-DD HH:mm'
}

async function getNotifications() {
  const res = await getNoticeByUserId(currUser.id!)
  if (res.data.code !== '000') {
    ElMessage.error('获取用户通知失败' + res.data.msg);
  } else {
    notifications.value = res.data.result
        .sort((a, b) => new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime());
    console.log("获取通知成功", notifications.value);
  }
}

onMounted(async () => {
  // await createNotice(example_notice1);
  // await createNotice(example_notice2);
  // await createNotice(example_notice3);
  await getNotifications();
  //notifications.value = [example_notice1, example_notice2, example_notice3];

  console.log("加载后的通知:", notifications.value);
});

</script>

<template>
  <div class="notification-container" >
    <!-- 左侧通知列表 -->
    <div class="notification-list">
      <h3>通知列表</h3>
      <ul>
        <li
            v-for="notification in notifications"
            :key="notification.noticeId"
            :class="{ selected: notification.noticeId === selectedNotification?.noticeId }"
            @click="selectNotification(notification)"
        >
          <div style="display: flex; align-items: center;">
            <!-- 红点 -->
            <span
                v-if="notification.noticeStatus === 'UNREAD'"
                style="width: 8px; height: 8px; background-color: red; border-radius: 50%; margin-right: 5px;"
            ></span>
            <h4>{{ notification.title }}</h4>
          </div>
          <p>{{ noticeSourceMap[notification.noticeSource!] }} - {{ formatDate(notification.createTime!) }}</p>
        </li>
      </ul>
    </div>

    <!-- 右侧通知内容 -->
    <div class="notification-detail" v-if="selectedNotification">
      <h3>{{ selectedNotification.title }}</h3>
      <p><strong>来源：</strong>{{ noticeSourceMap[selectedNotification.noticeSource!] }}</p>
      <p><strong>日期：</strong>{{ formatDate(selectedNotification.createTime!) }}</p>
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
  white-space: pre-wrap; /* 保留换行符并支持自动换行 */
}
</style>
