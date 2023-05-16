<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      @close="closeDialog"
    >
      <el-form
        ref="FormDataRef"
        :model="FormData"
        :rules="rules"
        size="large"
        class="login-register"
      >
        <el-form-item label="" prop="email">
          <el-input v-model="FormData.email" placeholder="请输入账号" clearable>
            <template #prefix>
              <span class="iconfont icon-user"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password" v-if="optionType == 1">
          <el-input
            v-model="FormData.password"
            placeholder="请输入密码"
            type="password"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-lock"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册 重置密码-->
        <div class="register" v-if="optionType == 0 || optionType == 2">
          <el-form-item label="" prop="emailCode">
            <div class="email-code-panel">
              <el-input
                v-model="FormData.emailCode"
                placeholder="请输入邮箱验证码"
                class="checkcode-input"
              >
                <template #prefix>
                  <span class="iconfont icon-secured"></span>
                </template>
              </el-input>
              <el-button
                type="primary"
                size="large"
                class="check-code-btn"
                @click="getEmailCheckCode"
                >获取验证码</el-button
              >
            </div>
            <div class="no-email-checkCode">
              <el-popover placement="left" :width="400" trigger="click">
                <template #reference>
                  <a href="javascript:void(0)" :style="{ 'font-size': '13px' }"
                    >未收到邮箱验证码？</a
                  >
                </template>
                <template #default>
                  <p>1、在垃圾箱中查找邮箱验证码</p>
                  <p>
                    2、在邮箱中 头像->设置->反垃圾->白名单->设置邮件地址白名单
                  </p>
                  <p>3、将邮箱【1643684063@qq.com】添加到白名单</p>
                </template>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item label="" prop="nickName" v-if="optionType == 0">
            <el-input
              v-model="FormData.nickName"
              placeholder="请输入昵称"
            >
              <template #prefix>
                <span class="iconfont icon-user"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="RegisterPassword">
            <el-input
              v-model="FormData.RegisterPassword"
              placeholder="请输入密码"
              type="password"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-lock"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="Repassword">
            <el-input
              v-model="FormData.Repassword"
              placeholder="请再次输入密码"
              type="password"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-lock"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="" prop="checkCode">
          <div class="check-code-panel">
            <el-input
              v-model="FormData.checkCode"
              placeholder="请输入验证码"
              class="checkcode-input"
              @keyup.enter="doSubmit"
            >
              <template #prefix>
                <span class="iconfont icon-secured"></span>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl"
              class="checkcode"
              @click="updateCheckCode(0)"
            />
          </div>
        </el-form-item>
        <el-form-item prop="remember">
          <div class="remember-panel" v-if="optionType == 1">
            <el-checkbox v-model="FormData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account" v-if="optionType == 1">
            <a href="javascript:void(0)" @click="showPanel(2)">忘记密码？</a>
            <a href="javascript:void(0)" @click="showPanel(0)">没有账号？</a>
          </div>
          <a
            href="javascript:void(0)"
            @click="showPanel(1)"
            v-if="optionType == 0"
            >已有账号？</a
          >
          <a
            href="javascript:void(0)"
            @click="showPanel(1)"
            v-if="optionType == 2"
            >去登录？</a
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="doSubmit">
            <span v-if="optionType == 0">注册</span>
            <span v-if="optionType == 1">登录</span>
            <span v-if="optionType == 2">重置密码</span>
          </el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- 发送邮箱验证码弹框 -->
    <Dialog
      :show="emailCheckCodeDialog.show"
      :title="emailCheckCodeDialog.title"
      :buttons="emailCheckCodeDialog.buttons"
      @close="emailDialogClose"
      width="500px"
    >
      <el-form
        ref="sendEmailCodeRef"
        :model="sendEmailCodeFormData"
        :rules="rules"
        size="large"
        class="email-checkCode-panel"
        @submit.prevent
      >
        <el-form-item label="邮箱" prop="email">
          <p>{{ FormData.email }}</p>
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode" class="code-panel">
          <el-input
            v-model="sendEmailCodeFormData.checkCode"
            placeholder="请输入验证码"
          >
            <template #prefix>
              <span class="iconfont icon-secured"></span>
            </template>
          </el-input>
          <img
            :src="emailCodeUrl"
            class="code-img"
            @click="updateCheckCode(1)"
          />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
import md5 from "js-md5";
import {useStore} from '../store/index'
const store=useStore()
const { proxy } = getCurrentInstance();
const optionType = ref();

const api = {
  checkCode: "/api/checkCode",
  sendEmailCode: "/sendEmailCode",
  register: "/register",
  login: "/login",
  resetPassword: "/resetPwd",
  getUserInfo: "/getUserInfo",
};
// 判断操作类型 0：注册 1：登录 2：找回密码
const showPanel = (type) => {
  optionType.value = type;
  resetForm();
};
defineExpose({ showPanel }); //暴露给父组件
const FormDataRef = ref();
const FormData = ref({});
const resetForm = () => {
  //重置表单
  dialogConfig.show = true;
  if (optionType.value == 0) {
    dialogConfig.title = "注册";
  } else if (optionType.value == 1) {
    dialogConfig.title = "登录";
  } else {
    dialogConfig.title = "重置密码";
  }
  nextTick(() => {
    //在dom更新之后执行
    updateCheckCode(0);
    FormDataRef.value.resetFields();
    FormData.value = {};
    // 登录 有cookie自动填写
    if (optionType.value == 1) {
      const loginInfo = proxy.VueCookies.get("loginInfo");
      if (loginInfo) {
        FormData.value = loginInfo;
      }
    }
  });
};

