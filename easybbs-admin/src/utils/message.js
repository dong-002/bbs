import { ElMessage } from "element-plus";
const showMessage=(type,message,callback)=>{
  ElMessage({
    message: message,
    type: type,
    onClose: ()=>{
      if(callback) {
        callback()
      }
    }
  })
}
const message={
  error: (message,callback)=>{
    showMessage('error',message,callback)
  },
  success: (message,callback)=>{
    showMessage('success',message,callback)
  },
  warning: (message,callback)=>{
    showMessage('warning',message,callback)
  },
}

export default message