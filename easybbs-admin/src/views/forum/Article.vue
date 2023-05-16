<template>
  <div class="article-body">
    <!-- 顶部搜索部分 -->
    <div class="top-panel">
      <el-form ref="searchFormRef" :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="标题" prop="titleFuzzy">
              <el-input
                v-model="searchFormData.titleFuzzy"
                clearable
                placeholder="请输入标题"
                @keyup.enter="loadDataList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="昵称" prop="nickNameFuzzy">
              <el-input
                v-model="searchFormData.nickNameFuzzy"
                clearable
                placeholder="请输入昵称"
                @keyup.enter="loadDataList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="板块" prop="boardIds">
              <el-cascader
                :options="boardList"
                clearable
                :props="boardProps"
                v-model="searchFormData.boardIds"
                :style="{ width: '100%' }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="附件" prop="attachmentType">
              <el-select v-model="searchFormData.attachmentType" placeholder="请选择" :style="{ width: '100%' }" clearable>
                <el-option label="无附件" :value="0"></el-option>
                <el-option label="有附件" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchFormData.status" placeholder="请选择" :style="{ width: '100%' }" clearable>
                <el-option label="已删除" :value="-1"></el-option>
                <el-option label="待审核" :value="0"></el-option>
                <el-option label="已审核" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="置顶" prop="topType">
              <el-select v-model="searchFormData.topType" placeholder="请选择" :style="{ width: '100%' }" clearable>
                <el-option label="未置顶" :value="0"></el-option>
                <el-option label="已置顶" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :style="{'padding-left':'10px'}">
           <el-button-group>
             <el-button type="primary" @click="loadDataList">搜索</el-button>
             <el-button type="success" :disabled="selectBatchList.length == 0" @click="auditBatch">批量审核</el-button>
             <el-button type="danger" :disabled="selectBatchList.length == 0" @click="delBatch">批量删除</el-button>
           </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 数据部分 -->
    <div class="data-list">
      <Table
        ref="tableRef"
        :dataSource="tableData"
        :options="tableOptions"
        :columns="columns"
        :fetch="loadDataList"
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
              <div class="ip">{{ row.userIpAddress }}</div>
            </div>
          </div>
        </template>
        <!-- 封面 -->
        <template #cover="{ index, row }">
          <Cover :coverUrl="row.cover"></Cover>
        </template>
        <!-- 标题 -->
        <template #titleInfo="{ index, row }">
          <a
            :href="`${proxy.globalInfo.webDomain}post/${row.articleId}`"
            class="a-link"
            target="_blank"
            >{{ row.title }}</a
          >
        </template>
        <!-- 板块 -->
        <template #boardInfo="{ index, row }">
          <div>
            <span>{{ row.pBoardName }}</span>
            <span v-if="row.boardName">/{{ row.boardName }}</span>
          </div>
        </template>
        <!-- 互动信息 -->
        <template #interactionInfo="{ index, row }">
          <div>阅读：{{ row.readCount }}</div>
          <div>点赞：{{ row.goodCount }}</div>
          <div>
            评论：<span>{{ row.commentCount }}</span>
            <span
              class="a-link"
              :style="{ 'margin-left': '5px' }"
              @click="showComment(row.articleId)"
              v-if="row.commentCount"
              >查看</span
            >
          </div>
        </template>
        <!-- 附件 -->
        <template #attachmentInfo="{ index, row }">
          <div v-if="row.attachmentType == 0">无附件</div>
          <div v-if="row.attachmentType == 1">
            <span
              @click="showAttachment(row.nickName, row.articleId)"
              class="a-link"
              >查看附件</span
            >
          </div>
        </template>
        <!-- 状态信息 -->
        <template #statusInfo="{ index, row }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
          <div v-if="row.topType == 1" :style="{ color: 'green' }">已置顶</div>
          <div v-if="row.topType == 0" :style="{ color: 'green' }">未置顶</div>
        </template>
        <!-- 操作 -->
        <template #op="{ index, row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"> </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateBoard(row)"
                    >修改板块</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 1 && row.status == 1"
                    >取消置顶</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 0 && row.status == 1"
                    >置顶</el-dropdown-item
                  >
                  <el-dropdown-item @click="delArticle(row)"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item @click="audit(row)" v-if="row.status == 0"
                    >审核</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
    <!-- 修改板块 -->
    <ArticleBoard ref="articleBoardRef" @reload="loadDataList"></ArticleBoard>
    <!-- 查看附件 -->
    <ArticleAttachment ref="articleAttachmentRef"></ArticleAttachment>
    <!-- 查看评论 -->
    <ArticleComment ref="articleCommentRef"></ArticleComment>
  </div>
</template>

