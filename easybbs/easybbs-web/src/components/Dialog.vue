<template>
  <div>
    <el-dialog
      :model-value="show"
      :title="title"
      :draggable="true"
      :width="width"
      :show-close="showClose"
      :top="top"
      :close-on-click-modal="false"
      @close="close"
      @keyup.enter.prevent
      class="custom-class"
    >
      <div class="dialog-body">
        <!-- 这里是插槽，用来存放父组件传过来的内容 -->
        <slot></slot>
      </div>
      <template v-if="(buttons&&buttons.length>0) || showCancel">
        <div class="dialog-footer">
          <!-- 默认只有一个取消按钮 可以从父组件中传过来其他按钮 -->
          <el-button @click="close" v-if="showCancel">取消</el-button>
          <el-button v-for="btn in buttons" :key="btn" :type="btn.type" @click="btn.click">
            {{btn.text}}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
//对父组件提供属性
const props=defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '30%'
  },
  showClose: {
    type: Boolean, //右上的X
    default: true
  },
  top: {
    type: String,
    default: '50px'
  },
  showCancel: {
    type: Boolean, //右下的取消
    default: false
  },
  buttons: {
    type: Array,
  }
})
const emit=defineEmits()
const close=()=>{
  emit('close')
}
</script>

<style lang="scss" scoped>
:deep(.custom-class) {
  margin-bottom: 10px;
  .dialog-body {
    border-top: 1px solid #ddd;
    min-height: 100px;
    padding: 15px;
    // 防止内容过多 外面出现滚动条 让弹框内部出现滚动条
    max-height: calc(100vh - 200px); 
    overflow: auto;
  }
  .dialog-footer {
    text-align: right;
    padding: 10px 20px;
  }
}
:deep(.el-dialog__body) {
    padding: 0px;
  }
</style>