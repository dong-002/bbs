<template>
  <div class="comment-container">
    <div class="comment-header">
      <div class="comment-title">
        <span class="title">评论</span
        ><span class="count">{{ commentInfo.totalCount }}</span>
      </div>
      <div class="sort">
        <span @click="sortComment(0)" :class="[orderType==0?'active':'']">热门</span>
        <el-divider direction="vertical"></el-divider>
        <span @click="sortComment(1)" :class="[orderType==1?'active':'']">最新</span>
      </div>
    </div>
    <!-- 一级评论弹框 -->
    <div class="comment-panel">
      <PostComment :userId="userInfo.userId" :avatarWidth="50" :showInsertImg="userInfo.userId?true:false" :articleId="articleId" :pCommentId=0 @postCommentFinish="postCommentFinish"></PostComment>
    </div>
    <div class="comment-list">
      <DataList
        :dataSource="commentInfo"
        :loading="loading"
        @loadData="loadComment"
        noDataMsg="暂无评论，赶紧占沙发吧！"
      >
      <template #default="{data}">
        <CommentListItem :commentItem="data" 
        :articleId="articleId"
        :articleUserId="articleUserId" :currentUserId="userInfo.userId"
        @hiddenAllReply="hiddenAllReply"
        @changeTop="changeTop"
        ></CommentListItem>
      </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import PostComment from './PostComment.vue'
import CommentListItem from './CommentListItem.vue'
import { getCurrentInstance, reactive, ref, watch } from "vue";
import { useStore } from "@/store/index.js";
const store = useStore();
const { proxy } = getCurrentInstance();
const api = {
  loadComment: "/comment/loadComment",
  postComment: "/comment/postComment",
  doLike: "/comment/doLike",
  changeTopType: "/comment/changeTopType"
};
const props = defineProps({
  articleId: {
    type: String,
  },
  articleUserId: {
    type: String,
  },
});
//当前登录人信息
const userInfo = ref({});
watch(
  () => store.loginUserInfo,
  (newVal, oldVal) => {
    userInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

// 评论排序
const orderType = ref(0);
const sortComment=(type)=>{
  orderType.value=type
  loadComment()
}
// 评论信息
const commentInfo = ref({});
const commentList = ref([]);
let loading=ref(false)
const loadComment = async () => {
  let params = {
    pageNo: commentInfo.value.pageNo,
    articleId: props.articleId,
    orderType: orderType.value,
  };
  loading.value=true
  const result = await proxy.Request({
    url: api.loadComment,
    params,
  });
  loading.value=false
  if (!result) {
    return;
  }
  commentInfo.value = result.data;
  commentList.value = result.data.list;
};
loadComment();

// 显示或隐藏评论弹框
const hiddenAllReply=()=>{
  commentList.value.forEach(item=>{
    item.showReply=false
  })
}

// 评论完成
const emit=defineEmits(["updateCommentCount"])
const postCommentFinish=(resultData)=>{
  // 要在一级评论添加新增的评论
  commentList.value.unshift(resultData)
  commentInfo.value.totalCount=commentInfo.value.totalCount+1
  let totalCount=commentInfo.value.totalCount
  emit("updateCommentCount",totalCount)
}
// 评论置顶操作
const changeTop=async(id,topType)=>{
  const result=await proxy.Request({
    url: api.changeTopType,
    params: {
      commentId: id,
      topType: topType
    }
  })
  if(!result) {
    return;
  }
  loadComment()
}
</script>

<style lang="scss" scoped>
.comment-container {
  .comment-header {
    display: flex;
    align-items: center;
    text-align: center;
    .comment-title {
      .title {
        font-size: 24px;
      }
      .count {
        padding-left: 10px;
      }
    }
    .sort {
      margin-left: 30px;
      span {
        cursor: pointer;
      }
      .active {
        color: #409eff;
      }
    }
  }
  .comment-panel {
    margin: 20px 0;
  }
}
</style>