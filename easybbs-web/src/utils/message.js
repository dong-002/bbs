import { ElMessage } from 'element-plus'

const showMessage = (type, message, callback) => {
  ElMessage({
    type: type,
    message: message,
    duration: 2000,
    onClose: () => {
      if (callback) {
        callback()
      }
    },
  })
}
const message ={
  error: (msg,callback)=>{
    showMessage('error',msg,callback)
  },
  success: (msg,callback)=>{
    showMessage('success',msg,callback)
  },
  warning: (msg,callback)=>{
    showMessage('warning',msg,callback)
  }
}

export default message