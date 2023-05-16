<template>
  <div class="table-body">
    <el-table
      ref="tableRef"
      :data="dataSource.list || []"
      :height="tableHeight"
      :stripe="options.stripe"
      :border="options.border"
      :highlight-current-row="true"
      @row-click="ClickRow"
      @selection-change="selectionChange"
    >
      <!-- 选择框 -->
      <el-table-column
        v-if="options.selectType && options.selectType == 'checkbox'"
        width="50"
        type="selection"
        align="center"
      />
      <!-- 序号 -->
      <el-table-column
        v-if="options.showIndex"
        width="60"
        type="index"
        prop="序号"
      />
      <!-- 数据列表 -->
      <template v-for="(column, index) in columns" :key="index">
        <!-- 有插槽 -->
        <template v-if="column.scopedSlots">
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
          >
            <template #default="scope">
              <!-- 插槽作用域，把当前的每一行传到父组件 -->
              <slot
                :name="column.scopedSlots"
                :index="scope.$index"
                :row="scope.row"
              ></slot>
            </template>
          </el-table-column>
        </template>
        <!-- 无插槽 -->
        <template v-else>
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
          ></el-table-column>
        </template>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagination" v-if="showPagination">
      <el-pagination
        v-if="dataSource.totalCount"
        background
        layout="total, prev, pager, next"
        :total="dataSource.totalCount"
        :page-sizes="[15, 30, 50]"
        :page-size="dataSource.pageSize"
        :current-page="dataSource.pageNo"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNoChange"
        style="text-align: right"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  dataSource: Object,
  showPagination: {
    type: Boolean,
    default: true,
  },
  // 一些额外样式或操作
  options: {
    type: Object,
    default: {
      extHeight: 0,
      showIndex: false,
    },
  },
  columns: Array,
  //获取数据的函数
  fetch: Function,
  initFetch: {
    type: Boolean,
    default: true,
  },
});

// 顶部50，tab区域40，分页区域高度42
const topHeight = 50 + 40+ 42  +20 ;
// tbale的高度
const tableHeight = ref(
  props.options.tableHeight
    ? props.options.tableHeight
    : window.innerHeight - topHeight - (props.options.extHeight||0)
);
// 初始化
const init = () => {
  if (props.initFetch && props.fetch) {
    props.fetch();
  }
};
init();

// 数据
const tableRef = ref();

const emit = defineEmits(["rowClick", "rowSelect"]);
// 行点击
const ClickRow = (row) => {
  emit("rowClick", row);
};
// 多选
const selectionChange = (rows) => {
  emit("rowSelect", rows);
};

// 清除选择
const clearSelection = () => {
  tableRef.value.clearSelection();
};
// 设置行选中
const setCurrentRow = (rowKey, rowValue) => {
  let row = props.dataSource.list.find((item) => {
    return item[rowKey] == rowValue;
  });
  tableRef.value.setCurrentRow(row);
};
// 这是在子组件外面的操作，要暴露出去
defineExpose({ clearSelection, setCurrentRow });

// 分页
// 每页可以显示多少条数据
const handlePageSizeChange = (size) => {
  props.dataSource.pageSize = pageSize;
  props.dataSource.pageNo = 1;
  props.fetch();
};
// 切换分页
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  props.fetch();
};
</script>

<style lang="scss">
.pagination {
  padding-top: 10px;
}
.el-pagination {
  justify-content: right;
}

.el-table__body tr.current-row > td.el-table__cell {
  background-color: #e6f0f9;
}

.el-table__body tr:hover > td.el-table__cell {
  background-color: #e6f0f9 !important;
}
</style>