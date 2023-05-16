<template>
  <div class="board-body">
    <el-button type="primary" @click="showEdit('add', 0)">新增板块</el-button>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <!-- 一级板块 -->
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>一级板块</span>
            </div>
          </template>
          <Table
            :dataSource="tableData"
            :columns="columns"
            :options="tableOptions"
            :fetch="loadBoardList"
            :showPagination="false"
            ref="tableRef"
            @rowClick="rowClick"
          >
            <!-- 封面 -->
            <template #cover="{ index, row }">
              <Cover :coverUrl="row.cover"></Cover>
            </template>
            <!-- 板块信息 -->
            <template #boardInfo="{ index, row }">
              <div>板块名称：{{ row.boardName }}</div>
              <div>
                发帖权限：{{ row.postType == 0 ? "管理员发帖" : "任何人发帖" }}
              </div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <a
                href="javaScript:void(0);"
                class="a-link"
                @click="showEdit('update', 0, row)"
                >修改</a
              >
              <el-divider direction="vertical" />
              <a href="javaScript:void(0);" class="a-link" @click="del(row)"
                >删除</a
              >
              <el-divider direction="vertical" />
              <a
                href="javaScript:void(0);"
                :class="[index == 0 ? 'no-arrow' : 'a-link']"
                @click="changeSort(index, 'up', 0)"
                >上移</a
              >
              <el-divider direction="vertical" />
              <a
                href="javaScript:void(0);"
                :class="[
                  index == tableData.list.length - 1 ? 'no-arrow' : 'a-link',
                ]"
                @click="changeSort(index, 'down', 0)"
                >下移</a
              >
            </template>
          </Table>
        </el-card>
      </el-col>
      <!-- 二级板块 -->
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div
              class="card-header"
              :style="{ display: 'flex', 'justify-content': 'space-between' }"
            >
              <span>二级板块</span>
              <span
                ><a
                  href="javaScript:void(0);"
                  class="a-link"
                  @click="showEdit('add', 1)"
                  >新增二级板块</a
                ></span
              >
            </div>
          </template>
          <Table
            :dataSource="subTableData"
            :columns="columns"
            :options="tableOptions"
            :showPagination="false"
          >
            <!-- 封面 -->
            <template #cover="{ index, row }">
              <Cover :coverUrl="row.cover"></Cover>
            </template>
            <!-- 板块信息 -->
            <template #boardInfo="{ index, row }">
              <div>板块名称：{{ row.boardName }}</div>
              <div>
                发帖权限：{{ row.postType == 0 ? "管理员发帖" : "任何人发帖" }}
              </div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <a
                href="javaScript:void(0);"
                class="a-link"
                @click="showEdit('update', 1, row)"
                >修改</a
              >
              <el-divider direction="vertical" />
              <a href="javaScript:void(0);" class="a-link" @click="del(row)"
                >删除</a
              >
              <el-divider direction="vertical" />
              <a
                href="javaScript:void(0);"
                :class="[index == 0 ? 'no-arrow' : 'a-link']"
                @click="changeSort(index, 'up', 1)"
                >上移</a
              >
              <el-divider direction="vertical" />
              <a
                href="javaScript:void(0);"
                :class="[
                  index == subTableData.list.length - 1 ? 'no-arrow' : 'a-link',
                ]"
                @click="changeSort(index, 'down', 1)"
                >下移</a
              >
            </template>
          </Table>
        </el-card>
      </el-col>
    </el-row>
    <BoardEdit ref="boardEditRef" @reload="loadBoardList"></BoardEdit>
  </div>
</template>

<script setup>
import BoardEdit from "./BoardEdit.vue";
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadBoard: "/board/loadBoard",
  saveBoard: "/board/saveBoard",
  delBoard: "/board/delBoard",
  changeBoardSort: "/board/changeBoardSort",
};

// 传递给table的一些属性和方法
const tableData = ref({});
const subTableData = ref({});
const tableRef = ref();
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    prop: "boardName",
    label: "板块信息",
    width: 170,
    scopedSlots: "boardInfo",
  },
  {
    label: "简介",
    prop: "boardDesc",
  },
  {
    label: "操作",
    prop: "op",
    width: 190,
    scopedSlots: "op",
  },
];
const tableOptions = ref({
  extHeight: 110,
});

// 当前一级板块
const activeBoard = ref(null);
// 获取板块
const loadBoardList = async () => {
  const result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  tableData.value.list = result.data;
  // 初始化选中第一个板块
  if (activeBoard.value == null && tableData.value.list.length > 0) {
    activeBoard.value = tableData.value.list[0];
  }
  // 找到与一级板块对应的二级板块
  tableData.value.list.forEach((element) => {
    if (element.boardId == activeBoard.value.boardId) {
      subTableData.value.list = element.children;
      return true;
    }
  });
  // table中的一个行选中效果
  tableRef.value.setCurrentRow("boardId", activeBoard.value.boardId);
};
// 选中当前一级板块，出现对应的二级板块
const rowClick = (row) => {
  activeBoard.value = row;
  subTableData.value.list = row.children;
};

const boardEditRef = ref();
// 新增板块或者修改板块
const showEdit = (type, isChild, row) => {
  boardEditRef.value.editBoard(type, isChild, row, activeBoard.value);
};
// 删除板块
const del = (row) => {
  proxy.Confirm(`确定删除【${row.boardName}】吗？`, async () => {
    const result = await proxy.Request({
      url: api.delBoard,
      params: {
        boardId: row.boardId,
      },
    });
    if (!result) {
      return;
    }
    // 删除当前选中的，清除选中
    if (row.boardId == activeBoard.value.boardId) {
      activeBoard.value = null;
    }
    loadBoardList();
  });
};

// 板块上移下移
const changeSort = async (index, type, isChild) => {
  let dataList = tableData.value.list;
  if (isChild == 1) {
    dataList = subTableData.value.list;
  }
  // 第一个不能上移，最后一个不能下移
  if (
    (index == 0 && type == "up") ||
    (index == dataList.length - 1 && type == "down")
  ) {
    return;
  }
  let temp = dataList[index]; //缓存当前
  let num = type == "down" ? 1 : -1; //是上移还是下移
  dataList.splice(index, 1); //把这个删除
  dataList.splice(index + num, 0, temp); //在新的位置插入

  let boardIdList = [];
  dataList.forEach((item) => {
    boardIdList.push(item.boardId);
  });
  const result = await proxy.Request({
    url: api.changeBoardSort,
    params: { boardIds: boardIdList.join(",") },
  });
  if (!result) {
    return;
  }
  proxy.Message.success("排序成功！");
  loadBoardList();
};
</script>

<style lang="scss" scoped>
.board-body {
  .box-card {
    .no-arrow {
      cursor: not-allowed;
      color: #ddd;
      text-decoration: none;
    }
  }
}
</style>