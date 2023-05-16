<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :showCancel="false"
    :buttons="dialogConfig.buttons"
    @close="dialogConfig.show = false"
    width="600px"
  >
    <el-form :model="formData" ref="formDataRef">
      <el-form-item label="日期" prop="createTimeRange">
        <el-date-picker
        v-model="formData.createTimeRange"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        @change="loadRecord"
      >
      </el-date-picker>
      </el-form-item>
      <div class="record-info">
        <div class="record-type">类型</div>
        <div class="integral">积分</div>
        <div class="time">时间</div>
      </div>
      <DataList
        :dataSource="recordList"
        :loading="loading"
        noDataMsg="暂无相关记录"
        @loadData="loadRecord"
      >
        <template #default="{ data }">
          <div class="record-info">
        <div class="record-type">{{data.operTypeName}}</div>
        <div :class="['integral',data.integral>0?'add':'reduce']">{{data.integral}}</div>
        <div class="time">{{data.createTime}}</div>
      </div>
        </template>
      </DataList>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, nextTick } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { proxy } = getCurrentInstance();
const api = {
  loadUserIntegralRecord: "/ucenter/loadUserIntegralRecord",
};

const dialogConfig = reactive({
  show: false,
  title: "用户积分信息",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: () => {
        dialogConfig.show = false;
      },
    },
  ],
});
const formData = ref({});
const formDataRef = ref();

const showRecordDialog = () => {
  dialogConfig.show = true;
  nextTick(()=>{
    formDataRef.value.resetFields()
    loadRecord()
  })
};
defineExpose({ showRecordDialog });

const recordList = ref({});
const loading = ref(false); //请求时显示骨架屏
const loadRecord = async () => {
  let params = {
    pageNo: recordList.value.pageNo,
  };
  if(formData.value.createTimeRange) {
    console.log(formData.value.createTimeRange);
    params.createTimeStart=formData.value.createTimeRange[0],
    params.createTimeEnd=formData.value.createTimeRange[1]
  }
  loading.value = true;
  const result = await proxy.Request({
    url: api.loadUserIntegralRecord,
    params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  recordList.value = result.data;
};
</script>

<style lang="scss" scoped>
.record-info {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  .record-type {
    width: 120px;
  }
  .integral {
    width: 120px;
  }
  .time {
    flex: 1;
    text-align: center;
  }
  .add {
    color: red;
  }
  .reduce {
    color: green;
  }
}
</style>