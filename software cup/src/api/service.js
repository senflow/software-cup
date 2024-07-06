import axios from "axios";
// import { Message } from "element-ui";
import { ElMessage } from "element-plus";
import { getToken } from "../utils/setToken"

const service = axios.create({
    baseURL: '/api', //baseURL自动加在请求地址上
    timeout: 3000
});

service.interceptors.request.use((config) => {
/*     if (config.url !== "auth/adminLogin") {
        //给请求头的设置Token, Cookies.get()用于获取存放在 Cookie 的 Token
        config.headers["Authorization"] = `Token ${getToken('token')}`;
    }
    //这一步是必须的！*/
    return config 
}, (error) => {
    return Promise.reject(error)
})

service.interceptors.response.use((response) => {
    // let status = response.status
    // let message = response.statusText
    // console.log(response)
    // if (status !== 200) {
    //     Message({ message: message || 'error', type: 'warning' })
    // }
    return response
}, (error) => {
    return Promise.reject(error)
})



export default service;