const dialogConfig = reactive({
  show: false,
  title: "",
});
const closeDialog = () => {
  dialogConfig.show = false;
  store.changeShowLogin(false)
};
// 验证码
const checkCodeUrl = ref(api.checkCode);
const updateCheckCode = (type) => {
  // type=0获取登录注册验证码 1获取邮箱验证码
  //后面加上时间可以刷新验证码
  if (type == 0) {
    checkCodeUrl.value =
      api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  } else if (type == 1) {
    emailCodeUrl.value =
      api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  }
};
// 发送邮箱验证码
const emailCheckCodeDialog = reactive({
  show: false,
  title: "发送邮箱验证码",
  buttons: [
    {
      type: "primary",
      text: "发送验证码",
      click: () => {
        sendEmailCode();
      },
    },
  ],
});
const emailDialogClose=()=>{
  emailCheckCodeDialog.show = false
}
const sendEmailCodeFormData = ref({});
const sendEmailCodeRef = ref();
const emailCodeUrl = ref(api.checkCode);
const getEmailCheckCode = () => {
  FormDataRef.value.validateField("email", (valid) => {
    //弹出发送邮箱验证码之前要验证邮箱
    if (!valid) {
      return;
    }
    emailCheckCodeDialog.show = true;
    nextTick(() => {
      updateCheckCode(1);
      sendEmailCodeRef.value.resetFields();
      sendEmailCodeFormData.value.checkCode = "";
      sendEmailCodeFormData.value.email = FormData.value.email;
    });
  });
};
const sendEmailCode = () => {
  // 发送按钮
  sendEmailCodeRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, sendEmailCodeFormData.value);
    if (optionType.value == 0) {
      params.type = 0; //注册
    } else if (optionType.value == 2) {
      params.type = 1; //找回密码
    }
    // proxy.Message.warning("发送验证码时间稍微过长，请耐心等待！")
    const result = await proxy.Request({
      url: api.sendEmailCode,
      params,
      // 重新刷新验证码
      errorCallback: () => {
        updateCheckCode(1);
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("验证码已发送，请登录邮箱查看");
    emailCheckCodeDialog.show = false;
  });
};
// 表单相关验证规则
const checkRepassword = (rule, value, callback) => {
  if (value !== FormData.value.RegisterPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const rules = reactive({
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      validator: proxy.verify.email,
      message: "请输入正确的邮箱",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
  emailCode: [{ required: true, message: "请输入邮箱验证码", trigger: "blur" }],
  nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  RegisterPassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      validator: proxy.verify.password,
      message: "密码只能在数字、字母或下划线之间，8-18位",
      trigger: "blur",
    },
  ],
  Repassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    {
      validator: checkRepassword,
      message: "两次输入密码不一致",
      trigger: "blur",
    },
  ],
  checkCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});

//登录、注册、重置密码
const doSubmit = () => {
  FormDataRef.value.validate(async (valid) => {
    if (!valid) {
      //先进行表单校验
      return;
    }
    let url = "";
    // 0:注册 1：登录 2：重置密码
    let params = Object.assign({}, FormData.value);
    if (optionType.value == 0) {
      url = api.register;
      params.password = FormData.value.RegisterPassword;
    } else if (optionType.value == 1) {
      url = api.login;
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      const cookiePassword=cookieLoginInfo==null?null:cookieLoginInfo.password
      if (params.password != cookiePassword) {
        params.password = md5(params.password);
      }
    } else {
      url = api.resetPassword;
      params.password = FormData.value.Repassword;
    }
    const result = await proxy.Request({
      url: url,
      params,
      errorCallback: () => {
        updateCheckCode(0);
      },
    });
    if (!result) {
      return;
    }
    FormDataRef.value.resetFields();
    FormData.value = {};
    dialogConfig.show = false;
    if (optionType.value == 0) {
      proxy.Message.success("注册成功，请登录");
      showPanel(1);
    } else if (optionType.value == 1) {
      let loginInfo = {
        email: params.email,
        password: params.password,
        rememberMe: params.rememberMe,
      };
      if (params.rememberMe) {
        //有记住我 存cookie
        proxy.VueCookies.set("loginInfo", loginInfo, "7d");
      } else {
        //不记住 清除cookie
        proxy.VueCookies.remove("loginInfo");
      }
      //更新状态管理中的用户信息
      store.updateLoginUserInfo(result.data)
      proxy.Message.success("登录成功");
    } else {
      proxy.Message.success("重置密码成功，请登录");
      showPanel(1);
    }
  });
};
</script>

<style lang="less" scoped>
.login-register {
  .email-code-panel {
    display: flex;
    width: 100%;
    .check-code-btn {
      margin-left: 10px;
      justify-content: space-between;
    }
  }
  .no-email-checkCode {
    line-height: 20px;
  }
  .check-code-panel {
    display: flex;
    width: 100%;
    .checkcode-input {
      flex: 1;
    }
    .checkcode {
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .remember-panel {
    width: 100%;
  }
  .no-account {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .login-btn {
    width: 100%;
  }
}
.email-checkCode-panel {
  .code-panel {
    display: flex;
    .code-img {
      margin-left: 10px;
      cursor: pointer;
    }
  }
  :deep(.el-form-item__content) {
    flex-wrap: nowrap;
  }
}
</style>