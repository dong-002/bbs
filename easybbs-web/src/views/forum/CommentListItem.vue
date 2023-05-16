<template>
  <div class="comment-list-item">
    <div class="user-avatar">
      <Avatar :userId="commentItem.userId" :width="50"></Avatar>
    </div>
    <div class="comment-content">
      <div class="nickname">
        <router-link :to="`/user/${commentItem.userId}`">{{
          commentItem.nickName
        }}</router-link>
        <span v-if="articleUserId == commentItem.userId" class="author"
          >作者</span
        >
      </div>
      <div class="content">
        <span v-if="commentItem.topType==1" class="tag top"
          >置顶</span
        >
        <span v-if="commentItem.status==0" class="tag no-admit"
          >待审核</span
        >
        <span v-html="commentItem.content"></span>
        <CommentImage
          v-if="commentItem.imgPath"
          :src="
            proxy.globalInfo.imageUrl + commentItem.imgPath.replace('.', '_.')
          "
          :imgList="[proxy.globalInfo.imageUrl + commentItem.imgPath]"
        ></CommentImage>
      </div>
      <!-- 点赞、回复一级评论 -->
      <div class="op-panel">
        <span class="time">{{ commentItem.postTime }}</span>
        ·
        <span class="address">{{ commentItem.userIpAddress }}</span>
        <span
          :class="[
            'iconfont',
            'icon-good',
            commentItem.likeType == 1 ? 'active' : '',
          ]"
          @click="doLike(commentItem)"
          >{{
            commentItem.goodCount == 0 ? "点赞" : commentItem.goodCount
          }}</span
        >
        <span
          class="iconfont icon-comment"
          @click="showReplyPanel(commentItem, 0)"
          >回复</span
        >
        <!-- 作者可以顶置操作 -->
        <el-dropdown v-if="articleUserId == currentUserId">
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <span @click="changeTop(commentItem.commentId)">{{ commentItem.topType == 0 ? "设为置顶" : "取消置顶" }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 二级评论 -->
      <div class="sub-comment-list" v-if="commentItem.children">
        <div
          class="sub-comment-item"
          v-for="item in commentItem.children"
          :key="item"
        >
          <Avatar :width="30" :userId="item.userId"></Avatar>
          <div class="container">
            <div class="sub-comment-info">
              <div class="nickname">
                <router-link :to="`/user/${item.userId}`">{{
                  item.nickName
                }}</router-link>
                <span v-if="articleUserId == item.userId" class="author"
                  >作者</span
                >
                <span class="reply">回复</span>
                <router-link
                  :to="`/user/${item.replyUserId}`"
                  class="reply-nickname"
                  >@{{ item.replyNickName }}</router-link
                >
                :
                <span v-html="item.content" class="sub-content"></span>
              </div>
            </div>
            <!-- 点赞、回复二级评论 -->
            <div class="op-panel">
              <span class="time">{{ item.postTime }}</span>
              ·
              <span class="address">{{ item.userIpAddress }}</span>
              <span
                :class="[
                  'iconfont',
                  'icon-good',
                  item.likeType == 1 ? 'active' : '',
                ]"
                @click="doLike(item)"
                >{{ item.goodCount == 0 ? "点赞" : item.goodCount }}</span
              >
              <span
                class="iconfont icon-comment"
                @click="showReplyPanel(item, 1)"
                >回复</span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- 二级回复弹框 -->
      <div class="reply-info" v-if="commentItem.showReply">
        <PostComment
          :articleId="articleId"
          :pCommentId="pCommentId"
          :replyUserId="replyUserId"
          :userId="currentUserId"
          :avatarWidth="50"
          :placeholderInfo="placeholderInfo"
          @postCommentFinish="postCommentFinish"
        ></PostComment>
      </div>
    </div>
  </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import PostComment from "./PostComment.vue";
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  commentItem: {
    type: Object,
  },
  articleId: {
    type: String,
  },
  articleUserId: {
    type: String,
  },
  currentUserId: {
    type: String,
  },
});