<script setup>
import ArticleBoard from './ArticleBoard.vue'
import ArticleAttachment from './ArticleAttachment.vue'
import ArticleComment from './ArticleComment.vue'
import { getCurrentInstance, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadDataList: "/forum/loadArticle",
  loadBoard: "/board/loadBoard",
  auditArticle: "/forum/auditArticle",
  delArticle: "/forum/delArticle",
  topArticle:"/forum/topArticle",
};

// 搜索
const searchFormData = ref({});
const searchFormRef = ref();

// 板块
const boardList=ref([])
const boardProps={
  label: "boardName",
  value: "boardId",
  checkStrictly: true
}

const loadBoard=async()=>{
  const result=await proxy.Request({
    url: api.loadBoard
  })
  if(!result) {
    return;
  }
  boardList.value=result.data
}
loadBoard()

// 传递给table的一些属性和方法
const tableData = ref({});
const tableRef=ref();
const columns = [
  {
    label: "用户信息",
    prop: "avatar",
    width: 180,
    scopedSlots: "userInfo",
  },
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "标题",
    scopedSlots: "titleInfo",
  },
  {
    label: "板块",
    width: 180,
    scopedSlots: "boardInfo",
  },
  {
    label: "互动信息",
    width: 150,
    scopedSlots: "interactionInfo",
  },
  {
    label: "是否有附件",
    prop: "attachment",
    width: 100,
    scopedSlots: "attachmentInfo",
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
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
const tableOptions = ref({
  selectType: "checkbox",
  extHeight: 100,
});

// 获取数据
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  // 要搜索的参数
  params=Object.assign(params,searchFormData.value)
  if(params.boardIds&&params.boardIds.length==1) {
    params.pBoardId=params.boardIds[0]
  }else if(params.boardIds&&params.boardIds.length==2) {
    params.pBoardId=params.boardIds[0]
    params.boardId=params.boardIds[1]
  }
  delete params.boardIds
  const result = await proxy.Request({
    url: api.loadDataList,
    params: params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};


// 批量操作
const selectBatchList=ref([])
//选中的行
const setRowSelect = (rows) => {
  selectBatchList.value=[]
  rows.forEach(element => {
    selectBatchList.value.push(element.articleId
)
  });
};
// 点击行
const rowClick = (row) => {};
// 批量审核
const auditBatch=()=>{
  proxy.Confirm('确定审核选中文章吗？',async()=>{
    // 参数以逗号分隔
    let params=selectBatchList.value.join(',')
    const result=await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: params
      }
    })
    if(!result) {
      return;
    }
    tableRef.value.clearSelection()
    loadDataList()
  })
}
// 批量删除
const delBatch=()=>{
  proxy.Confirm('确定删除选中文章吗？',async()=>{
    // 参数以逗号分隔
    let params=selectBatchList.value.join(',')
    const result=await proxy.Request({
      url: api.delArticle,
      params: {
        articleIds: params
      }
    })
    if(!result) {
      return;
    }
    tableRef.value.clearSelection()
    loadDataList()
  })
}

// 一些操作
// 修改板块
const articleBoardRef=ref()
const updateBoard = (row) => {
  articleBoardRef.value.updateBoard(row);
};
// 置顶操作
const topArticle = (row) => {
  let type=row.topType==0?'置顶':'取消置顶'
  proxy.Confirm(`确定将【${row.title}】${type}吗？`,async()=>{
    const result=await proxy.Request({
      url: api.topArticle,
      params: {
        articleId: row.articleId,
        topType: row.topType==0?1:0
      }
    })
    if(!result) {
      return;
    }
    loadDataList()
  })
};
// 删除文章
const delArticle = (row) => {
  proxy.Confirm(`确定删除【${row.title}】吗？`,async()=>{
    const result=await proxy.Request({
      url: api.delArticle,
      params: {
        articleIds: row.articleId
      }
    })
    if(!result) {
      return;
    }
    loadDataList()
  })
};
// 审核文章
const audit = (row) => {
  proxy.Confirm(`确定审核【${row.title}】吗？`,async()=>{
    const result=await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: row.articleId
      }
    })
    if(!result) {
      return;
    }
    loadDataList()
  })
};

// 查看附件
const articleAttachmentRef=ref()
const showAttachment=(nickName,articleId)=>{
  articleAttachmentRef.value.showArticleAttachment(nickName,articleId)
}

// 查看文章评论
const articleCommentRef=ref()
const showComment=(articleId)=>{
  articleCommentRef.value.showArticleComment(articleId)
}
</script>

<style lang="scss" scoped>
.article-body {
  .data-list {
    .user-info {
      display: flex;
      align-items: center;
      .user-name {
        padding-left: 5px;
        font-size: 13px;
      }
    }
    .op {
      .iconfont {
        cursor: pointer;
      }
    }
  }
}
</style>