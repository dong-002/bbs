<template>
   <v-md-editor
   :model-value="modelValue"
    :height="height+'px'"
    :disabled-menus="[]"
    :include-level="[1,2,3,4,5]"
    @upload-image="handleUploadImage"
    @change="change"
  />
</template>

<script setup>
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
// highlightjs
import hljs from "highlight.js";
import {getCurrentInstance} from 'vue'
VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
const {proxy}=getCurrentInstance()
const props=defineProps({
  modelValue: {
    type:String,
    default: ""
  },
  height:{
    type: Number,
    default: 500
  }
})
const handleUploadImage=async(event, insertImage, files)=> {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      const result=await proxy.Request({
        url: '/file/uploadImage',
        params: {
          file: files[0]
        }
      })
      if(!result) {
        return;
      }
      const url=proxy.globalInfo.imageUrl+result.data.fileName
      insertImage({
        url:url,
        desc: '',
        // width: 'auto',
        // height: 'auto',
      })
}
const emit=defineEmits()
const change=(markdownContent,htmlContent)=>{
  // 数据的双向绑定，在父子组件中共享这个modelValue数据 在父组件中使用<Child v-model='xxx'></Child> 在父亲中如果没有起名字默认是modelValue，如果父亲中v-model:jack，子组件中的update:jack
  emit("update:modelValue",markdownContent)
  emit("htmlContent",htmlContent)
}
</script>

<style lang="scss" scoped>
</style>