<template>
  <div
    class="avatar"
    :style="{
      width: width + 'px',
      height: width + 'px',
      'border-radius': width / 2 + 'px',
    }"
  >
    <el-image
      v-if="userId"
      :style="{
        width: width + 'px',
        height: width + 'px',
        'border-radius': width / 2 + 'px',
      }"
      :src="proxy.globalInfo.avatarUrl + userId"
      fit="scale-down"
      loading="lazy"
      @click="gotoUserCenter"
    ></el-image>
    <div v-else class="no-login">未登录</div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const router = useRouter();

const propos = defineProps({
  userId: {
    type: String,
  },
  width: {
    type: Number,
    default: 50,
  },
  addLink: {
    type: Boolean,
    default: true,
  },
});
const gotoUserCenter = () => {
  if (propos.addLink) {
    router.push("/user/" + propos.userId);
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  display: flex;
  align-items: center;
  overflow: hidden;
  background: rgb(242, 241, 241);
  cursor: pointer;
  .no-login {
    width: 100%;
    font-size: 13px;
    text-align: center;
  }
}
</style>