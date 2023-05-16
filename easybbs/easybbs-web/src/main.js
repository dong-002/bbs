import { createApp } from 'vue'
import App from './App.vue'
import './assets/base.scss'
import router from './router'
import { createPinia } from 'pinia'
// cookies
import VueCookies from 'vue-cookies'
// elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 图标
import './assets/icon/iconfont.css'
// 全局组件
import Dialog from '@/components/Dialog.vue'
import Avatar from '@/components/Avatar.vue'
import Cover from '@/components/Cover.vue'
import DataList from '@/components/DataList.vue'
import NoData from '@/components/NoData.vue'
import ImageViewer from '@/components/ImageViewer.vue'
import EditorMarkdown from '@/components/EditorMarkdown.vue'
import EditorHtml from '@/components/EditorHtml.vue'
import CoverUpLoad from '@/components/CoverUpLoad.vue'
import AttachmentUpload from '@/components/AttachmentUpload.vue'
// 全局方法
import verify from './utils/verify'
import Request from './utils/request'
import Message from './utils/message'
import SizeFormat from './utils/sizeFormat'
import Confirm from './utils/confirm'

const app=createApp(App)
const pinia=createPinia()
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.component('Dialog',Dialog)
app.component('Avatar',Avatar)
app.component('Cover',Cover)
app.component('DataList',DataList)
app.component('NoData',NoData)
app.component('ImageViewer',ImageViewer)
app.component('EditorMarkdown',EditorMarkdown)
app.component('EditorHtml',EditorHtml)
app.component('CoverUpLoad',CoverUpLoad)
app.component('AttachmentUpload',AttachmentUpload)
// 配置全局cookie
app.config.globalProperties.VueCookies=VueCookies
app.config.globalProperties.globalInfo={
  bodyWidth: 1300,
  avatarUrl: '/api/file/getAvatar/',
  imageUrl: '/api/file/getImage/'
}
app.config.globalProperties.verify=verify
app.config.globalProperties.Request=Request
app.config.globalProperties.Message=Message
app.config.globalProperties.SizeFormat=SizeFormat
app.config.globalProperties.Confirm=Confirm
app.mount('#app')
