import axios from "axios";
import { getToken } from './utils/setToken.js'
import { ElMessage } from "element-plus";
const service = axios.create({
    baseURL: '/api',
    timeout: 3000
})

//请求拦截器
service.interceptors.request.use((config) => {
    // config.headers['token'] = getToken('token')
    return config
}, (error) => {
    return Promise.reject(error)
})
//响应拦截器
service.interceptors.response.use((response) => {
    // let { status, message } = response.data
    // if (status !== 201) {
    //     Message({ message: message || 'error', type: 'warning' })
    // }
    return response
}, (error) => {
    return Promise.reject(error)
})

export default service;