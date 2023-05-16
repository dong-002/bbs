<template>
  <div class="setting-body">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="150px"
      :style="{ width: '800px' }"
    >
      <el-row>
        <el-divider content-position="left">用户注册成功消息</el-divider>
        <el-col :span="24">
          <el-form-item label="注册通知" prop="registerWelcomInfo">
            <el-input
              v-model="formData.registerWelcomInfo"
              clearable
              placeholder="请输入注册通知"
              :maxlength="250"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-divider content-position="left">邮件设置</el-divider>
        <el-col :span="24">
          <el-form-item label="邮件标题" prop="emailTitle">
            <el-input
              v-model="formData.emailTitle"
              clearable
              placeholder="请输入邮件标题"
              :maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="邮件内容" prop="emailContent">
            <el-input
              v-model="formData.emailContent"
              clearable
              placeholder="请输入邮件内容，验证码用%s占位符"
              :maxlength="300"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-divider content-position="left">审核设置</el-divider>
        <el-col :span="12">
          <el-form-item label="帖子是否需要审核" prop="postAudit">
            <el-radio-group v-model="formData.postAudit">
              <el-radio :label="true">需要审核</el-radio>
              <el-radio :label="false">无需审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评论是否需要审核" prop="commentAudit">
            <el-radio-group v-model="formData.commentAudit">
              <el-radio :label="true">需要审核</el-radio>
              <el-radio :label="false">无需审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-divider content-position="left">发帖设置</el-divider>
        <el-col :span="12">
          <el-form-item label="发帖积分" prop="postIntegral">
            <el-input
              v-model="formData.postIntegral"
              placeholder="请输入发一个帖子所得积分"
            />
          </el-form-item>
          <el-form-item label="每天发帖数量" prop="postDayCountThreshold">
            <el-input
              v-model="formData.postDayCountThreshold"
              placeholder="请输入每天发帖数量"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每天可上传图片数量" prop="dayImageUploadCount">
            <el-input
              v-model="formData.dayImageUploadCount"
              placeholder="请输入可上传图片数量"
            />
          </el-form-item>
          <el-form-item label="允许附件最大大小" prop="attachmentSize">
            <el-input
              v-model="formData.attachmentSize"
              placeholder="请输入允许附件最大大小"
            >
            <template #append>MB</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-divider content-position="left">评论设置</el-divider>
        <el-col :span="24">
          <el-form-item label="是否开启评论" prop="commentOpen">
            <el-radio-group v-model="formData.commentOpen">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="评论积分" prop="commentIntegral">
            <el-input
              v-model="formData.commentIntegral"
              placeholder="输入发表评论获得积分"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="每天可发评论数量"
            prop="commentDayCountThreshold"
          >
            <el-input
              v-model="formData.commentDayCountThreshold"
              placeholder="每天可发评论数量"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-divider content-position="left">点赞设置</el-divider>
        <el-col :span="12">
          <el-form-item label="每天可点赞数量" prop="likeDayCountThreshold">
            <el-input
              v-model="formData.likeDayCountThreshold"
              placeholder="每天可点赞数量"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  getSetting: "/setting/getSetting",
  saveSetting: "/setting/saveSetting",
};

const formRef = ref();
const formData = ref({});
const rules = reactive({
  registerWelcomInfo: [
    { required: true, message: "请输入注册通知", trigger: "blur" },
  ],
  emailTitle: [{ required: true, message: "请输入邮件标题", trigger: "blur" }],
  emailContent: [
    { required: true, message: "请输入邮件内容", trigger: "blur" },
  ],
  postAudit: [{ required: true, message: "请选择是否审核", trigger: "blur" }],
  commentAudit: [
    { required: true, message: "请选择是否审核", trigger: "blur" },
  ],
  postIntegral: [
    { required: true, message: "请输入发帖积分", trigger: "blur" },
    {
      validator: proxy.verify.number,
      message: "请输入正确的数字",
      trigger: "blur",
    },
  ],
  postDayCountThreshold: [
    { required: true, message: "请输入每天发帖数量", trigger: "blur" },
    {
      validator: proxy.verify.number,
      message: "请输入正确的数字",
      trigger: "blur",
    },
  ],
  dayImageUploadCount: [
    { required: true, message: "请输入可上传图片数量", trigger: "blur" },
    {
      validator: proxy.verify.number,
      message: "请输入正确的数字",
      trigger: "blur",
    },
  ],
  attachmentSize: [
    { required: true, message: "请输入允许附件大小", trigger: "blur" },
    {
      validator: proxy.verify.number,
      message: "请输入正确的数字",
      trigger: "blur",
    },
  ],
  commentOpen: [
    { required: true, message: "请选择是否开启评论", trigger: "blur" },
  ],
  commentIntegral: [
    { required: true, message: "输入发表评论获得积分", trigger: "blur" },
    {
      validator: proxy.verify.number,
      message: "请输入正确的数字",
      trigger: "blur",
    },
  ],
  commentDayCountThreshold: [
    { required: true, message: "输入每天可发评论数量", trigger: "blur" },
    {
      validator: proxy.verify.number,
      message: "请输入正确的数字",
      trigger: "blur",
    },
  ],
  likeDayCountThreshold: [
    { required: true, message: "输入每天可点赞数量", trigger: "blur" },
    {
      validator: proxy.verify.number,
      message: "请输入正确的数字",
      trigger: "blur",
    },
  ],
});

// 获取设置
const getSetting = async () => {
  const result = await proxy.Request({
    url: api.getSetting,
  });
  if (!result) {
    return;
  }
  // 将子对象放到formData中
  let resultData = result.data;
  for (let key in resultData) {
    let item = resultData[key];
    if (item != null) {
      for (let sub in item) {
        let subItem = item[sub];
        formData.value[sub] = subItem;
      }
    }
  }
};
getSetting();
// 保存设置
const saveSettings = () => {
  formRef.value.validate(async(valid)=>{
    if(!valid) {
      return;
    }
    let params=Object.assign({},formData.value);
    const result=await proxy.Request({
      url: api.saveSetting,
      params
    })
    if(!result) {
      return;
    }
    proxy.Message.success("保存成功！");
  })
};
</script>

<style lang="scss" scoped>
</style>