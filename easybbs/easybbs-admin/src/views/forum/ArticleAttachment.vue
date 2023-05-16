<template>
  <div class="article-attachment">
    <Dialog
      :show="dialog.show"
      :title="dialog.title"
      :buttons="dialog.buttons"
      width="500px"
      @close="dialog.show = false"
    >
      <el-form :model="formData"  label-width="120px">
        <el-form-item label="发布人:">
          <Avatar :userId="formData.userId" :width="40"></Avatar>
          <span :style="{'margin-left':'5px'}">{{formData.nickName}}</span>
        </el-form-item>
        <el-form-item label="文件名:">
          {{formData.fileName}}
        </el-form-item>
        <el-form-item label="文件大小:">
          {{proxy.SizeFormat.sizeFormat(formData.fileSize)}}
        </el-form-item>
        <el-form-item label="下载所需积分:">
          {{formData.integral}}
        </el-form-item>
        <el-form-item>
          <a :href="'/api/forum/attachmentDownload?fileId='+formData.fileId" class="a-link" target="__blank">下载</a>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api={
  getAttachment:"/forum/getAttachment"
}

const dialog = reactive({
  show: false,
  title: "附件信息",
  buttons: [
    {
      type: "primary",
      text: "关闭",
      click: (e) => {
        dialog.show=false
      },
    },
  ],
});

const formData = ref({});

const showArticleAttachment=async(nickName,articleId)=>{
  dialog.show=true;
  const result=await proxy.Request({
    url: api.getAttachment,
    params: {
      articleId: articleId
    }
  })
  if(!result) {
    return;
  }
  formData.value=result.data;
  formData.value.nickName=nickName
}
defineExpose({showArticleAttachment})
</script>

<style lang="scss" scoped>
</style>