<script setup lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {getUnreadNotice, Notice} from "../../api/noteice.ts";
import {currUser} from "../../main.ts";

const totalOrders = ref(15);
const totalAmount = ref(120);
const categoryPercentages = ref([
  { name: "电子产品", value: 40, color: "#4CAF50" },
  { name: "服饰", value: 35, color: "#2196F3" },
  { name: "食品", value: 25, color: "#FFC107" },
]);

// 计算圆弧的起始偏移值
const calculateOffset = (index: number): number => {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += categoryPercentages.value[i].value; // 累加之前部分的值
  }
  return (offset / 100) * 100; // 将偏移量转换为百分比
};

defineExpose({
  calculateOffset,
});

const unreadNotice = ref<Notice[]>([]);

async function getNotice() {
  const res = await getUnreadNotice(currUser.id!);
  if(res.data.code !== '000') {
    console.error('获取未读消息失败' + res.data.msg);
  } else {
    unreadNotice.value = res.data.result;
  }
}

onMounted(() => {
  getNotice();
});


</script>

<template>
  <div class="overview-container">
    <!-- 购买记录部分 -->
    <div class="purchase-record">
      <h2>购买记录</h2>
      <div class="record-content">
        <!-- 订单数量 -->
        <div class="record-item">
          <h3>订单数量</h3>
          <p>{{ totalOrders }}</p>
        </div>
        <!-- 总金额 -->
        <div class="record-item">
          <h3>购买金额</h3>
          <p>{{ totalAmount }}</p>
        </div>
        <!-- 商品比例 -->
        <div class="record-item">
          <h3>商品比例</h3>
          <div class="pie-chart">
            <!-- 比例圆 -->
            <svg viewBox="0 0 36 36" class="circle-chart">
              <circle
                  v-for="(item, index) in categoryPercentages"
                  :key="index"
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  :stroke="item.color"
                  stroke-width="3"
                  :stroke-dasharray="item.value + ' ' + (100 - item.value)"
                  :stroke-dashoffset="100 - calculateOffset(index)"
              />
            </svg>
            <ul class="legend">
              <li v-for="(item, index) in categoryPercentages" :key="index">
                <span :style="{ backgroundColor: item.color }"></span>
                {{ item.name }}: {{ item.value }}%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 下半部分 -->
    <div class="bottom-section">
      <!-- 左侧：个人详情信息 -->
      <div class="personal-details">
        <h3>个人详情信息</h3>
        <div class="details-content">
          <p>姓名: 张三</p>
          <p>邮箱: zhangsan@example.com</p>
          <p>电话: 123-456-7890</p>
        </div>
      </div>

      <!-- 右侧：待办消息 -->
      <div class="todo-messages">
        <h3>待办消息</h3>
        <div class="messages-content">
          <p v-for="notice in unreadNotice" :key="notice.noticeId">未读消息：{{ notice.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面整体容器 */
.overview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

/* 购买记录 */
.purchase-record {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
}

.purchase-record h2 {
  margin: 0;
  font-size: 1.5rem;
  text-align: center;
}

/* 购买记录内容 */
.record-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
}

.record-item {
  text-align: center;
}

.record-item h3 {
  margin: 0;
  font-size: 1.2rem;
}

.record-item p {
  font-size: 1rem;
  margin: 10px 0;
}

/* 比例圆样式 */
.pie-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle-chart {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg); /* 将起点调整到顶部 */
}

.circle-chart circle {
  transition: stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease;
}

.legend {
  margin-top: 10px;
  list-style: none;
  padding: 0;
  text-align: left;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.legend span {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* 下半部分布局 */
.bottom-section {
  display: flex;
  gap: 20px;
}

/* 左侧：个人详情信息 */
.personal-details,
.todo-messages {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
}

.personal-details h3,
.todo-messages h3 {
  margin: 0 0 10px;
  font-size: 1.25rem;
}

.details-content p,
.messages-content p {
  margin: 5px 0;
}
</style>
