<template>
  <div class="article-item">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <Avatar :userId="item.userId" class="avtar" :width="30"></Avatar>
          <router-link :to="'/user/' + item.userId" class="name">{{
            item.nickName
          }}</router-link>
          <el-divider direction="vertical"></el-divider>
          <div class="time">{{ item.postTime }}</div>
          &nbsp;·&nbsp;
          <div class="address">{{ item.userIpAddress }}</div>
          <el-divider direction="vertical"></el-divider>
          <div class="board">
            <router-link :to="'/forum/'+item.pBoardId"
              ><span>{{ item.pBoardName }}</span></router-link
            >
            <span v-if="item.boardName">&nbsp;/&nbsp;</span>
            <router-link :to="'/forum/'+item.pBoardId+'/'+item.boardId"
              ><span>{{ item.boardName }}</span></router-link
            >
          </div>
        </div>
        <router-link :to="'/post/'+item.articleId" class="title">
          <el-tag class="istop" type="danger" v-if="item.topType == 1">置顶</el-tag>
          <el-tag class="istop" type="info" v-if="item.status == 0">待审核</el-tag>
          <span v-if="htmlTitle" v-html="item.title"></span>
          <span v-else>{{item.title}}</span>
        </router-link>
        <div class="summary">{{ item.summary }}</div>
        <div class="article-info">
          <span class="iconfont icon-eye">&nbsp;{{ item.readCount== 0 ? "阅读" : item.readCount }}</span>
          <span class="iconfont icon-good">&nbsp;{{ item.goodCount == 0 ? "点赞" : item.goodCount }}</span>
          <span class="iconfont icon-comment" v-if="showComment">&nbsp;{{ item.commentCount== 0 ? "评论" : item.commentCount }}</span>
          <span class="iconfont icon-edit edit-btn" v-if="showEdit" @click="editArticle(item.articleId)">编辑</span>
        </div>
      </div>
      <router-link :to="'/post/'+item.articleId">
        <Cover :width="100" :coverUrl="item.cover"></Cover>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const props = defineProps({
  // 文章信息
  item: {
    type: Object,
  },
  // 是否开启评论
  showComment:{
    type: Boolean
  },
  showEdit: {
    type: Boolean
  },
  htmlTitle: {
    type: Boolean,
    default: false
  }
});
//修改
const editArticle = (articleId) => {
  router.push("/editPost/"+articleId)
};
</script>

<style lang="scss" scoped>
.article-item {
  padding: 0 15px;
  .article-item-inner {
    padding: 15px 0;
    display: flex;
    border-bottom: 1px solid #ddd;
    .article-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-right: 15px;
      .user-info {
        display: flex;
        align-items: center;
        color: #4e5969;
        .avatar {
          cursor: pointer;
        }
        .name {
          font-size: 14px;
          margin-left: 6px;
          color: rgb(72, 72, 72);
        }
        .name:hover {
          color: #409eff;
        }
        .time {
          font-size: 13px;
        }
        .address {
          font-size: 13px;
        }
        .board {
          font-size: 14px;
          a {
            color: rgb(72, 72, 72);
          }
          a:hover {
            color: #409eff;
          }
        }
      }
      .title {
        display: flex;
        align-items: center;
        color: #4a4a4a;
        font-weight: bold;
        margin: 10px 0;
        .istop {
          margin-right: 5px;
        }
      }
      .title:hover {
        color: #409eff;
      }
      .summary {
        font-size: 14px;
        color: #737577;
      }
      .article-info {
        display: flex;
        align-items: center;
        margin-top: 10px;
        span {
          color: rgb(152, 152, 152);
          font-size: 14px;
          margin-right: 25px;
        }
        .edit-btn {
          color: var(--link);
          cursor: pointer;
        }
      }
    }
    
  }
}
.article-item:hover {
  background: rgb(249, 247, 247);
}
</style>