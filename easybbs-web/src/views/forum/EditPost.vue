<template>
  <div class="edit-post">
    <el-form
      :model="formData"
      ref="formDataRef"
      :rules="rules"
      label-width="60px"
      class="post-panel"
    >
      <div class="post-editor">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <div class="header">
              <span>正文</span>
              <div class="editor-type" @click="changeEditorType">
                <span class="iconfont icon-change"></span>
                <span>{{
                  editorType == 0
                    ? "切换为markdown编辑器"
                    : "切换为富文本编辑器"
                }}</span>
              </div>
            </div>
          </template>
          <el-form-item prop="content" label-width="0px">
            <EditorMarkdown
              :height="markdownHeight"
              v-if="editorType == 1"
              v-model="formData.markdownContent"
              @htmlContent="setHtmlContent"
            ></EditorMarkdown>
            <EditorHtml
              :height="htmlEditorHeight"
              v-if="editorType == 0"
              v-model="formData.content"
            ></EditorHtml>
          </el-form-item>
        </el-card>
      </div>
      <div class="post-setting">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <span>设置</span>
          </template>
          <div class="setting-inner">
            <el-form-item label="标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入标题" maxlength="60"/>
            </el-form-item>
            <el-form-item label="板块" prop="boardIds">
              <el-cascader
                v-model="formData.boardIds"
                placeholder="请选择板块"
                :options="boardList"
                :props="boardProps"
              />
            </el-form-item>
            <el-form-item label="封面" prop="cover">
              <CoverUpLoad v-model="formData.cover"></CoverUpLoad>
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <el-input
                v-model="formData.summary"
                type="textarea"
                resize="none"
                show-word-limit
                maxlength="150"
              />
            </el-form-item>
            <el-form-item label="附件" prop="attachment">
              <AttachmentUpload
                v-model="formData.attachment"
              ></AttachmentUpload>
            </el-form-item>
            <el-form-item v-if="formData.attachment" label="积分" prop="integral">
              <el-input v-model="formData.integral"></el-input>
              <div class="tips">请输入下载附件积分，0表示无需积分</div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :style="{ width: '100%' }"
                @click="postArticle"
                >保存</el-button
              >
            </el-form-item>
          </div>
        </el-card>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {ElMessageBox} from "element-plus"
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const api = {
  loadBoard: "/forum/loadBoard4Post",
  articleDetail4Update: "/forum/articleDetail4Update",
  newPost: "/forum/postArticle",
  updateArticle: "/forum/updateArticle",
};
// 编辑器高度
const markdownHeight = window.innerHeight - 60 - 80;
const htmlEditorHeight = window.innerHeight - 60 - 160;
// 编辑器类型 0富文本 1Markdown
const editorType = ref(null);
const changeEditorType = () => {
  proxy.Confirm("切换编辑器会清空内容，确定切换吗？", () => {
    editorType.value = editorType.value == 0 ? 1 : 0;
    formData.value.content = "";
    formData.value.markdownContent = "";
    proxy.VueCookies.set("editorType", editorType.value, -1);
  });
};

//markdown编辑器中的内容同步到富文本，提交要提交两个版本的内容
const setHtmlContent = (htmlContent) => {
  formData.value.content = htmlContent;
};

// 板块信息
const boardList = ref([]);
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "boardId",
  label: "boardName",
};
const loadBoardList = async () => {
  const result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
};
loadBoardList();

// 新增还是修改文章
const articleId = ref();
const getArticleDetail = () => {
  nextTick(async () => {
    formDataRef.value.resetFields();
    if (articleId.value) {
      // 修改
      const result = await proxy.Request({
        url: api.articleDetail4Update,
        params: {
          articleId: articleId.value,
        },
        showError: false,
        errorCallback: (response) => {
          ElMessageBox.alert(response.info, "Tips", {
            showClose: false,
            callback: (action) => {
              router.go(-1);
            },
          });
        },
      });
      if (!result) {
        return;
      }
      //把之前的文章内容填上
      let articleInfo = result.data.forumArticle;
      editorType.value = articleInfo.editorType;
      // 板块
      articleInfo.boardIds = [];
      articleInfo.boardIds.push(articleInfo.pBoardId);
      if (articleInfo.boardId != null && articleInfo.boardId != 0) {
        articleInfo.boardIds.push(articleInfo.boardId);
      }
      // 封面
      if (articleInfo.cover) {
        articleInfo.cover = { imageUrl: articleInfo.cover }; //这里是在coverUpload中的显示图片
      }
      // 附件
      if (result.data.attachment) {
        articleInfo.attachment = {
          name: result.data.attachment.fileName,
        };
        articleInfo.integral = result.data.attachment.integral;
      }
      formData.value = articleInfo;
    } else {
      // 新增
      formData.value = {};
      editorType.value = proxy.VueCookies.get("editorType") || 1;
    }
  });
};
// 监听路由，看是新增还是修改文章
watch(
  () => route,
  (newVal, oldVal) => {
    // 只有在新增或者修改的路由中才调用getArticleDetail这个方法，其他路由不调用
    if (
      newVal.path.indexOf("/editPost") != -1 ||
      newVal.path.indexOf("/newPost") != -1
    ) {
      articleId.value = newVal.params.articleId;
      getArticleDetail();
    }
  },
  { immediate: true, deep: true }
);

// 提交文章信息
const rules = reactive({
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
  ],
  boardIds: [
    {required: true,message: "请选择板块"}
  ],
  content: [
    {required: true,message: "正文不能为空"}
  ],
  integral: [
    {required: true,message: "请输入积分"},
    {validator: proxy.verify.number,message:"积分只能为数字"}
  ]
});
const postArticle = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    params.editorType = editorType.value;
    // 设置板块ID
    if (params.boardIds.length == 1) {
      params.pBoardId = params.boardIds[0];
    } else if (params.boardIds.length == 2) {
      params.pBoardId = params.boardIds[0];
      params.boardId = params.boardIds[1];
    }
    delete params.boardIds;
    // 附件
    if (params.attachment != null) {
      params.attachmentType = 1;
    } else {
      params.attachmentType = 0;
    }
    // 内容 空内容也会有一些标签
    let contentText = params.content.replace(/<(?!img).*?>/g, "");
    if (contentText == "") {
      proxy.Message.warning("正文不能为空！");
      return;
    }
    // 封面,如果不是文件类型（是一个proxy）说明没有重新上传图片，不需要传，传不是file类型后台会报错
    if (!(params.cover instanceof File)) {
      delete params.cover;
    }
    // 附件，和封面一样的原理，是file类型说明重新上传了附件
    if (!(params.attachment instanceof File)) {
      delete params.attachment;
    }

    const newOrUpdate = params.articleId ? api.updateArticle : api.newPost; //是新增还是修改
    const result = await proxy.Request({
      url: newOrUpdate,
      params: params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("保存成功！");
    router.push(`/post/${result.data}`);
  });
};
</script>

<style lang="scss" scoped>
.edit-post {
  .post-panel {
    display: flex;
    :deep(.el-card__header) {
      padding: 10px;
    }
    .post-editor {
      flex: 1;
      margin-right: 10px;
      .header {
        display: flex;
        justify-content: space-between;
        .editor-type {
          font-size: 14px;
          color: var(--link);
          cursor: pointer;
          .iconfont {
            font-size: 18px;
          }
        }
      }
    }
    .post-setting {
      width: 450px;
      .setting-inner {
        max-height: calc(100vh - 120px);
        overflow: auto;
        .tips {
          color: rgb(145, 145, 145);
          font-size: 13px;
        }
      }
    }
  }
}
</style>