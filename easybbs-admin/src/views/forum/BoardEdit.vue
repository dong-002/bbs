<template>
  <Dialog
    :show="dialog.show"
    :title="dialog.title"
    :buttons="dialog.buttons"
    width="600px"
    @close="dialog.show = false"
  >
    <el-form :model="formData" ref="formRef" :rules="rules" label-width="100px">
      <el-form-item label="一级板块" prop="boardType" v-if="formData.boardType">{{formData.pBoardName}}</el-form-item>
      <el-form-item label="板块名称" prop="boardName">
        <el-input
          v-model="formData.boardName"
          placeholder="请输入板块名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="发帖权限" prop="postType">
        <el-radio-group v-model="formData.postType">
          <el-radio :label="1">任何人发帖</el-radio>
          <el-radio :label="0">管理员发帖</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <CoverUpLoad v-model="formData.cover"></CoverUpLoad>
      </el-form-item>
      <el-form-item label="简介" prop="boardDesc">
        <el-input
          type="textarea"
          v-model="formData.boardDesc"
          resize="none"
          :rows="4"
        ></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  saveBoard: "/board/saveBoard",
};

const dialog = reactive({
  show: false,
  title: "编辑板块",
  buttons: [
    {
      type: "default",
      text: "取消",
      click: (e) => {
        dialog.show = false;
      },
    },
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submit();
      },
    },
  ],
});

const formData = ref({});
const formRef = ref();
const rules = reactive({
  boardName: [{ required: true, message: "请输入板块名称", trigger: "blur" }],
  postType: [{ required: true, message: "请选择权限", trigger: "blur" }],
});

// 把这个方法暴露给父组件使用
const editBoard = (type, isChild, row,activeBoard) => {
  dialog.show = true;
  nextTick(() => {
    formRef.value.resetFields();
    if (type == "add") {
      dialog.title = isChild == 0 ? "新增板块" : "新增二级板块";
      formData.value = {};
    } else if (type == "update") {
      dialog.title = isChild == 0 ? "修改板块" : "修改二级板块";
      // 不加这里有一个警告
      formData.value = JSON.parse(JSON.stringify(row));
    }
    // 将cover转换为对象，在coverUpload中是对象
    if(formData.value.cover) {
      formData.value.cover={
        imageUrl: formData.value.cover
      }
    }
    // 在二级板块里显示一级板块名称
    formData.value.boardType=isChild
    if(isChild==1) {
      formData.value.pBoardName=activeBoard.boardName
      formData.value.pBoardId=activeBoard.boardId
    }else {
      formData.value.pBoardId=0
    }
  });
};
defineExpose({ editBoard });

// 提交板块信息
const emit = defineEmits();
const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params=Object.assign({},formData.value)
    // 封面不是文件类型，说明没有修改封面
    if(!(params.cover instanceof File)) {
      delete params.cover
    }
    const result = await proxy.Request({
      url: api.saveBoard,
      params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("保存成功！");
    dialog.show = false;
    // 在父组件重新加载数据
    emit("reload");
  });
};
</script>

<style lang="scss" scoped>
</style>