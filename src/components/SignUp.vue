<script setup lang="ts">
import {ref, defineEmits} from 'vue';
import {register, UserRole} from "../api/user.ts";

const emit = defineEmits(['update:visible', 'signUpCancel', 'signUpSuccess']);

const signUpForm = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  role: UserRole.PARENT,
  related_phone: '', // 新增字段：父母的电话号码
});

const signUpRule = {
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }],
  related_phone: [{ required: true, message: '请输入父母/子女的电话号', trigger: 'blur' }],
};


// 离开
const handleClose = () => {
  emit('signUpCancel'); // 通知父组件取消
  emit('update:visible', false); // 关闭弹窗
};

//取消按钮
const handleCancel = () => {
  emit('signUpCancel'); // 通知父组件取消
  emit('update:visible', false); // 关闭弹窗
};

const submitSignUpForm = () => {
  if (signUpForm.value.password !== signUpForm.value.confirmPassword) {
    console.log('密码与验证密码不一致');
    ElMessage.info("密码与验证密码不一致");
    return;
  }



  register({
    phone: signUpForm.value.phone,
    password: signUpForm.value.password,
    role: signUpForm.value.role,
    related_phone: signUpForm.value.related_phone,
  })
      .then(res => {
        const code = res.data.code;
        if (code === '000') {
          ElMessage({
            message: "注册成功！请登录账号",
            type: 'success',
            center: true,
          });
          console.log('注册成功:', signUpForm.value);
          // 触发成功事件
          emit('signUpSuccess', signUpForm.value);
          emit('update:visible', false); // 关闭弹窗
        } else {
          ElMessage.error("注册失败，请重试！");
        }
      })
      .catch(error => {
        console.error("注册请求失败:", error);
        ElMessage.error("注册失败，请检查网络或重试！");
      });
};

const visible = defineModel('visible', {
  type: Boolean,
  required: true,
});
</script>

<template>
  <el-dialog
      title="用户注册"
      v-model="visible"
      width="40%"
      @close="handleClose"
  >
    <el-form :model="signUpForm" :rules="signUpRule" ref="loginFormRef" label-width="200px">
      <!-- 用户名 -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="signUpForm.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="signUpForm.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="signUpForm.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
      </el-form-item>

      <!-- 父母的电话号码 -->
      <el-form-item label="您父母/子女的电话号码" prop="parentPhone">
        <el-input v-model="signUpForm.related_phone" placeholder="您父母/子女的电话号码"></el-input>
      </el-form-item>

      <!-- 角色选择 -->
      <el-form-item label="您是" prop="role">
        <el-select v-model="signUpForm.role" placeholder="请选择角色">
          <el-option label="长辈" value="PARENT"></el-option>
          <el-option label="子女" value="CHILD"></el-option>
        </el-select>
      </el-form-item>
      <!-- 按钮 -->
      <div style="text-align: right;">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitSignUpForm">注册</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped>

</style>
