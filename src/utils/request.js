import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const { success, message } = response.data
    if (success) {
      return response.data
    } else {
      Message.error(message)
      return Promise.reject(message)
    }
  },
  error => {
    console.dir(error)
    Message.error((error.response && error.response.data && error.response.data.message) || error.message)
    // 身份过期清空token
    if (error?.response?.data?.code === 10002) {
      store.dispatch('user/logOutActions')
      router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
    }
    return Promise.reject(error)
  }
)

export default service
