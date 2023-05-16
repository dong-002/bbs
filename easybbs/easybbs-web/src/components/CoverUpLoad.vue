<template>
  <div class="cover-upload">
    <el-upload
    :show-file-list="false"
    accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
    :multiple="false"
    :http-request="selectImg"
    >
    <div class="upload-btn">
      <template v-if="localFile">
        <img :src="localFile" />
      </template>
      <template v-else>
        <img :src="(imgUrlPrefix?imgUrlPrefix:proxy.globalInfo.imageUrl)+modelValue.imageUrl" v-if="modelValue&&modelValue.imageUrl" />
        <span class="iconfont icon-add" v-else></span>
      </template>
    </div>
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
  imgUrlPrefix: {
    type: String
  }
})
const localFile=ref(null)
const emit=defineEmits()
const selectImg=(file)=>{
  file=file.file
  let img=new FileReader()
  img.readAsDataURL(file)
  img.onload=()=>{
    localFile.value=img.result
  }
  // 父子组件中的双向绑定
  emit("update:modelValue",file)
}
</script>

<style lang="scss" scoped>
.cover-upload{
  .upload-btn{
    width: 150px;
    height: 150px;
    background: rgb(247, 245, 245);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .iconfont {
      font-size: 50px;
      color: rgb(181, 181, 181);
    }
    img {
      width: 100%;
    }
  }
}
</style>