<template>
  <div class="article-comment">
    <Dialog
      :show="dialog.show"
      :title="dialog.title"
      :buttons="dialog.buttons"
      width="500px"
      @close="dialog.show = false"
    >
      <div class="comment-list" v-if="commentList.length > 0">
        <div class="comment-item" v-for="item in commentList" :key="item">
          <div class="item-content">
            <Avatar :userId="item.userId" :width="40"></Avatar>
            <div class="content-info">
              <a
                :href="proxy.globalInfo.webDomain + 'user/' + item.userId"
                class="a-link"
                target="__blank"
                >{{ item.nickName }}</a
              >
              <div class="content" v-html="item.content"></div>
              <div class="content-img" v-if="item.imgPath">
                <CommentImage
                  :src="proxy.globalInfo.imageUrl + item.imgPath"
                  :imgList="[proxy.globalInfo.imageUrl + item.imgPath]"
                ></CommentImage>
              </div>
              <div class="post-info">
                发布：{{ item.postTime }}&nbsp;·&nbsp;{{
                  item.userIpAddress
                }}&nbsp;&nbsp;赞：{{ item.goodCount }}
              </div>
              <template v-if="item.children">
                <div
                  class="sub-comment-list"
                  v-for="sub in item.children"
                  :key="sub"
                >
                  <Avatar :userId="sub.userId" :width="40"></Avatar>
                  <div class="sub-content-info">
                    <a
                      :href="proxy.globalInfo.webDomain + 'user/' + sub.userId"
                      class="a-link"
                      target="__blank"
                      >{{ sub.nickName }}</a
                    >
                    <span v-if="sub.replyUserId">
                      回复
                      <a
                      :href="proxy.globalInfo.webDomain + 'user/' + sub.replyUserId"
                      class="a-link"
                      target="__blank"
                      >{{ sub.replyNickName }}</a
                    >
                    </span>
                    <div class="content" v-html="sub.content"></div>
                    <div class="content-img" v-if="sub.imgPath">
                      <CommentImage
                        :src="proxy.globalInfo.imageUrl + sub.imgPath"
                        :imgList="[proxy.globalInfo.imageUrl + item.imgPath]"
                      ></CommentImage>
                    </div>
                    <div class="post-info">
                      发布：{{ sub.postTime }}&nbsp;·&nbsp;{{
                        sub.userIpAddress
                      }}&nbsp;&nbsp;赞：{{ sub.goodCount }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-if="commentList.length == 0">暂无评论</div>
    </Dialog>
  </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadComment4Article: "/forum/loadComment4Article",
};

const dialog = reactive({
  show: false,
  title: "文章评论",
  buttons: [
    {
      type: "primary",
      text: "关闭",
      click: (e) => {
        dialog.show = false;
      },
    },
  ],
});

const commentList = ref([]);

const showArticleComment = async (articleId) => {
  dialog.show = true;
  const result = await proxy.Request({
    url: api.loadComment4Article,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  commentList.value = result.data;
};
defineExpose({ showArticleComment });
</script>

<style lang="scss" scoped>
.article-comment {
  .comment-list {
    .comment-item {
      border-bottom: 1px solid #ddd;
      margin: 10px 0;
      padding-bottom: 10px;
      .item-content {
        display: flex;
        .content-info {
          padding-left: 5px;
          .content {
            padding: 3px 0;
          }
          .post-info {
            font-size: 13px;
            color: rgb(138, 138, 138);
          }
          .sub-comment-list {
            display: flex;
            margin-top: 8px;
            .sub-content-info {
              padding-left: 5px;
            }
          }
        }
      }
    }
  }
}
</style>