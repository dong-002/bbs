<template>
  <div
    class="container-body detail-page"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    v-if="Object.keys(articleInfo).length > 0"
  >
    <!-- 导航 -->
    <div class="board-info">
      <router-link :to="'/forum/' + articleInfo.pBoardId">{{
        articleInfo.pBoardName
      }}</router-link>
      <span class="iconfont icon-arrow-right"></span>
      <router-link
        :to="'/forum/' + articleInfo.pBoardId + '/' + articleInfo.boardId"
        v-if="articleInfo.boardId"
        >{{ articleInfo.boardName }}</router-link
      >
      <span class="iconfont icon-arrow-right" v-if="articleInfo.boardId"></span>
      <span>{{ articleInfo.title }}</span>
    </div>
    <!-- 文章内容 -->
    <div
      class="detail-container"
      :style="{ width: proxy.globalInfo.bodyWidth - 300 + 'px' }"
    >
      <!-- 文章具体内容 -->
      <div class="detail-content">
        <div class="article-title">
          {{ articleInfo.title }}
          <el-tag v-if="articleInfo.status == 0" type="info">待审核</el-tag>
        </div>
        <!-- 用户信息 -->
        <div class="user-info">
          <Avatar
            :userId="articleInfo.userId"
            :width="50"
            class="avatar"
          ></Avatar>
          <div class="user-info-detail">
            <div class="nickname">
              <router-link :to="'/user/' + articleInfo.userId">{{
                articleInfo.nickName
              }}</router-link>
            </div>
            <div class="time-address">
              <span class="time">{{ articleInfo.postTime }}</span>
              &nbsp;·&nbsp;
              <span class="address">{{ articleInfo.userIpAddress }}</span>
              <span class="iconfont icon-eye"
                >&nbsp;{{ articleInfo.readCount }}</span
              >
              <router-link
                v-if="currentUserInfo.userId == articleInfo.userId"
                :to="`/editPost/${articleInfo.articleId}`"
                ><span class="iconfont icon-edit">编辑</span>
              </router-link>
            </div>
          </div>
        </div>
        <!-- 内容 -->
        <div class="content" id="content" v-html="articleInfo.content"></div>
      </div>
      <!-- 附件 -->
      <div class="attachment" v-if="attachment" id="attachment">
        <div class="title">附件</div>
        <div class="file-info">
          <div class="iconfont icon-file-zip"></div>
          <div class="fileName">{{ attachment.fileName }}</div>
          <div class="fileSize">
            {{ proxy.SizeFormat.sizeFormat(attachment.fileSize) }}
          </div>
          <div class="integral">
            需要&nbsp;<span>{{ attachment.integral }}</span
            >&nbsp;积分
          </div>
          <div class="downloadCount">
            已下载{{ attachment.downloadCount }}次
          </div>
          <el-button
            type="primary"
            size="small"
            @click="downloadAttachment(attachment.fileId)"
            >下载</el-button
          >
        </div>
      </div>
      <!-- 评论 -->
      <div class="comment" id="comment" v-if="showComment&&articleInfo.status==1">
        <CommentList
          v-if="articleInfo.articleId"
          :articleId="articleInfo.articleId"
          :articleUserId="articleInfo.userId"
          @updateCommentCount="updateCommentCount"
        ></CommentList>
      </div>
    </div>
    <!-- 右边目录栏 -->
    <div class="dir-right">
      <div class="dir-content">
        <div class="dir-title">目录</div>
        <div class="dir-list">
          <template v-if="dirArray.length == 0">
            <div class="no-dir">暂无目录</div>
          </template>
          <template v-else>
            <div v-for="dir in dirArray" :key="dir">
              <span
                :class="['dir-item', dir.id == anchor ? 'active' : '']"
                @click="gotoDir(dir.id)"
                :style="{ 'padding-left': dir.level * 15 + 'px' }"
                >{{ dir.name }}</span
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <!-- 左边操作栏 -->
  <div
    class="left-operate"
    :style="{ left: leftWidth + 'px' }"
    v-if="leftWidth >= 0"
  >
    <el-badge
      :value="articleInfo.goodCount"
      type="info"
      :hidden="!articleInfo.goodCount > 0"
    >
      <div class="good item" @click="likeHandler">
        <span :class="['iconfont icon-good', haveLike ? 'like' : '']"></span>
      </div>
    </el-badge>
    <el-badge
      v-if="showComment"
      :value="articleInfo.commentCount"
      type="info"
      :hidden="!articleInfo.commentCount > 0"
    >
      <div
        class="comment item"
        @click="gotoPosition('comment')"
        v-if="showComment"
      >
        <span class="iconfont icon-comment"></span>
      </div>
    </el-badge>
    <div
      class="attachment item"
      @click="gotoPosition('attachment')"
      v-if="attachment"
    >
      <span class="iconfont icon-attachment"></span>
    </div>
  </div>
  <!-- 图片预览 -->
  <ImageViewer ref="imgViewerRef" :imageList="previewImgList"></ImageViewer>
