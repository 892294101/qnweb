import {ElMessage} from "element-plus"
import axios from 'axios'
import router from "@/router/index.js"

import storage from "@/utils/storage.js";

function getHeaders() {
    /*if (storage.getCookie("token").length > 0) {
        headers = {
            'Authorization': "Bearer " + storage.getCookie("token"),
        }
    }*/
    return {
        "Content-Type": "application/json;charset=utf-8",
    }
}


// 创建axios对象，添加全局配置
const service = axios.create({
    timeout: 8000,
    baseURL: import.meta.env.VITE_APP_BASE_API,
    //headers: getHeaders(),
})


// 请求拦截
service.interceptors.request.use((req) => {
    const headers = req.headers
    const token = storage.getVCookie('token') || {}
    if (!headers.Authorization) {
        headers.Authorization = 'Bearer ' + token
    }
    return req
})

// 响应拦截
service.interceptors.response.use((res) => {
    res
    const {code, data, message} = res.data
    if (code === 403) {
        ElMessage.error(message)
        setTimeout(() => {
            //storage.clearAll()
            router.push('/error/403')
        }, 500)
    } else if (code === 406) {
        ElMessage.error(message)
        setTimeout(() => {
            //storage.clearAll()
            router.push('/login')
        }, 500)
    } else {
        return res
    }
}, (err) => {
    ElMessage.error(err.code);
    return Promise.reject(err);
})

// 请求核心函数
function request(options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
    }
    return service(options)
}

export default request

