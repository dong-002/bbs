<template>
  <div
    class="container-body article-content"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="sub-board" v-if="pBoardId">
      <span :class="['sub-tab', boardId==0?'active':'']">
        <router-link :to="'/forum/' + pBoardId">全部</router-link></span
      >
      <span v-for="item in subBoardList" :key="item" :class="['sub-tab',item.boardId==boardId?'active':'']">
        <router-link :to="'/forum/' + item.pBoardId + '/' + item.boardId">{{
          item.boardName
        }}</router-link></span
      >
    </div>
    <div class="article-panel">
      <div class="top-panel">
        <div
          :class="['tab', orderType == 0 ? 'active' : '']"
          @click="changeOrderType(0)"
        >
          热门
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          :class="['tab', orderType == 1 ? 'active' : '']"
          @click="changeOrderType(1)"
        >
          发布时间
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          :class="['tab', orderType == 2 ? 'active' : '']"
          @click="changeOrderType(2)"
        >
          最新
        </div>
      </div>
      <div class="article-list">
        <DataList
          :dataSource="articleList"
          :loading="loading"
          @loadData="loadArticle"
        >
          <!-- 插槽作用域 DataList中传过来的data 使用解构，如果是#default="defaultProps"在下面ArticleListItem就要使用 :item="defaultProps.data" -->
          <template #default="{ data }">
            <ArticleListItem :item="data" :showComment="showComment"></ArticleListItem>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArticleListItem from "./ArticleListItem.vue";
import { getCurrentInstance, nextTick, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store/index.js";
const store = useStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const api = {
  loadArticle: "/forum/loadArticle",
};

//文章列表
const orderType = ref(0); //热门
const pBoardId = ref(0); //一级板块
const boardId = ref(0); //二级板块
const changeOrderType = (type) => {
  orderType.value = type;
  loadArticle();
};
const articleList = ref({});
const loading = ref(false); //请求时显示骨架屏
const loadArticle = async () => {
  let params = {
    pageNo: articleList.value.pageNo,
    orderType: orderType.value,
    boardId: boardId.value,
    pBoardId: pBoardId.value,
  };
  loading.value = true;
  const result = await proxy.Request({
    url: api.loadArticle,
    params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleList.value = result.data;
};

// 二级板块
const subBoardList = ref([]);
const setSubBoardList = () => {
  subBoardList.value = store.getSubBoardList(pBoardId.value);
};
// 监听切换板块
watch(
  () => route.params,
  (newVal, oldVal) => {
    pBoardId.value = newVal.pBoardId;
    boardId.value = newVal.boardId||0;
    store.setActivePBoardId(newVal.pBoardId)
    store.setActiveBoardId(newVal.boardId)
    setSubBoardList();
    loadArticle();
  },
  { immediate: true, deep: true }
);
// 监听是否请求到板块信息 上面是切换一级板块会出现二级板块，但是刷新页面没有出现二级板块
watch(
  () => store.boardList,
  (newVal, oldVal) => {
    setSubBoardList();
  },
  { immediate: true, deep: true }
);

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
.article-content {
  .sub-board {
    display: flex;
    align-items: center;
    margin: 8px 0;
    .sub-tab {
      margin-right: 10px;
      background: #fff;
      padding: 2px 10px;
      border-radius: 13px;
      cursor: pointer;
      font-size: 14px;
      a {
        color: #646464;
      }
    }
    .active {
      background-color: #409eff;
      a {
        color: #fff;
      }
    }
  }
  .article-panel {
    background: #fff;
    .top-panel {
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 15px;
      border-bottom: 1px solid #ddd;
      .tab {
        cursor: pointer;
      }
      .active {
        color: #409eff;
      }
    }
  }
}
</style>