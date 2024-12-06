<script setup lang="ts">
import {ref,  defineEmits} from 'vue';

// 取消按钮
const handleCancel = () => {
  emit('loginCancel'); // 通知父组件取消
  emit('update:visible', false); // 关闭弹窗
};

// Props：控制弹窗显示

const visible = defineModel('visible', {
  type: Boolean,
  required: true,
})



// 表单数据
const loginForm = ref({
  username: '',
  password: '',
});


// 表单验证规则
const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
};

// Emits：通知父组件
const emit = defineEmits(['update:visible', 'loginSuccess', 'loginCancel']);

// 表单引用（用于校验）
const loginFormRef = ref();

// 提交登录表单
const submitLoginForm = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log('登录成功:', loginForm.value);
      // 触发成功事件
      emit('loginSuccess', loginForm.value);
      emit('update:visible', false); // 关闭弹窗
    } else {
      console.log('验证失败');
    }
  });
};

function handleClose() {
  emit('loginCancel');
  emit('update:visible', false);
}


</script>

<template>
  <el-dialog
      title="用户登录"
      v-model="visible"
      width="30%"
      @close="handleClose"
  >
  <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
    <!-- 用户名 -->
    <el-form-item label="用户名" prop="username">
      <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
    </el-form-item>

    <!-- 密码 -->
    <el-form-item label="密码" prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>

    <!-- 按钮 -->
    <div style="text-align: right;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="submitLoginForm">登录</el-button>
    </div>

  </el-form>
  </el-dialog>
</template>

<style scoped>

</style>