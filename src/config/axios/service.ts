import axios, { AxiosError, AxiosInstance, AxiosRequestHeaders, AxiosResponse } from 'axios';

import qs from 'qs';
import { showToast } from 'vant';
import { config } from './config';
import router from '@/router';

const { result_code,
 } = config
export const PATH_URL = import.meta.env.VITE_API_DOMAIN
export const WS_URL = import.meta.env.VITE_WS_DOMAIN

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: PATH_URL, // api 的 base_url
  timeout: config.request_timeout // 请求超时时间
})
// request拦截器
service.interceptors.request.use(
  (config) => {
    if (
      config.method === 'post' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
      'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(config.data)
    }
    if (localStorage.getItem('user-token')) {
      (config.headers as AxiosRequestHeaders)['Authorization'] = localStorage.getItem('user-token')
    }
    // const user = wsCache.get(appStore.getUserInfo)
    // if(user){
    //   (config.headers as AxiosRequestHeaders)['Authorization'] = user.api_key
    // }
    // ;(config.headers as AxiosRequestHeaders)['Token'] = 'test test'
    // get参数编码
    if (config.method === 'get' && config.params) {
      let url = config.url as string
      url += '?'
      const keys = Object.keys(config.params)
      for (const key of keys) {
        if (config.params[key] !== void 0 && config.params[key] !== null) {
          url += `${key}=${encodeURIComponent(config.params[key])}&`
        }
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    if (response.config.responseType === 'blob') {
      // 如果是文件流，直接过
      return response
    }  else if (response.data.code == 410) {
      showToast(response.data.msg);
      //调用全局方法
      //@ts-ignore
      window.myApp.config.globalProperties.$showVerify()
    }else if (response.data.code === result_code || (typeof response.config.data == 'string' && response.config.data.indexOf('showError') >= 0) || (typeof response.config.data == 'object' && 'showError' in response.config.data) || (response.config.url || '').indexOf('showError') >= 0) {
      return response.data
    } else if (response.data.code == 403) {
      showToast(response.data.msg);
      router.push({
        path:'/login',
        query:{
          clear:'1',
          referer:window.location.pathname+window.location.search
        }
      })
    } else {
      showToast(response.data.msg)
    }
  },
  (error: AxiosError) => {
    showToast(error.message)
    return Promise.reject(error)
  }
)

export { service }
