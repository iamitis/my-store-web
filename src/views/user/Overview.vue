<script setup lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {getUnreadNotice, Notice} from "../../api/noteice.ts";
import {currUser} from "../../main.ts";
import {getAllOrders, Order} from "../../api/order.ts";
import {formatPrice} from "../../api/product.ts";


const categoryNames = ["食品", "服装", "电子产品", "宠物用品", "保健品", "洗浴用品"];
const categoryEngToChineseMap = new Map<string, string>([
  ["FOOD", "食品"],
  ["APPAREL", "服装"],
  ["ELECTRONICS", "电子产品"],
  ["PET_SUPPLIES", "宠物用品"],
  ["HEALTH_PRODUCTS", "保健品"],
  ["BATH_PRODUCTS", "洗浴用品"],
]);
const categoryColors = ["#FFD700", "#2196F3", "#4CAF50", "#FF5722", "#9C27B0", "#3F51B5"];

// 初始类别比例（value 设置为 0，后续根据逻辑动态调整）
const categoryPercentages = ref(
    categoryNames.map((name, index) => ({
      name,
      value: 0, // 初始值为 0
      color: categoryColors[index],
    }))
);

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

const orders = ref<Order[]>([]);
const unreadNotice = ref<Notice[]>([]);
const totalAmount = ref<number>(0); // 总金额

async function getOrder() {
  getAllOrders(currUser.id!)
      .then(res=>{
        if (res.data.code !== '000') {
          ElMessage.error('获取用户订单失败' + res.data.msg);
        } else {
          orders.value = res.data.result
              .sort((a, b) => new Date(b.createDate!).getTime() - new Date(a.createDate!).getTime());
          // 计算总金额
          totalAmount.value = 0;
          totalAmount.value = orders.value.reduce((sum, order) => {
            return sum + (order.totalPrice || 0); // 如果 totalPrice 为空，默认为 0
          }, 0);

          //圆形比例
          let totalProductCount = 0;
          for(let order of orders.value!) {
            for(let item of order.products!) {
              const index = categoryNames.indexOf(categoryEngToChineseMap.get(item!.product!.productCategory!)!);
              categoryPercentages.value[index].value += item.quantity!;
              totalProductCount += item.quantity!;
            }
        }
          // 将每种商品数量转换为百分比
          categoryPercentages.value = categoryNames.map((name, index) => ({
            name,
            value: totalProductCount > 0 ? (categoryPercentages.value[index].value / totalProductCount) * 100 : 0,
            color: categoryColors[index],
          }));
      }
      })
}

async function getNotice() {
  const res = await getUnreadNotice(currUser.id!);
  if(res.data.code !== '000') {
    console.error('获取未读消息失败' + res.data.msg);
  } else {
    unreadNotice.value = res.data.result;
  }
}

onMounted(async () => {
  await getNotice();
  await getOrder();
});

function processPercent(number){
  return Math.trunc(number); // 去掉小数部分，仅保留整数
}


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
          <p>{{ orders.length }}</p>
        </div>
        <!-- 总金额 -->
        <div class="record-item">
          <h3>购买金额</h3>
          <p>{{ formatPrice(totalAmount)  }}</p>
        </div>
        <!-- 商品比例 -->
        <div class="record-item">
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
              <text x="18" y="20.35" class="circle-chart-text" transform="rotate(90 18 18)">购买比例</text>j
            </svg>
            <ul class="legend">
              <li v-for="(item, index) in categoryPercentages" :key="index">
                <span :style="{ backgroundColor: item.color }"></span>
                {{ item.name }}: {{ processPercent(item.value) }}%
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
          <p>电话: 12345678901</p>
          <p>地址: 江苏省 南京市 鼓楼区 南京大学鼓楼校区</p>
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
  font-size: 20px;
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
  align-items: center;
  gap: 20px;
}

.circle-chart {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg); /* 将起点调整到顶部 */
}

.circle-chart circle {
  transition: stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease;
}

.circle-chart-text {
  font-size: 0.35rem;
  font-weight: bold;
  text-anchor: middle;
  fill: #333;
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
