<template>
  <Dialog
  :show="dialogConfig.show"
  :title="dialogConfig.title"
  :showCancel="false"
  :buttons="dialogConfig.buttons"
  @close="dialogConfig.show=false"
  width="450px"
  >
  <el-form :model="formData" ref="formDataRef" label-width="60px">
    <el-form-item label="昵称" prop="nickName">
      <span>{{formData.nickName}}</span>
    </el-form-item>
    <el-form-item label="头像" prop="avatar">
      <CoverUpLoad :imgUrlPrefix="proxy.globalInfo.avatarUrl" v-model="formData.avatar"></CoverUpLoad>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="formData.sex">
        <el-radio :label="0">女</el-radio>
        <el-radio :label="1">男</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="简介" prop="personDescription">
      <el-input type="textarea" v-model="formData.personDescription" maxlength="100" show-word-limit></el-input>
    </el-form-item>
  </el-form>
  </Dialog>
</template>

<script setup>
import {ref,getCurrentInstance, reactive, nextTick} from 'vue'
import {useRouter} from 'vue-router'
const router=useRouter()
const { proxy } = getCurrentInstance();
const api={
  updateUserInfo: "/ucenter/updateUserInfo",

}

const dialogConfig=reactive({
  show: false,
  title: "编辑个人信息",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: ()=>{
        updateUserInfoHandler()
      }
    }
  ]
})
const formData=ref({})
const formDataRef=ref()

const showEditDialog=(userInfo)=>{
  dialogConfig.show=true
  nextTick(()=>{
    formDataRef.value.resetFields()
    const dataInfo=JSON.parse(JSON.stringify(userInfo))
    dataInfo.avatar={
      imageUrl: dataInfo.userId
    }
    formData.value=dataInfo
  })
}
defineExpose({showEditDialog})

// 提交修改信息
const emit=defineEmits(["resetUserInfo"])
const updateUserInfoHandler=()=>{
  formDataRef.value.validate(async(valid)=>{
    if(!valid) {
      return
    }
    const params=Object.assign({},formData.value)
    const result=await proxy.Request({
      url: api.updateUserInfo,
      params: params
    })
    if(!result) {
      return
    }
    dialogConfig.show=false
    // 更改了头像重新刷新页面 否则只是更新信息
    if(params.avatar instanceof File) {
      router.go(0)
    }else {
      emit('resetUserInfo',params)
    }
  })
}
</script>

<style lang="scss" scoped>
</style>