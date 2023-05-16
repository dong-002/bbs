<template>
  <div class="comment-panel">
    <div class="post-panel">
      <Avatar :userId="userId" :width="avatarWidth"></Avatar>
      <div class="comment-form">
        <el-form :model="formData" ref="formDataRef" :rules="rules">
          <el-form-item prop="content">
            <el-input
              v-model="formData.content"
              type="textarea"
              show-word-limit
              resize="none"
              maxlength="800"
              :placeholder="placeholderInfo"
              class="content"
            />
            <div class="insert-img" v-if="showInsertImg">
              <div class="pre-img" v-if="commentImg">
                <CommentImage :src="commentImg"></CommentImage>
                <span
                  class="iconfont icon-remove1"
                  @click="removeCommentImg"
                ></span>
              </div>
              <el-upload
                v-else
                list-type="picture"
                accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
                :show-file-list="false"
                :multiple="false"
                :http-request="selectImg"
              >
                <span class="iconfont icon-image"></span>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-button
        class="send-btn"
        size="large"
        type="primary"
        @click="submitComment"
        >发布</el-button
      >
    </div>
  </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  postComment: "/comment/postComment",
};
const props = defineProps({
  articleId: {
    type: String,
  },
  pCommentId: {
    type: Number,
  },
  replyUserId: {
    type: String,
  },
  avatarWidth: {
    type: Number,
  },
  userId: {
    type: String,
  },
  placeholderInfo: {
    type: String,
    default: "赶紧来评论吧！",
  },
  showInsertImg: {
    type: Boolean,
  },
});
// form表单
const formData = ref({});
const formDataRef = ref();
const checkPostComment = (rule, value, callback) => {
  if (value == null && formData.value.image == null) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const rules = reactive({
  content: [
    {
      required: true,
      message: "请输入评论内容",
      trigger: "blur",
      validator: checkPostComment,
    },
    { min: 5, message: "至少评论5个字",trigger: "blur" },
  ],
});

// 发表评论
const emit = defineEmits(["postCommentFinish"]);
const submitComment = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formData.value);
    params.articleId = props.articleId;
    params.pCommentId = props.pCommentId;
    params.replyUserId = props.replyUserId;
    const result = await proxy.Request({
      url: api.postComment,
      params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("评论发表成功");
    formDataRef.value.resetFields();
    removeCommentImg()
    // 要在一级评论添加新增的评论
    emit("postCommentFinish", result.data);
  });
};
// 选择图片上传
const commentImg = ref(null);
const selectImg = (file) => {
  file = file.file;
  let img = new FileReader();
  img.readAsDataURL(file); //读取文件 以data:url形式返回
  img.onload = ({ target }) => {
    let imgData = target.result; //读取后的结果
    commentImg.value = imgData;
    formData.value.image = file;
  };
};
const removeCommentImg = () => {
  commentImg.value = null;
  formData.value.image = null;
};
</script>

<style lang="scss" scoped>
.comment-panel {
  .post-panel {
    display: flex;
    align-items: top;
    .comment-form {
      margin: 0 10px;
      flex: 1;
      :deep(.el-textarea__inner) {
        height: 60px;
      }
      .insert-img {
        line-height: normal;
        span {
          font-size: 24px;
        }
        .pre-img {
          margin-top: 10px;
          position: relative;
          .iconfont {
            position: absolute;
            top: -10px;
            right: -10px;
            color: rgb(115, 115, 115);
            cursor: pointer;
            font-size: 18px;
          }
        }
      }
    }
    .send-btn {
      height: 60px;
    }
  }
}
</style>