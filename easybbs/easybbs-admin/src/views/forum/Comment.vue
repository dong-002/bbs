<template>
  <div class="comment-body">
    <div class="top-panel">
      <el-form ref="searchFormRef" :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="内容" prop="contentFuzzy">
              <el-input
                v-model="searchFormData.contentFuzzy"
                clearable
                placeholder="请输入搜索内容"
                @keyup.enter="loadComment"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="昵称" prop="nickNameFuzzy">
              <el-input
                v-model="searchFormData.nickNameFuzzy"
                clearable
                placeholder="请输入昵称"
                @keyup.enter="loadComment"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="searchFormData.status"
                placeholder="请选择"
                :style="{ width: '100%' }"
                clearable
              >
                <el-option label="已删除" :value="-1"></el-option>
                <el-option label="待审核" :value="0"></el-option>
                <el-option label="已审核" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :style="{ 'padding-left': '10px' }">
            <el-button-group>
              <el-button type="primary" @click="loadComment">搜索</el-button>
              <el-button
                type="success"
                :disabled="selectBatchList.length == 0"
                @click="auditBatch"
                >批量审核</el-button
              >
              <el-button
                type="danger"
                :disabled="selectBatchList.length == 0"
                @click="delBatch"
                >批量删除</el-button
              >
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-list">
      <Table
        ref="tableRef"
        :dataSource="tableData"
        :options="tableOptions"
        :columns="columns"
        :fetch="loadComment"
        @rowSelect="setRowSelect"
        @rowClick="rowClick"
      >
        <!-- 用户信息插槽 -->
        <template #userInfo="{ index, row }">
          <div class="user-info">
            <Avatar :userId="row.userId" :width="50"></Avatar>
            <div class="user-name">
              <div class="nickname">
                <a
                  :href="`${proxy.globalInfo.webDomain}user/${row.userId}`"
                  class="a-link"
                  target="__blank"
                  >{{ row.nickName }}</a
                >
              </div>
            </div>
          </div>
        </template>
        <!-- 评论内容 -->
        <template #commentInfo="{ index, row }">
          <span
            ><a
              :href="proxy.globalInfo.webDomain + 'post/' + row.articleId"
              class="a-link"
              target="__blank"
              >查看文章</a
            ></span
          >
          <div class="content" v-html="row.content"></div>
          <div v-if="row.imgPath">
            <CommentImage
              :src="proxy.globalInfo.imageUrl + row.imgPath"
              :preview="false"
            ></CommentImage>
          </div>
        </template>

        <!-- 状态信息 -->
        <template #statusInfo="{ index, row }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
        </template>
        <!-- 操作 -->
        <template #op="{ index, row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"> </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="delComment(row)"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="auditComment(row)"
                    v-if="row.status == 0"
                    >审核</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadComment: "/forum/loadComment",
  delComment: "/forum/delComment",
  auditComment: "/forum/auditComment",
};

const searchFormRef = ref();
const searchFormData = ref({});

// 传递给table的一些属性和方法
const tableData = ref({});
const tableRef = ref();
const columns = [
  {
    label: "用户信息",
    prop: "avatar",
    width: 180,
    scopedSlots: "userInfo",
  },
  {
    label: "评论内容",
    prop: "content",
    scopedSlots: "commentInfo",
  },
  {
    label: "点赞",
    prop: "goodCount",
    width: 150,
  },
  {
    label: "状态信息",
    prop: "status",
    width: 100,
    scopedSlots: "statusInfo",
  },
  {
    label: "发布时间",
    prop: "postTime",
    width: 180,
  },
  {
    label: "发布地址",
    prop: "userIpAddress",
    width: 100,
  },
  {
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
const tableOptions = ref({
  selectType: "checkbox",
  extHeight: 50,
});

const loadComment = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  // 要搜索的参数
  params = Object.assign(params, searchFormData.value);
  const result = await proxy.Request({
    url: api.loadComment,
    params: params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};

// 批量操作
const selectBatchList = ref([]);
// 选中多个
const setRowSelect = (rows) => {
  selectBatchList.value = [];
  rows.forEach((element) => {
    selectBatchList.value.push(element.commentId);
  });
};
// 行点击
const rowClick = (row) => {};
// 批量审核
const auditBatch = () => {
  proxy.Confirm("确定审核选中评论吗？", async () => {
    // 参数以逗号分隔
    let params = selectBatchList.value.join(",");
    const result = await proxy.Request({
      url: api.auditComment,
      params: {
        commentIds: params,
      },
    });
    if (!result) {
      return;
    }
    tableRef.value.clearSelection();
    loadComment();
  });
};
// 批量删除
const delBatch = () => {
  proxy.Confirm("确定审核选中评论吗？", async () => {
    // 参数以逗号分隔
    let params = selectBatchList.value.join(",");
    const result = await proxy.Request({
      url: api.delComment,
      params: {
        commentIds: params,
      },
    });
    if (!result) {
      return;
    }
    tableRef.value.clearSelection();
    loadComment();
  });
};
// 操作中的删除
const delComment = (row) => {
  proxy.Confirm("确定删除这条评论吗？", async () => {
    const result = await proxy.Request({
      url: api.delComment,
      params: {
        commentIds: row.commentId,
      },
    });
    if (!result) {
      return;
    }
    loadComment();
  });
};
// 操作中的审核
const auditComment = (row) => {
  proxy.Confirm("确定审核这条评论吗？", async () => {
    const result = await proxy.Request({
      url: api.auditComment,
      params: {
        commentIds: row.commentId,
      },
    });
    if (!result) {
      return;
    }
    loadComment();
  });
};
</script>

<style lang="scss" scoped>
.data-list {
  .user-info {
    display: flex;
    align-items: center;
    .user-name {
      padding-left: 8px;
    }
  }
  .op {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>