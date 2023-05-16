<template>
  <div class="user-body">
    <div class="top-panel">
      <el-form ref="searchFormRef" :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="昵称" prop="nickNameFuzzy">
              <el-input
                v-model="searchFormData.nickNameFuzzy"
                clearable
                placeholder="请输入昵称"
                @keyup.enter="loadUserList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="searchFormData.status"
                placeholder="请选择状态"
                :style="{ width: '100%' }"
                clearable
              >
                <el-option label="已禁用" :value="0"></el-option>
                <el-option label="已启用" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="性别" prop="sex">
              <el-select
                v-model="searchFormData.sex"
                placeholder="请选择性别"
                :style="{ width: '100%' }"
                clearable
              >
                <el-option label="女" :value="0"></el-option>
                <el-option label="男" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="loadUserList">搜索</el-button>
            </el-form-item>
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
        :fetch="loadUserList"
        @rowSelect="setRowSelect"
        @rowClick="rowClick"
      >
        <!-- 头像 -->
        <template #avatar="{ index, row }">
          <Avatar :userId="row.userId" :width="50"></Avatar>
        </template>
        <!-- 昵称 -->
        <template #nickName="{ index, row }">
          <div class="nickname">
            <div>{{ row.nickName }}</div>
            <div class="sex">性别：{{ row.sex == 0 ? "女" : "男" }}</div>
          </div>
        </template>
        <!-- 登录信息 -->
        <template #loginInfo="{ index, row }">
          <div class="loginInfo">
            <div>加入时间：{{ row.joinTime }}</div>
            <div>最后登录时间：{{ row.lastLoginTime }}</div>
            <div>登录地址：{{ row.lastLoginIpAddress }}</div>
          </div>
        </template>
        <!-- 积分 -->
        <template #Integral="{ index, row }">
          <div>总积分：{{ row.totalIntegral }}</div>
          <div>当前积分：{{ row.currentIntegral }}</div>
        </template>
        <!-- 状态信息 -->
        <template #statusInfo="{ index, row }">
          <span v-if="row.status == 0" :style="{ color: 'red' }">已禁用</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已启用</span>
        </template>
        <!-- 操作 -->
        <template #op="{ index, row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"> </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="changeStatus(row)">{{
                    row.status == 0 ? "启用" : "禁用"
                  }}</el-dropdown-item>
                  <el-dropdown-item @click="sendMessage(row)"
                    >发送系统消息</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
  </div>
  <!-- 发送系统消息 -->
  <SendMessage ref="sendMessageRef" @reload="loadUserList"></SendMessage>
</template>

<script setup>
import SendMessage from './SendMessage.vue'
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadUserList: "/user/loadUserList",
  updateUserStatus: "/user/updateUserStatus",
};

const searchFormRef = ref();
const searchFormData = ref({});

// 传递给table的一些属性和方法
const tableData = ref({});
const tableRef = ref();
const columns = [
  {
    label: "头像",
    prop: "avatar",
    width: 150,
    scopedSlots: "avatar",
  },
  {
    label: "昵称",
    prop: "nickName",
    width: 150,
    scopedSlots: "nickName",
  },
  {
    label: "邮箱",
    prop: "email",
    width: 200,
  },
  {
    label: "登录信息",
    prop: "loginInfo",
    scopedSlots: "loginInfo",
  },
  {
    label: "积分",
    prop: "Integral",
    width: 180,
    scopedSlots: "Integral",
  },
  {
    label: "状态信息",
    prop: "status",
    width: 150,
    scopedSlots: "statusInfo",
  },
  {
    label: "操作",
    prop: "op",
    width: 100,
    scopedSlots: "op",
  },
];
const tableOptions = ref({
  extHeight: 50,
});

const loadUserList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  params = Object.assign(params, searchFormData.value);
  const result = await proxy.Request({
    url: api.loadUserList,
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
    selectBatchList.value.push(element.userId);
  });
};
// 行点击
const rowClick = (row) => {};

// 改变状态
const changeStatus = (row) => {
  const type = row.status == 0 ? "启用" : "禁用";
  proxy.Confirm(`确定【${type}】用户【${row.nickName}】吗？`, async () => {
    const result = await proxy.Request({
      url: api.updateUserStatus,
      params: {
        userId: row.userId,
        status: row.status == 0 ? 1 : 0,
      },
    });
    if (!result) {
      return;
    }
    loadUserList();
  });
};
// 发送系统消息
const sendMessageRef=ref()
const sendMessage=(row)=>{
  sendMessageRef.value.showMessageDialog(row)
}
</script>

<style lang="scss" scoped>
.data-list {
  .nickname {
    .sex {
      font-size: 13px;
    }
  }
  .loginInfo {
    font-size: 13px;
  }
  .op {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>