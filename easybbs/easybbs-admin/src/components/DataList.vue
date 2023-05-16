<template>
  <NoData
    v-if="!loading && dataSource.list != null && dataSource.list.length == 0" :msg="noDataMsg"
  ></NoData>
  <div class="skeleton" v-if="loading">
    <el-skeleton :rows="3" animated />
  </div>
  <div class="data" v-for="item in dataSource.list" :key="item" v-else>
    <slot :data="item"></slot>
  </div>
  <div class="pagination">
    <el-pagination
      v-if="dataSource.pageTotal > 1"
      :page-size="dataSource.pageSize"
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="dataSource.totalCount"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  dataSource: {
    type: Object,
  },
  loading: {
    type: Boolean,
  },
  noDataMsg: {
    type: String,
    default: "空空如也"
  }
});
const emit = defineEmits(["loadData"]);
// 切换分页
const handleCurrentChange = (current) => {
  props.dataSource.pageNo = current;
  emit("loadData");
};
</script>

<style lang="scss" scoped>
.pagination {
  padding: 8px 0 8px 15px;
}
</style>