const api = {
  doLike: "/comment/doLike",
};
const emit = defineEmits(["hiddenAllReply","changeTop"]);
const placeholderInfo = ref(null);
const pCommentId = ref(0); //表示评论文章（0）还是回复他人的评论
const replyUserId = ref(null);
const showReplyPanel = (commonData, type) => {
  // 父级有全部的评论，点击当前回复会关闭所有一级评论弹框，然后显示自己的弹框
  let haveShow =
    props.commentItem.showReply == undefined
      ? false
      : props.commentItem.showReply;
  emit("hiddenAllReply");
  if (type == 0) {
    // 回复一级评论
    props.commentItem.showReply = !haveShow;
  } else {
    // 回复二级评论
    props.commentItem.showReply = true;
  }
  pCommentId.value = props.commentItem.commentId;
  replyUserId.value = commonData.userId;
  placeholderInfo.value = "回复@ " + commonData.nickName;
};

// 二级评论回复完成
const postCommentFinish = (resultData) => {
  props.commentItem.children = resultData;
  placeholderInfo.value = undefined;
  props.commentItem.showReply = false;
};

// 点赞
const doLike = async (commentObj) => {
  const result = await proxy.Request({
    url: api.doLike,
    params: {
      commentId: commentObj.commentId,
    },
    showLoading: false,
  });
  if (!result) {
    return;
  }
  commentObj.goodCount = result.data.goodCount;
  commentObj.likeType = result.data.likeType;
};

// 评论置顶操作
const changeTop=(id)=>{
  let topType=props.commentItem.topType==0?1:0
  emit("changeTop",id,topType)
}
</script>

<style lang="scss" scoped>
.comment-list-item {
  padding-top: 20px;
  display: flex;
  .comment-content {
    flex: 1;
    margin-left: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ddd;
    .nickname {
      a {
        color: rgb(84, 84, 84);
        font-size: 14px;
      }
      .author {
        margin-left: 5px;
        padding: 0 2px;
        font-size: 12px;
        color: #fff;
        background: #ff6699;
        border-radius: 2px;
      }
    }
    .content {
      font-size: 16px;
      padding: 10px 0 5px 0;
      .tag {
        margin-right: 5px;
        padding: 0 2px;
        font-size: 12px;
        background: #fff;
        border-radius: 2px;
      }
      .top {
        color: #ff6699;
        border: 1px solid #ff6699;
      }
      .no-admit {
        color: #838383;
        border: 1px solid #c0c0c0;
      }
    }
    .op-panel {
      color: #9499a0;
      .time,
      .address {
        font-size: 13px;
      }
      .iconfont {
        margin-left: 18px;
        cursor: pointer;
      }
      :deep():focus {
        outline: none;
      }
      .active {
        color: var(--link);
      }
    }
    .sub-comment-list {
      .sub-comment-item {
        margin-top: 10px;
        display: flex;
        .container {
          flex: 1;
          margin-left: 5px;
          .nickname {
            a {
              color: rgb(84, 84, 84);
              font-size: 14px;
            }
            .author {
              margin-left: 5px;
              padding: 0 2px;
              font-size: 12px;
              color: #fff;
              background: #ff6699;
              border-radius: 2px;
            }
            .reply {
              padding-left: 8px;
              font-size: 13px;
            }
            .reply-nickname {
              font-size: 14px;
              color: var(--link);
            }
            .sub-content {
              padding-left: 5px;
            }
          }
          .op-panel {
            color: #9499a0;
            padding-top: 3px;
            .time,
            .address {
              font-size: 13px;
            }
            .iconfont {
              margin-left: 18px;
              cursor: pointer;
            }
            :deep():focus {
              outline: none;
            }
          }
        }
      }
    }
    .reply-info {
      margin-top: 15px;
    }
  }
}
</style>