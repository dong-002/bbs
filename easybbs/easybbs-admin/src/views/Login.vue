<template>
  <div class="login-container">
    <div class="login-panel">
      <div class="login-title">管理员登录</div>
      <el-form ref="FormRef" :model="FormData" :rules="rules" @keyup.enter="login">
        <el-form-item prop="account">
          <el-input v-model="FormData.account" placeholder="请输入账号">
            <template #prefix>
              <span class="iconfont icon-user"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="FormData.password" placeholder="请输入密码" type="password">
            <template #prefix>
              <span class="iconfont icon-lock"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode" class="checkcode">
          <div class="checkcode-panel">
            <el-input v-model="FormData.checkCode" placeholder="请输入验证码">
            <template #prefix>
              <span class="iconfont icon-secured"></span>
            </template>
          </el-input>
          <img :src="checkCodeUrl" @click="updateCheckCode" class="checkcode">
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{'width': '100%'}" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import {useRouter} from 'vue-router'
import md5 from 'js-md5'
const router=useRouter()
const {proxy}=getCurrentInstance()
const api={
  login: '/login'
}

const checkCodeUrl=ref('/api/checkCode')
const updateCheckCode=()=>{
  const date=new Date()
  checkCodeUrl.value='/api/checkCode?time='+date.getTime()
}
const FormData = ref({});
const FormRef = ref();
const rules = reactive({
  account: [{required: true,message: '账号不能为空',trigger: 'blur'},
  {validator: proxy.verify.email,message:'请输入正确的邮箱',trigger:'blur'}],
  password: [{required: true,message: '密码不能为空',trigger: 'blur'}],
  checkCode: [{required: true,message: '验证码不能为空',trigger: 'blur'}]
});

onMounted(()=>{
  const loginInfo=proxy.VueCookies.get('adminLoginInfo')
  if(loginInfo) {
    FormData.value=loginInfo
  }
})
const login=()=>{
  FormRef.value.validate(async(valid)=>{
    if(!valid) {
      return
    }
    const cookieLoginInfo=proxy.VueCookies.get('adminLoginInfo')||{}
    const params=Object.assign({},FormData.value)
    if(params.password!=cookieLoginInfo.password) {
      params.password=md5(params.password)
    }
    const result=await proxy.Request({
      params,
      url: api.login,
      errorCallback:()=>{
        updateCheckCode()
      }
    })
    if(!result) {
      return
    }
    let adminLoginInfo={
      account: params.account,
      password: params.password
    }
    proxy.VueCookies.set('adminLoginInfo',adminLoginInfo,0)
    proxy.Message.success('登录成功',()=>{
      router.push('/')
    })
    updateCheckCode()
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-image: url('../assets/bg.jpg');
  .login-panel {
    position: absolute;
    top: 150px;
    width: 350px;
    right: 100px;
    padding: 20px;
    border-radius: 5px;
    background: #fff;
    opacity: 0.9;
    .login-title {
      text-align: center;
      font-size: 22px;
      margin-bottom: 10px;
    }
    .checkcode-panel {
      display: flex;
      .checkcode {
        margin-left: 5px;
      }
    }
  }
}
</style>