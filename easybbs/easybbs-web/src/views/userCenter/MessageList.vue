<template>
  <div
    class="container-body user-message"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="board-info">
      <router-link to="/">首页</router-link>
      <span class="item">></span>
      <span class="item">消息中心</span>
    </div>
    <div class="message-panel">
      <div class="tab-list">
        <el-tabs :model-value="activeName" @tab-change="tabChange">
          <el-tab-pane name="reply">
            <template #label>
              <div class="message-tab">
                <span>回复我的</span>
                <span class="count-tag" v-if="messageCount.reply > 0">{{
                  messageCount.reply > 99 ? "99+" : messageCount.reply
                }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likePost">
            <template #label>
              <div class="message-tab">
                <span>赞了我的文章</span>
                <span class="count-tag" v-if="messageCount.likePost > 0">{{
                  messageCount.likePost > 99 ? "99+" : messageCount.likePost
                }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="downloadAttachment">
            <template #label>
              <div class="message-tab">
                <span>下载了我的附件</span>
                <span
                  class="count-tag"
                  v-if="messageCount.downloadAttachment > 0"
                  >{{
                    messageCount.downloadAttachment > 99
                      ? "99+"
                      : messageCount.downloadAttachment
                  }}</span
                >
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likeComment">
            <template #label>
              <div class="message-tab">
                <span>赞了我的评论</span>
                <span class="count-tag" v-if="messageCount.likeComment > 0">{{
                  messageCount.likeComment > 99
                    ? "99+"
                    : messageCount.likeComment
                }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="sys">
            <template #label>
              <div class="message-tab">
                <span>系统消息</span>
                <span class="count-tag" v-if="messageCount.sys > 0">{{
                  messageCount.sys > 99 ? "99+" : messageCount.sys
                }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <router-link :to="`/user/${userId}`" class="goto-usercenter">&lt;&lt;个人中心</router-link>
      </div>
      <div class="message-list">
        <DataList
          :dataSource="messageList"
          :loading="loading"
          @loadData="loadMessage"
        >
          <!-- 插槽作用域 DataList中传过来的data 使用解构 不然用item.data -->
          <template #default="{ data }">
            <!-- 系统消息 -->
            <div class="message-item" v-if="data.messageType==0">
              <div class="message-content">
                <span v-html="data.messageContent"></span>
                <span class="create-time">{{data.createTime}}</span>
              </div>
            </div>
            <!-- 回复我的 -->
            <div class="message-item" v-if="data.messageType==1">
              <Avatar :userId="data.sendUserId" :width="50"></Avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`">{{data.sendNickName}}</router-link>
                  对我的文章【<router-link :to="`/post/${data.articleId}`">{{data.articleTitle}}</router-link>】发表了评论
                  <span class="create-time">{{data.createTime}}</span>
                </div>
                <div class="reply-content" v-html="data.messageContent"></div>
              </div>
            </div>
            <!-- 赞了我的文章 -->
            <div class="message-item" v-if="data.messageType==2">
              <Avatar :userId="data.sendUserId" :width="50"></Avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`">{{data.sendNickName}}</router-link>
                  赞了我的文章【<router-link :to="`/post/${data.articleId}`">{{data.articleTitle}}</router-link>】
                  <span class="create-time">{{data.createTime}}</span>
                </div>
              </div>
            </div>
            <!-- 附件下载 -->
            <div class="message-item" v-if="data.messageType==4">
              <Avatar :userId="data.sendUserId" :width="50"></Avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`">{{data.sendNickName}}</router-link>
                  在文章【<router-link :to="`/post/${data.articleId}`">{{data.articleTitle}}</router-link>】中下载了附件
                  <span class="create-time">{{data.createTime}}</span>
                </div>
              </div>
            </div>
            <!-- 评论点赞 -->
            <div class="message-item" v-if="data.messageType==3">
              <Avatar :userId="data.sendUserId" :width="50"></Avatar>
              <div class="message-content">
                <div>
                  <router-link :to="`/user/${data.sendUserId}`">{{data.sendNickName}}</router-link>
                  在文章【<router-link :to="`/post/${data.articleId}`">{{data.articleTitle}}</router-link>】对我的评论点了赞
                  <span class="create-time">{{data.createTime}}</span>
                </div>
                <div class="reply-content" v-html="data.messageContent"></div>
              </div>
            </div>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store/index.js";
const store = useStore();
const { proxy } = getCurrentInstance(); //通过proxy可以拿到全局变量 proxy相当于vue2中的this
const router = useRouter();
const route = useRoute();
const api = {
  loadMessageList: "/ucenter/loadMessageList",
};

const activeName = ref("reply");
const tabChange = (type) => {
  router.push(`/user/message/${type}`);
};
const messageList = ref({});
const loading = ref(false); //请求时显示骨架屏
const loadMessage = async () => {
  let params = {
    pageNo: messageList.value.pageNo,
    code: activeName.value,
  };
  loading.value = true;
  const result = await proxy.Request({
    url: api.loadMessageList,
    params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  messageList.value = result.data;
  store.readMessage(activeName.value);
};
// 监听路由变化，重新获取消息列表
watch(
  () => route.params.type,
  (newVal, oldVal) => {
    if (newVal) {
      activeName.value = newVal;
      loadMessage();
    }
  },
  { immediate: true, deep: true }
);

// 用户信息
const userId = ref(null);
watch(
  () => store.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal.userId;
    }
  },
  { immediate: true, deep: true }
);
// 消息数量
const messageCount = ref({});
watch(
  () => store.messageCountInfo,
  (newVal, oldVal) => {
    messageCount.value = newVal || {};
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.user-message {
  .board-info {
    line-height: 35px;
    .item {
      padding-left: 15px;
    }
  }
  .message-panel {
    background: #fff;
    padding: 10px;
    margin-top: 5px;
    .tab-list {
      position: relative;
      .message-tab {
        position: relative;
        padding: 0 10px;
        .count-tag {
          position: absolute;
          top: -10px;
          right: -15px;
          margin-left: 8px;
          width: 23px;
          height: 18px;
          line-height: 18px;
          background: #f56c6c;
          color: #fff;
          border-radius: 50%;
          text-align: center;
          font-size: 13px;
        }
      }
      .goto-usercenter {
        position: absolute;
        right: 10px;
        top: 5px;
      }
    }
    .message-list {
      .message-item {
        display: flex;
        font-size: 14px;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        .message-content {
          margin-left: 5px;
          .create-time {
            padding-left: 10px;
            color: #868686;
          }
          .reply-content {
            border-left: 3px solid #5ab2e8;
            padding-left: 5px;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>