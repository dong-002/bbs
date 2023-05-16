<template>
  <el-config-provider :locale="locale" :message="config">
      <router-view />
    </el-config-provider>
</template>

<script setup>
// 全局配置
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { reactive } from "vue";
const locale=zhCn //中文
// ElMessage页面上最多只能出现一条
const config=reactive({
  max: 1
})
</script>

<style lang="sass" scoped>
</style>