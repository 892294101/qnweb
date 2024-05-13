import {createApp} from 'vue'
import App from './App.vue'
import router from "./router"
import pinia from "./store"
import ElementPlus from 'element-plus'
//import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'
import svgIcon from './components/svgicons/index.vue'

import './assets/css/global.css'
import "./css/base.css"
/*import api from './api'
import storage from '@/utils/storage'*/
// 自定义指令
import buttonPermissionDirective from './permission/ButtonPerms.js';
import elementPermissionDirective from './permission/ElementAuthority.js';

const app = createApp(App)
/*app.config.globalProperties.$api = api
app.config.globalProperties.$storage = storage*/

app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.directive('button-permission', buttonPermissionDirective) // 组册自定义指令
app.directive('permission', elementPermissionDirective) // 组册自定义指令


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.component('svgIcon', svgIcon)


app.mount('#app')

