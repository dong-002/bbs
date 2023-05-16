<template>
  <div class="img-viewer">
    <el-image-viewer
    :url-list="imageList"
    :initial-index="previewImgIndex"
    hide-on-click-modal
    @close="closeImgViewer"
    v-if="previewImgIndex!=null"
    >
    </el-image-viewer>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const props=defineProps({
  imageList:{
    type: Array
  }
})
const previewImgIndex=ref(null)

//当开启预览就停止滚动条，否则在预览时出现滚动条会影响预览图片的大小
const stopScroll=()=>{
  document.body.style.overflow="hidden"
}
const startScroll=()=>{
  document.body.style.overflow="auto"
}
const showViewer=(index)=>{
  previewImgIndex.value=index
  stopScroll()
}
defineExpose({showViewer})

const closeImgViewer=()=>{
  startScroll()
  previewImgIndex.value=null
}
</script>

<style lang="scss" scoped>
.img-viewer {
  :deep(.el-image-viewer__mask) {
    opacity: 0.7;
  }
}
</style>