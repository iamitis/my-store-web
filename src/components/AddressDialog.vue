<script setup lang="ts">
import {AddressInfo, emptyAddressInfo, User} from "../api/user.ts";
import {computed, inject, PropType, ref} from "vue";
import {pcaTextArr} from "element-china-area-data";

const currUser = inject('currUser') as User
const addressInfo = defineModel(
    'addressInfo',
    {
      type: Object as PropType<AddressInfo>,
      default: emptyAddressInfo,
    })
const dialogVisible = defineModel(
    'dialogVisible',
    {
      type: Boolean,
      default: false,
    })
const emit = defineEmits(['edit', 'add'])
const title = computed(() => addressInfo.value!.addressInfoId ? '编辑地址' : '新增地址')

const phoneError = ref<string>('')
const receiverError = ref<string>('')
const addressError = ref<string>('')

function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/;
  return phoneRegex.test(phone);
}

const cascaderProps = {
  expandTrigger: "hover", // 鼠标悬停展开子菜单
  checkStrictly: false,   // 选择必须选到最后一级
  emitPath: true,         // 返回完整路径
};

function handleSubmit() {
  let valid = true;

  if (!validatePhoneNumber(addressInfo.value!.phone)) {
    phoneError.value = '请输入正确的手机号码';
    valid = false;
  } else {
    phoneError.value = '';
  }

  if (!addressInfo.value!.receiver) {
    receiverError.value = '收货人不能为空';
    valid = false;
  } else {
    receiverError.value = '';
  }

  if (addressInfo.value!.areaAddress.length === 0) {
    addressError.value = '请选择省市区';
    valid = false;
  } else {
    addressError.value = '';
  }

  if (!addressInfo.value!.detailAddress) {
    addressError.value = '请输入详细地址';
    valid = false;
  } else {
    addressError.value = '';
  }

  if (!valid) {
    return;
  }
  dialogVisible.value = false;

  if (addressInfo.value!.addressInfoId) {
    emit('edit');
  } else {
    addressInfo.value!.userId = currUser.id!;
    emit('add');
  }
}
</script>

<template>
  <el-dialog v-model="dialogVisible" width="30%"
             :title="title"
             v-if="addressInfo" class="a-d-dialog">
    <el-form>
      <div class="a-d-container">
        <el-row>
          <el-col :span="4" class="a-d-col">收货人</el-col>
          <el-col :span="19" :offset="1">
            <el-form-item :error="receiverError">
              <el-input v-model="addressInfo.receiver" placeholder="请输入收货人姓名"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="a-d-col">联系电话</el-col>
          <el-col :span="19" :offset="1">
            <el-form-item :error="phoneError">
              <el-input v-model="addressInfo.phone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="a-d-col">地址信息</el-col>
          <el-col :span="19" :offset="1">
            <el-form-item :error="addressError">
              <el-cascader
                  v-model="addressInfo.areaAddress"
                  :options="pcaTextArr"
                  placeholder="请选择省/市/区"
                  :props="cascaderProps"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="a-d-col">详细地址</el-col>
          <el-col :span="19" :offset="1">
            <el-form-item :error="addressError">
              <el-input v-model="addressInfo.detailAddress" placeholder="请输入详细地址(街道号等)"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-checkbox v-model="addressInfo.isDefault">设为默认地址</el-checkbox>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </div>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.a-d-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

:deep(.a-d-dialog .el-dialog__title) {
  --el-dialog-title-font-size: 20px;
  font-weight: bold;
}

.a-d-col {
  font-size: 18px;
  color: #3f3e3e;
  text-align: justify;
  text-align-last: justify;
}
</style>