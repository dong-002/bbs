import { ElMessageBox } from "element-plus";

const confirm=(message,okfun)=>{
  ElMessageBox.confirm(message,'提示',{
    type: "info",
    confirmButtonText: "确定",
    cancelButtonText: '取消',
  }).then(async()=>{
    okfun()
  }).catch(()=>{

  })
}

export default confirm