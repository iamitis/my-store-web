<script setup lang="ts">
import {ref,  defineEmits} from 'vue';
import {register} from "../api/user.ts";

const emit = defineEmits(['update:visible', 'signUpCancel', 'signUpSuccess']);

const signUpForm = ref({
  phone: '',
  password: '',
  confirmPassword: '',
});

const signUpRule = {
  phone: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }],
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
  if(signUpForm.value.password != signUpForm.value.confirmPassword){
    console.log('密码与验证密码不一致');
    ElMessage.info("密码与验证密码不一致")
    return;
  }

  register({
    phone: signUpForm.value.phone,
    password: signUpForm.value.password,
  })
      .then(res=>{
        const code = res.data.code
        if(code=='000'){
          ElMessage({
            message: "注册成功！请登录账号",
            type: 'success',
            center: true,
          })
          console.log('注册成功:', signUpForm.value);
          // 触发成功事件
          emit('signUpSuccess', signUpForm.value);
          emit('update:visible', false); // 关闭弹窗
        }else{

        }
      })
  if(signUpForm.value.password == signUpForm.value.confirmPassword){
    console.log('注册成功:', signUpForm.value);
    // 触发成功事件
    emit('signUpSuccess', signUpForm.value);
    emit('update:visible', false); // 关闭弹窗
  } else {
    console.log('密码与验证密码不一致');
    ElMessage.info("密码与验证密码不一致")
  }
};


const visible = defineModel('visible', {
  type: Boolean,
  required: true,
})

</script>

<template>
  <el-dialog
      title="用户登录"
      v-model="visible"
      width="30%"
      @close="handleClose"
  >
    <el-form :model="signUpForm" :rules="signUpRule" ref="loginFormRef" label-width="80px">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="phone">
        <el-input v-model="signUpForm.phone" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="signUpForm.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="signUpForm.confirmPassword" type="password" placeholder="请再次输入密码"></el-input>
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