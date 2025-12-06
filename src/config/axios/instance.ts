import { service } from '@/config/axios/service';
import axios, { AxiosInstance } from 'axios';


const baseConfig = service.defaults
const interceptors=service.interceptors
const {baseURL,...config}=baseConfig
const instance: AxiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_API_TICKET_DOMAIN,
  ...config
})
instance.interceptors.request=interceptors.request
instance.interceptors.response=interceptors.response
export {instance}