</template>

<script setup>
import highlight from "highlight.js"; // 导入代码高亮文件
import "highlight.js/styles/atom-one-light.css"; // 导入代码高亮样式
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store/index.js";
import CommentList from "./CommentList.vue";
const route = useRoute();
const store = useStore();
const { proxy } = getCurrentInstance();
const api = {
  getArticleDetail: "/forum/getArticleDetail",
  doLike: "/forum/doLike",
  downloadAttachment: "/api/forum/attachmentDownload",
  getUserDownloadInfo: "/forum/getUserDownloadInfo",
};
// 监听当前登录用户
const currentUserInfo = ref({});
watch(
  () => store.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);
//获取文章详情
const articleInfo = ref({}); //文章信息
const attachment = ref({}); //附件
const haveLike = ref(false); //是否点赞
const getarticleDetail = async (articleId) => {
  const result = await proxy.Request({
    url: api.getArticleDetail,
    params: {
      articleId,
    },
  });
  if (!result) {
    return;
  }
  articleInfo.value = result.data.forumArticle;
  attachment.value = result.data.attachment;
  haveLike.value = result.data.haveLike;
  store.setActivePBoardId(result.data.forumArticle.pBoardId);
  store.setActiveBoardId(result.data.forumArticle.boardId);
  //图片预览
  getImgList();
  // 代码高亮
  highLightCode();
  // 获取目录
  getDir();
};
const articleId = ref();
onMounted(() => {
  articleId.value = route.params.articleId;
  getarticleDetail(articleId.value);
});
// 左边操作栏位置
const leftWidth = ref(
  (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 100
);
const listenResize = () => {
  leftWidth.value = (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 100;
};
onMounted(() => {
  // window.addEventListener('scroll',listenerScroll,false)
  window.addEventListener("resize", listenResize, false);
});
onUnmounted(() => {
  // window.removeEventListener('scroll',listenerScroll,false)
  window.removeEventListener("resize", listenResize, false);
});

const gotoPosition = (domId) => {
  document.querySelector("#" + domId).scrollIntoView();
};
// 处理点赞
const likeHandler = async () => {
  // 点赞要先登录
  if (!store.loginUserInfo) {
    store.showLogin = true;
    return;
  }
  const result = await proxy.Request({
    url: api.doLike,
    params: {
      articleId: articleId.value,
    },
  });
  if (!result) {
    return;
  }
  getarticleDetail(articleId.value);
};
// 更新评论数量
const updateCommentCount = (totalCount) => {
  articleInfo.value.commentCount = totalCount;
};

// 下载附件
const downloadAttachment = async (fileId) => {
  if (!currentUserInfo) {
    store.showLogin = true;
    return;
  }
  // 积分为0或者自己发布的
  if (
    attachment.value.integral == 0 ||
    currentUserInfo.userId == articleInfo.value.userId
  ) {
    gotoDownload(fileId);
    return;
  }
  // 获取用户积分
  const result = await proxy.Request({
    url: api.getUserDownloadInfo,
    params: {
      fileId: fileId,
    },
  });
  if (!result) {
    return;
  }
  //已经下载过 不用再扣积分
  if (result.data.haveDownload) {
    gotoDownload(fileId);
    return;
  }
  // 判断积分是否够下载
  if (result.data.userIntegral < attachment.value.integral) {
    proxy.Message.warning("你的积分不够，无法下载此附件");
    return;
  }
  proxy.Confirm(
    `你的积分为${result.data.userIntegral}，当前下载需要${attachment.value.integral}积分，确定下载吗？`,
    () => {
      gotoDownload(fileId);
    }
  );
};
const gotoDownload = (fileId) => {
  location.href = api.downloadAttachment + "?fileId=" + fileId;
  attachment.value.downloadCount = attachment.value.downloadCount + 1;
};

// 图片预览
const imgViewerRef = ref();
const previewImgList = ref([]);
const getImgList = () => {
  let imgList = [];
  let imgNodeList = [];
  // 等到数据全部加载完后
  nextTick(() => {
    imgNodeList = document.getElementById("content").querySelectorAll("img");
    imgNodeList.forEach((item, index) => {
      let src = item.getAttribute("src");
      imgList.push(src);
      // 拿到每张图片的src，每张图片添加点击事件，传过去一个index表示点击第几张图片
      item.addEventListener("click", () => {
        imgViewerRef.value.showViewer(index);
      });
    });
    previewImgList.value = imgList;
  });
};

// 代码高亮
const highLightCode = () => {
  nextTick(() => {
    let codeBlocks = document.querySelectorAll("pre code");
    codeBlocks.forEach((item) => {
      highlight.highlightElement(item);
    });
  });
};

// 获取目录
const dirArray = ref([]);
const getDir = () => {
  nextTick(() => {
    const Htags = ["H1", "H2", "H3", "H4", "H5", "H6"];
    const contentDom = document.querySelector("#content");
    const children = contentDom.childNodes;
    let index = 0;
    children.forEach((item) => {
      const tagName = item.tagName;
      if (tagName == undefined || !Htags.includes(tagName.toUpperCase())) {
        return;
      }
      let id = "tag" + index;
      item.setAttribute("id", id);
      dirArray.value.push({
        name: item.innerText,
        id: id,
        level: parseInt(tagName.substring(1)),
        offsetTop: item.offsetTop,
      });
      index++;
    });
  });
};
// 去往目录
const anchor = ref(null);
const gotoDir = (id) => {
  anchor.value = id;
  const dom = document.querySelector("#" + id);
  dom.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// 滚动条改变也会引起目录的改变
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};
const listenScroll = () => {
  const currentScroll = getScrollTop();
  dirArray.value.some((item, index) => {
    if (
      (index < dirArray.value.length - 1 &&
        currentScroll >= dirArray.value[index].offsetTop &&
        currentScroll < dirArray.value[index + 1].offsetTop) ||
      (index == dirArray.value.length - 1 &&
        currentScroll < dirArray.value[index].offsetTop)
    ) {
      anchor.value = item.id;
      return true;
    }
  });
};
onMounted(() => {
  window.addEventListener("scroll", listenScroll, false);
});
onUnmounted(() => {
  window.removeEventListener("scroll", listenScroll, false);
});

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
.detail-page {
  position: relative;
  .board-info {
    line-height: 35px;
    .icon-arrow-right {
      margin: 0 10px;
    }
  }
  .detail-container {
    .detail-content {
      background: #fff;
      padding: 15px;
      .article-title {
        font-weight: bolder;
      }
    }
    .user-info {
      display: flex;
      margin: 15px 0;
      padding-bottom: 10px;
      align-items: center;
      border-bottom: 1px solid #ddd;
      .avatar {
        cursor: pointer;
      }
      .user-info-detail {
        margin-left: 10px;
        .nickname {
          margin-bottom: 5px;
          a {
            color: #4a4a4a;
          }
          a:hover {
            color: #409eff;
          }
        }
        .time-address {
          font-size: 13px;
          color: #4a4a4a;
          text-align: center;
          .icon-edit {
            padding-left: 10px;
            font-size: 14px;
          }
        }
        .icon-eye {
          padding-left: 8px;
          color: #8b8b8b;
        }
      }
    }
    .content {
      width: 100%;
      :deep(p) {
        line-height: 25px;
      }
      :deep(img) {
        max-width: 80%;
        cursor: pointer;
      }
    }
    .attachment {
      margin-top: 20px;
      padding: 15px;
      background: #fff;
      .title {
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 10px;
      }
      .file-info {
        display: flex;
        align-items: center;
        .icon-file-zip {
          margin-right: 10px;
          font-size: 22px;
          color: #409eff;
        }
        .fileName {
          margin-right: 10px;
        }
        .fileSize {
          margin-right: 10px;
        }
        .integral {
          margin-right: 10px;
          span {
            color: rgb(241, 79, 79);
          }
        }
        .downloadCount {
          margin-right: 10px;
        }
      }
    }
    .comment {
      background: #fff;
      margin-top: 20px;
      padding: 20px;
    }
  }
  .dir-right {
    position: absolute;
    top: 40px;
    right: 0;
    width: 285px;
    .dir-content {
      position: fixed;
      width: 285px;
      background: #fff;
      .dir-title {
        padding: 10px;
        border-bottom: 1px solid #ddd;
      }
      .dir-list {
        padding: 5px;
        max-height: calc(100vh - 200px);
        overflow: auto;
        .dir-item {
          cursor: pointer;
          line-height: 30px;
          overflow: hidden;
          display: block;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #515151;
          border-radius: 4px;
          border-left: 2px solid #fff;
        }
        .dir-item:hover {
          background: #edebeb;
        }
        .active {
          border-left: 2px solid #409eff;
          background: #edebeb;
          border-radius: 0 4px 4px 0;
        }
        .no-dir {
          text-align: center;
          line-height: 40px;
          font-size: 14px;
        }
      }
    }
  }
}
.left-operate {
  position: fixed;
  width: 50px;
  top: 200px;
  text-align: center;
  :deep(.el-badge__content.is-fixed) {
    top: 5px;
    right: 15px;
  }
  .item {
    display: flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 25px;
    background: #fff;
    margin-bottom: 20px;
    cursor: pointer;
    span {
      color: #909399;
      font-size: 28px;
    }
    .like {
      color: #409eff;
    }
  }
}
</style>