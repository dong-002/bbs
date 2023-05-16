<template>
  <div
    class="container-body search-container"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div
      class="search-input"
      :style="{ 'padding-top': startSearch ? '0px' : searchInputheight+'px' }"
    >
      <el-form
        :model="formData"
        ref="formDataRef"
        :rules="rules"
        @submit.prevent
      >
        <el-form-item prop="keyword">
          <el-input
            size="large"
            clearable
            v-model="formData.keyword"
            placeholder="请输入搜索关键词"
            @keyup.enter="search"
            @focus="startSearchHandler"
          >
            <template #suffix>
              <span
                class="iconfont icon-search"
                @click="search"
                @blur="formData.keyword = $event.target.value.trim()"
              ></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索的文章 -->
    <div class="article-list">
      <DataList :dataSource="articleList" :loading="loading" @loadData="search">
        <!-- 插槽作用域 DataList中传过来的data 使用解构 不然用item.data -->
        <template #default="{ data }">
          <ArticleListItem
            :item="data"
            :showComment="showComment"
            :htmlTitle="true"
          ></ArticleListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import { getCurrentInstance, reactive, ref, watch } from "vue";
import { useStore } from "@/store/index.js";
const store = useStore();
const { proxy } = getCurrentInstance();
const api = {
  loadArticle: "/forum/search",
};

const searchInputheight=ref((window.innerHeight-60-140-100)/2)
const startSearch = ref(false);
const startSearchHandler = () => {
  startSearch.value = true;
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  keyword: [
    { required: true, message: "请输入搜索关键词", trigger: "blur" },
    { min: 3, message: "至少输入3个字", trigger: "blur" },
  ],
};
const articleList = ref({});
const loading = ref(false); //请求时显示骨架屏
const search = () => {
  formDataRef.value.validate(async (valid) => {
    if(!valid) {
      return
    }
    let params = {
      pageNo: articleList.value.pageNo,
      keyword: formData.value.keyword,
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
    let list = result.data.list;
    list.forEach((element) => {
      element.title = element.title.replace(
        params.keyword,
        "<span style='color: red'>" + params.keyword + "</span>"
      );
    });
    articleList.value = result.data;
  });
};
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
.search-container {
  background: #fff;
  padding: 10px;
  min-height: calc(100vh - 210px);
  .search-input {
    display: flex;
    justify-content: center;
    .el-input {
      width: 700px;
    }
  }
}
</style>