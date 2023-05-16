<template>
  <div class="comment-img">
    <el-image
      :src="src"
      :zoom-rate="1.2"
      :preview-src-list="imgList?imgList:[src]"
      fit="scale-down"
      hide-on-click-modal
    />
  </div>
</template>

<script setup>
const props=defineProps({
  src: {
    type: String
  },
  imgList: {
    type: Array
  }
})
</script>

<style lang="scss" scoped>
.comment-img {
  width: 80px;
  height: 80px;
  background: #eee;
  overflow: hidden;
  margin-top: 10px;
  display: flex;
  align-items: center;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>