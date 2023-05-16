<template>
  <Dialog
    :show="dialog.show"
    :title="dialog.title"
    :buttons="dialog.buttons"
    width="500px"
    @close="dialog.show = false"
  >
    <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="100px">
      <el-form-item label="用户昵称：">{{nickName}}</el-form-item>
      <el-form-item label="消息内容" prop="message">
        <el-input
          type="textarea"
          v-model="formData.message"
          clearable
          placeholder="请输入消息内容"
          :maxlength="300"
          resize="none"
          :rows="5"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="积分" prop="integral">
        <el-input
          v-model="formData.integral"
          placeholder="给用户发放积分，可以为0或者负数"
        ></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  sendMessage: "/user/sendMessage",
};
const dialog = reactive({
  show: false,
  title: "发送信息",
  buttons: [
    {
      type: "primary",
      text: "发送",
      click: (e) => {
        sendMessage();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = reactive({
  message: [{required: true,message:'消息不能为空',trigger: 'blur'}]
});
const nickName=ref("")
// 显示弹框
const showMessageDialog = (row) => {
  dialog.show = true;
  formData.value.userId=row.userId
  nickName.value=row.nickName
  nextTick(()=>{
    formDataRef.value.resetFields()
  })
};
defineExpose({ showMessageDialog });
// 发送消息
const emit=defineEmits()
const sendMessage = () => {
  formDataRef.value.validate(async(valid)=>{
    if(!valid) {
      return;
    }
    const params=Object.assign({},formData.value)
  const result=await proxy.Request({
    url: api.sendMessage,
    params
  })
  if(!result) {
    return;
  }
  dialog.show=false;
  proxy.Message.success('发送消息成功！');
  emit('reload');
})
};
</script>

<style lang="scss" scoped>
</style>