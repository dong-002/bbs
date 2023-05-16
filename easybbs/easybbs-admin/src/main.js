import { createApp } from 'vue'
import './assets/base.scss'
import App from './App.vue'

// elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index.js'
import VueCookies from 'vue-cookies'
// 图标
import './assets/icon/iconfont.css'
// 全局方法
import verify from './utils/verify'
import Request from './utils/request'
import Message from './utils/message'
import SizeFormat from './utils/sizeFormat'
import Confirm from './utils/confirm'
// 全局组件
import Dialog from '@/components/Dialog.vue'
import Avatar from '@/components/Avatar.vue'
import Cover from '@/components/Cover.vue'
import DataList from '@/components/DataList.vue'
import Table from '@/components/Table.vue'
import CoverUpLoad from '@/components/CoverUpLoad.vue'

const app=createApp(App)
app.use(ElementPlus)
app.use(router)
app.component('Dialog',Dialog)
app.component('Avatar',Avatar)
app.component('Cover',Cover)
app.component('DataList',DataList)
app.component('Table',Table)
app.component('CoverUpLoad',CoverUpLoad)
// 配置全局cookie
app.config.globalProperties.VueCookies=VueCookies
app.config.globalProperties.globalInfo={
  bodyWidth: 1300,
  avatarUrl: '/api/file/getAvatar/',
  imageUrl: '/api/file/getImage/',
  webDomain: import.meta.env.VITE_WEB_DOMAIN
}
app.config.globalProperties.verify=verify
app.config.globalProperties.Request=Request
app.config.globalProperties.Message=Message
app.config.globalProperties.SizeFormat=SizeFormat
app.config.globalProperties.Confirm=Confirm
app.mount('#app')
