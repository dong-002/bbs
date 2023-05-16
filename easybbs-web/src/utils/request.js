import axios from 'axios'
import { ElLoading } from 'element-plus'
import message from './message'
import {useStore} from '../store/index.js'

const instance = axios.create({
  baseURL: '/api',
  timeout: 40 * 1000,
})
// 不同的请求内容
const contentTypeForm='application/x-www-form-urlencoded;charset=UTF-8' ;
const contentTypeJson='application/json'
const contentTypeFile='multipart/form-data'

// 一个遮罩层 在请求时出现有更好的观感，失败或者请求返回就要关闭了
let loading = null
// 请求前拦截器
instance.interceptors.request.use(
  (config) => {
    if (config.showLoading) {
      loading = ElLoading.service({
        lock: true,
        text: '加载中......',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    return config
  },
  (error) => {
    if (error.config.showLoading && loading) {
      loading.close()
    }
    message.error('发送请求失败')
    return Promise.reject('发送请求失败')
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 解构出一些需要的返回属性
    const {showLoading,errorCallback,showError}=response.config
    if(showLoading&&loading) {
      loading.close()
    }
    const result=response.data
    if(result.code==200) {
      return result; //返回成功的数据
    }else if(result.code==901) {
      // 当用户在浏览器中过了半个钟没动，后端的session已经过期了，这个时候就要用户重新登录
      const store=useStore() //pinia的store要在这里面调用不然报错
      store.changeShowLogin(true)
      store.updateLoginUserInfo(null)
      return Promise.reject({showError: false,message: '登录超时'})
    }else {
      if(errorCallback) {
        errorCallback(result)
      }
      return Promise.reject({showError: showError,message: result.info})
    }
  },
  // 返回失败 说明是后端程序有问题
  (error) => {
    if(error.config.showLoading&&loading) {
      loading.close()
    }
    return Promise.reject({showError: showError,message: '网络异常'})
  }
)

const request = (config) => {
  const {url,params,dataType,showLoading=true,showError=true,errorCallback}=config
  let contentType=contentTypeForm //默认表单类型
  if(dataType!=null&&dataType=='json') {
    contentType=contentTypeJson
  }
  let headers={
    'Content-Type': contentType,
    'X-Requested-With': 'XMLHttpRequest'
  }
  let formData=new FormData()
  // 获取参数 将参数变为formData（键值对）的形式便于发送请求
  for(let key in params) {
    formData.append(key,params[key]==undefined?"":params[key])
  }
  // 只用post请求也可以完成，不用分get和post
  return instance.post(url,formData,{
    headers: headers,
    showLoading: showLoading,
    showError: showError,
    errorCallback: errorCallback
  }).catch(error=>{
    // 捕获拦截器中Promise.reject的错误
    if(error.showError) {
      message.error(error.message)
    }
    return null
  })
}

export default request
