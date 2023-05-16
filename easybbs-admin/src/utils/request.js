import axios from "axios";
import { ElLoading } from "element-plus";
import Message from './message'
import router from "../router";
import message from "./message";

const instance=axios.create({
  baseURL: '/api',
  timeout: 10*1000
})
// 不同的请求内容
const contentTypeForm="application/x-www-form-urlencoded;charset=UTF-8"
const contentTypeJson="application/json"
const contentTypeFile="multipart/form-data"
// 一个遮罩层 在请求时出现有更好的观感，失败或者请求返回就要关闭了
let loading=null
instance.interceptors.request.use(
  (config)=>{
    if(loading!=null&&config.showLoading) {
      loading=ElLoading.service({
        lock: true,
        text: '加载中······',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    return config
  },
  (error)=>{
    if(error.config.showLoading&&loading) {
      loading.close()
    }
    Message.error('发送请求失败')
    return Promise.reject({showError: true,message:'发送请求失败'})
  }
)

instance.interceptors.response.use(
  (response)=>{
    const {showLoading,showError,errorCallback}=response.config
    if(showLoading&&loading) {
      loading.close()
    }
    const result=response.data
    if(result.code==200) {
      return result;
    }else if(result.code==901) {
      setTimeout(()=>{
        router.push('/login')
      },1500)
      return Promise.reject({showError: true,message:'登录超时'})
    }else {
      if(errorCallback) {
        errorCallback()
      }
      return Promise.reject({showError:showError,message: result.info})
    }
  },
  (error)=>{
    if(error.config.showLoading&&loading) {
      loading.close()
    }
    return Promise.reject({showError: showError,message: '网络异常'})
  }
)

const request=(config)=>{
  const {url,params,dataType,showError=true,showLoading=true,errorCallback}=config
  let contentType=contentTypeForm //默认表单类型
  if(dataType!=null&&dataType=='json') {
    contentType=contentTypeJson
  }
  let headers={
    'Content-Type': contentType,
    'X-Requested-With': 'XMLHttpRequest'
  }
  const formData=new FormData()
  for(let key in params) {
    formData.append(key,params[key]==undefined?"":params[key])
  }
  return instance.post(url,formData,{
    headers: headers,
    showLoading: showLoading,
    showError: showError,
    errorCallback: errorCallback
  }).catch(error=>{
    if(error.showError) {
      Message.error(error.message)
    }
    return null
  })
}
export default request