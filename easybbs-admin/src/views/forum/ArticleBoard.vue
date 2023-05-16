<template>
  <div class="article-board">
    <Dialog
      :show="dialog.show"
      :title="dialog.title"
      :buttons="dialog.buttons"
      width="500px"
      @close="dialog.show = false"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="60px">
        <el-form-item label="标题">
          <div class="title">{{ formData.title }}</div>
        </el-form-item>
        <el-form-item label="板块" prop="boardIds">
          <el-cascader
            :options="boardList"
            clearable
            :props="boardProps"
            v-model="formData.boardIds"
            :style="{ width: '100%' }"
          />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadBoard: "/board/loadBoard",
  updateBoard: "/forum/updateBoard",
};
const dialog = reactive({
  show: false,
  title: "修改模块",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formRef = ref();
const rules = reactive({
  boardIds: [{ required: true, message: "请选择板块", trigger: "blur" }],
});
// 板块
const boardList = ref([]);
const boardProps = {
  label: "boardName",
  value: "boardId",
  checkStrictly: true,
};

const loadBoard = async () => {
  const result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
};
loadBoard();

const updateBoard = (data) => {
  dialog.show = true;
  // 页面加载完后
  nextTick(() => {
    formRef.value.resetFields();
    // data是父组件传进来的article信息，这里选择板块formData使用了boardIds
    data.boardIds = [];
    data.boardIds.push(data.pBoardId);
    if (data.boardId != null && data.boardId != 0) {
      data.boardIds.push(data.boardId);
    }
    formData.value = data;
  });
};
defineExpose({ updateBoard });

// 修改板块，提交
const emit=defineEmits();
const submitForm = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {
      articleId: formData.value.articleId,
    };
    params.boardIds = formData.value.boardIds;
    if (params.boardIds && params.boardIds.length == 1) {
      params.pBoardId = params.boardIds[0];
    } else if (params.boardIds && params.boardIds.length == 2) {
      params.pBoardId = params.boardIds[0];
      params.boardId = params.boardIds[1];
    }
    delete params.boardIds;
    const result=await proxy.Request({
      url: api.updateBoard,
      params:params
    })
    if(!result) {
      return;
    }
    dialog.show = false;
    // 父组件重新加载数据
    emit("reload");
  });
};
</script>

<style lang="scss" scoped>
</style>