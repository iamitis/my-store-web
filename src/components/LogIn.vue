<script setup lang="ts">
import {ref,  defineEmits} from 'vue';
import SignUpDialog from "./SignUp.vue";
import {login} from "../api/user.ts";
import {updateUser} from "../main.ts";


const showSignUp = ref(false);

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
  phone: '',
  password: '',
});


// 表单验证规则
const loginRules = {
  phone: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
};

// Emits：通知父组件
const emit = defineEmits(['update:visible', 'loginSuccess', 'loginCancel','signUpSuccess','signUpCancel']);

// 表单引用（用于校验）
const loginFormRef = ref();

// 提交登录表单
const submitLoginForm = () => {
  login({
    phone: loginForm.value.phone,
    password: loginForm.value.password
  })
      .then(res=>{
        const code = res.data.code
        const id = res.data.result;
        if(code == '000'){
          console.log('登录成功:', loginForm.value);
          ElMessage({
            message: "登录成功！",
            type: 'success',
            center: true,
          })
          updateUser({
            id:id,
            phone:loginForm.value.phone
          })
          emit('loginSuccess', loginForm.value);
          emit('update:visible', false); // 关闭弹窗
        }else{
          console.log('验证失败');
          ElMessage({
            message: res.data.msg,
            type: 'error',
            center: true,
          })
          loginForm.value.password = '';
        }

      });
};

function handleClose() {
  emit('loginCancel');
  emit('update:visible', false);
}

function handleSignUp() {
  emit('update:visible', false);
  showSignUp.value = true;
}

function handleSignUpSuccess(){
  emit('update:visible', true);
  emit('signUpSuccess');
}

function handleSignUpCancel(){
  emit('update:visible', true);
  emit('signUpCancel');
}



</script>

<template>
  <SignUpDialog v-model:visible="showSignUp" @signUpSuccess = "handleSignUpSuccess" @signUpCancel = "handleSignUpCancel"/>
  <el-dialog
      title="注册账号"
      v-model="visible"
      width="30%"
      @close="handleClose"
  >
  <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
    <!-- 用户名 -->
    <el-form-item label="用户名" prop="phone">
      <el-input v-model="loginForm.phone" placeholder="请输入用户名"></el-input>
    </el-form-item>

    <!-- 密码 -->
    <el-form-item label="密码" prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>

    <div style="text-align: left;">
      <el-button type="text" @click="handleSignUp">注册账号</el-button>
    </div>

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