<template>
  <div class="attachment-upload">
    <div class="file-panel" v-if="modelValue">
      <div class="file-name">{{modelValue.name}}</div>
      <div class="iconfont icon-del" @click="delFile"></div>
    </div>
    <el-upload
    v-else
    accept=".zip,.rar"
    :show-file-list="false"
    :multiple="false"
    :http-request="selectFile"
    >
    <el-button type="primary">选择文件</el-button>
    </el-upload>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref} from 'vue'
const {proxy}=getCurrentInstance()

const props=defineProps({
  modelValue: {
    type: Object,
    default: null
  },
})
const emit=defineEmits()
const selectFile=(file)=>{
  // 父子组件中的双向绑定
  emit("update:modelValue",file.file)
}
const delFile=()=>{
  emit("update:modelValue",null)
}
</script>

<style lang="scss" scoped>
.attachment-upload{
  width: 100%;
  .file-panel{
    display: flex;
    justify-content: space-around;
    .file-name {
      flex: 1;
      color: var(--link);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .iconfont {
      cursor: pointer;
      color: var(--link);
      margin-right: 10px;
    }
  }
}
</style>