<template>
  <div
    class="container-body user-container"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="board-info">
      <router-link to="/">首页</router-link>
      <span class="item">></span>
      <span class="item">个人中心</span>
    </div>
    <div class="user-main">
      <!-- 左边信息栏 -->
      <div class="left-info">
        <div class="avatar-panel">
          <div class="edit-btn a-link" v-if="isCurrentUser" @click="updateUserInfo">修改信息</div>
          <div class="avatar">
            <Avatar :userId="userId" :width="120"></Avatar>
          </div>
          <div class="nick-name">
            <span>{{ userInfo.nickName }}</span>
            <span
              :class="[
                'iconfont',
                userInfo.sex == 0 ? 'icon-woman' : 'icon-man',
              ]"
            ></span>
          </div>
          <div class="desc">
            {{ userInfo.personDescription }}
          </div>
        </div>
        <div class="info-panel">
          <div class="info-item">
            <div>
              <span class="iconfont icon-integral"></span>
              <span class="text">&nbsp;积分</span>
            </div>
            <span class="number a-link" v-if="isCurrentUser" @click="showIntegralDialog">{{
              userInfo.currentIntegral
            }}</span>
            <span class="number" v-else>{{ userInfo.currentIntegral }}</span>
          </div>
          <div class="info-item">
            <div>
              <span class="iconfont icon-good"></span>
              <span class="text">&nbsp;获赞</span>
            </div>
            <span class="number">{{ userInfo.likeCount }}</span>
          </div>
          <div class="info-item">
            <div>
              <span class="iconfont icon-edit" style="font-size: 18px"></span>
              <span class="text">&nbsp;发帖</span>
            </div>
            <span class="number">{{ userInfo.postCount }}</span>
          </div>
          <div class="info-item">
            <div>
              <span class="iconfont icon-register"></span>
              <span class="text">&nbsp;加入</span>
            </div>
            <span class="number">{{ userInfo.joinTime }}</span>
          </div>
          <div class="info-item">
            <div>
              <span class="iconfont icon-login"></span>
              <span class="text">&nbsp;最后登录</span>
            </div>
            <span class="number">{{ userInfo.lastLoginTime }}</span>
          </div>
        </div>
      </div>
      <!-- 右边内容 -->
      <div class="user-post-content">
        <div class="top-tab">
          <el-tabs
            class="demo-tabs"
            :model-value="activeName"
            @tab-change="changeTab"
          >
            <el-tab-pane label="发帖" :name="0"></el-tab-pane>
            <el-tab-pane label="评论" :name="1"></el-tab-pane>
            <el-tab-pane label="点赞" :name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="article-content">
          <DataList
          :dataSource="articleList"
          :loading="loading"
          noDataMsg="暂无相关文章"
          @loadData="loadArticle"
          >
            <template #default="{data}">
              <ArticleListItem :item="data" :showEdit="activeName==0&&isCurrentUser" :showComment="showComment"></ArticleListItem>
            </template>
          </DataList>
        </div>
      </div>
    </div>
    <EditUserInfo ref="editUserInfoRef" @resetUserInfo="resetUserInfo"></EditUserInfo>
    <UserIntegralInfo ref="integralInfoRef"></UserIntegralInfo>
  </div>
</template>

<script setup>
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import EditUserInfo from './EditUserInfo.vue'
import UserIntegralInfo from './UserIntegralInfo.vue'
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store/index.js";
const route = useRoute();
const router = useRouter();
const store = useStore();
const { proxy } = getCurrentInstance();
const api = {
  getUserInfo: "/ucenter/getUserInfo",
  loadUserArticle: "/ucenter/loadUserArticle",
};

const userId = ref();
// 获取用户信息
const userInfo = ref({});
const getUserInfo = async () => {
  const result = await proxy.Request({
    url: api.getUserInfo,
    params: {
      userId: userId.value,
    },
    errorCallback: () => {
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data;
};

// 右边文章
const activeName=ref(0)
const changeTab = (type) => {
  activeName.value=type
  loadArticle()
};

const articleList = ref({});
const loading = ref(false); //请求时显示骨架屏
const loadArticle = async () => {
  let params = {
    pageNo: articleList.value.pageNo,
    type: activeName.value,
    userId: userId.value
  };
  loading.value = true;
  const result = await proxy.Request({
    url: api.loadUserArticle,
    params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleList.value = result.data;
};

watch(
  () => route.params.userId,
  (newVal, oldVal) => {
    if(newVal) {
      userId.value = newVal;
      getUserInfo();
      loadArticle()
    }
  },
  { immediate: true, deep: true }
);
// 是否为当前用户
const isCurrentUser = ref(false);
watch(
  () => store.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal && newVal.userId === userId.value) {
      isCurrentUser.value = true;
    } else {
      isCurrentUser.value = false;
    }
  },
  { immediate: true, deep: true }
);

// 修改个人信息
const editUserInfoRef=ref(null)
const updateUserInfo=()=>{
  editUserInfoRef.value.showEditDialog(userInfo.value)
}

const resetUserInfo=(data)=>{
  userInfo.value=data
}

// 查看积分记录
const integralInfoRef=ref()
const showIntegralDialog=()=>{
  integralInfoRef.value.showRecordDialog()
}

// 是否开启评论
const showComment = ref(false);
watch(
  () => store.sysSetting,
  (newVal, oldVal) => {
    if (newVal) {
      showComment.value = newVal.commentOpen;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.user-container {
  .board-info {
    line-height: 35px;
    .item {
      padding-left: 15px;
    }
  }
  .user-main {
    display: flex;
    .left-info {
      width: 300px;
      .avatar-panel {
        background: #fff;
        text-align: center;
        padding: 10px 0;
        .edit-btn {
          font-size: 14px;
          text-align: right;
          color: var(--link);
          margin-right: 10px;
        }
        .avatar {
          display: flex;
          justify-content: center;
        }
        .nick-name {
          padding-top: 10px;
          .iconfont {
            color: var(--link);
            font-size: 18px;
          }
        }
        .desc {
          font-size: 13px;
          text-align: left;
          padding: 10px;
        }
      }
      .info-panel {
        margin-top: 10px;
        padding: 10px;
        background: #fff;
        .info-item {
          line-height: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .iconfont {
            color: rgb(118, 118, 118);
            font-size: 22px;
          }
          .text,
          .number {
            font-size: 13px;
          }
          .a-link {
            color: var(--link);
          }
        }
      }
    }
    .user-post-content {
      flex: 1;
      background: #fff;
      padding: 0 10px 10px 10px;
      margin-left: 10px;
    }
  }
}
</style>