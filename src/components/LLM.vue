<script setup lang="ts">
import { ref, defineEmits, defineProps, onMounted, watch } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { chat } from "../api/llm.ts";

const visible = defineModel('visible', {
  type: Boolean,
  required: true,
});

const props = defineProps({
  msg: {
    type: String,
    required: true,
  },
});

// 控制是否正在加载
const loading = ref<boolean>(false);

// Emits：通知父组件
const emit = defineEmits(['update:visible']);

// 存储 LLM 的回复
const llmReply = ref<string | null>(null);

// 提交问题并获取 LLM 回复
const submitQuestion = async () => {
  const question = props.msg;
  console.log('question:', question);
  // 开启加载提示
  loading.value = true;
  try {
    const res = await chat(question);

    if (res.data.code === '000') {
      llmReply.value = res.data.result;
    } else {
      ElMessage.error("获取回复失败");
    }
  } catch (error) {
    ElMessage.error("请求失败");
  } finally {
    // 关闭加载提示
    loading.value = false;
  }
};

// 关闭弹窗
const handleCancel = () => {
  llmReply.value = null;
  emit('update:visible', false);
};

watch(() => visible.value, (newVal) => {
  if (newVal) {
    submitQuestion();
  }
});
</script>

<template>
  <el-dialog
      title="人工智能 回复"
      v-model="visible"
      width="80%"
  height="80%"
  @close="handleCancel"
  :before-close="handleCancel"
  >
  <!-- 内容区域 -->
  <div
      style="padding: 30px; text-align: center; max-height: 500px; overflow-y: auto; line-height: 1.8; font-size: 16px; background-color: #f9f9f9; border-radius: 8px; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);">

    <!-- 如果正在加载，显示加载提示 -->
    <div v-if="loading" class="loading-container">
      <el-icon class="loading-icon">
        <i class="el-icon-loading"></i>
      </el-icon>
      <p class="loading-text">正在加载，请稍候...</p>
    </div>

    <!-- 显示 LLM 的回复 -->
    <div v-if="llmReply" class="reply-content">
      {{ llmReply }}
    </div>
  </div>

  <!-- 按钮 -->
  <div style="text-align: right; margin-top: 20px;">
    <el-button @click="handleCancel" size="default" type="primary">关闭</el-button> <!-- 更改按钮样式 -->
  </div>
  </el-dialog>
</template>

<style scoped>
/* 加载提示样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loading-icon {
  font-size: 40px;
  margin-bottom: 10px;
  color: #409eff;
}

.loading-text {
  font-size: 16px;
  font-weight: bold;
  color: #606266;
  margin-top: 10px;
}

/* 回复内容样式 */
.reply-content {
  font-size: 16px;
  line-height: 1.8;
  text-align: left;
  color: #333;
  white-space: pre-wrap; /* 保证内容换行 */
  word-wrap: break-word;
  word-break: break-word;
  padding: 20px;
  background-color: #e8f5e9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-height: 300px; /* 增加最大高度 */
  overflow-y: auto;  /* 支持滚动 */
}

/* 弹窗样式优化 */
.el-dialog {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.el-button {
  padding: 10px 20px;
  border-radius: 5px;
}
</style>
