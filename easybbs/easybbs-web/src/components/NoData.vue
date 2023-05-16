<template>
  <div class="no-data">
    <div class="iconfont icon-empty"></div>
    <p class="msg">{{msg}}</p>
  </div>
</template>

<script setup>
const props=defineProps({
  msg: {
    type: String
  }
})
</script>

<style lang="scss" scoped>
.no-data {
  text-align: center;
  color: #878787;
  .icon-empty {
    margin-top: 15px;
    font-size: 50px;
  } 
  p {
    margin: 10px;
  }
}
</style>