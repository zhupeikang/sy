import { useRefreshStore } from '@/store/Refresh';
import { PlanType } from '@/types';
import dayjs from 'dayjs';
import { showLoadingToast } from 'vant';
import axios from 'axios';
import { areaList } from '@vant/area-data';

/**
 * 获取本地资源
 * @param image
 * @returns
 */
export const getAssetURL = (image: string) => {
  // 参数一: 相对路径
  // 参数二: 当前路径的URL
  return new URL(`../${image}`, import.meta.url).href
}
/**
 * 加载中状态
 * @param text 提示文本
 * @param minDuration 最小时间间隔
 */
export const showLoading = (text?: string, minDuration?: number) => {

  const begin = Date.now()
  const loading = showLoadingToast({
    message: text || '加载中...',
    duration: 0,
    forbidClick: true,
  });

  return {
    begin,
    loading,
    close: loading.close,
    end: function (callback?: () => void) {
      const now = Date.now()
      const duration = minDuration || 500
      const after = () => {
        loading.close()
        typeof callback == 'function' && callback();
      };
      if (now - this.begin >= duration) {
        after()
      } else {
        setTimeout(after, duration - (now - this.begin))
      }
    }

  }
}
/**
 * 金额计算
 * @param amount
 * @returns
 */
export const amountFormatter = (amount: number) => {
  const formatter = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedAmount = formatter.format(amount);
  const integerPart = formattedAmount.split('.')[0].replace(/,/g, '');
  const decimalPart = formattedAmount.split('.')[1];
  return `${integerPart}.${decimalPart}`;
}
/**
 * 保留两位小数，并转成字符串
 */
export const toFixed = (num: number, len: number = 2) => {
  return num.toFixed(len).toString()
}
/**
 * px转rpx
 * @param num
 * @returns
 */
export const pxToRpx = (num: number): number => {
  return Math.floor((num / window.innerWidth) * 750);
}
/**
 * rpx转px
 * @param num
 * @returns
 */
export const rpxToPx = (num: number): number => {
  return Math.floor((num / 750) * window.innerWidth);
}

export const showLogin = () => {
  const refreshStore = useRefreshStore()
  refreshStore.loginVisible = true

}
/**
 * 获取套餐的状态
 */
export const getPlanStatus = (plan: PlanType) => {
  if (!plan) return 'off'
  if (plan.status != 'on') {
    return plan.status
  }
  //判断是否售罄
  if (plan.total_supply <= plan.sold_supply) {
    return 'out'
  }
  //判断是否开售
  if (plan.begin_at * 1000 > Date.now()) {
    return 'pending'//待开售
  }
  //判断是否结束
  if (plan.end_at * 1000 < Date.now()) {
    return 'off'
  }

  return 'on'
}
/**
 * 验证手机号
 * @param mobile
 * @returns
 */
export const checkMobile = (mobile: string) => {
  return /^1\d{10}$/.test(mobile)
}
/**
 * 写一个函数用于计算字符串长度，英文、数字、半角符号算一个长度，中文和emoji算2个长度
 */
export const getStrLength = (str: string) => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    }
    else {
      len += 2;
    }
  }
  return len;
}
/**
 * 写一个函数用于限制输入内容，仅允许输入中文、英文、数字、emoji、半角符号，如果有其他类型字符则返回false
 */
export const checkStr = (str: string) => {
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      continue;
    }
    if (c >= 0x4e00 && c <= 0x9fa5) {
      continue;
    }

    return false;

  }
  return true;
}
/**
 * 限制输入内容，要求如下：
 * 1.仅允许英文字母、数字、下划线、中划线
 * 2.不得以数字开头，可以以英文字母、下划线、中划线开头
 */
export const checkIdStr = (str: string) => {
  return /^[a-zA-Z_\-][a-zA-Z0-9_\-]*$/.test(str)
}


export const toDatetime = (value: any, format?: string) => {
  if (!format) format = 'YYYY-MM-DD HH:mm:ss'
  if (!value) return '-'
  if ((typeof value == 'number' && value.toString().length <= 11) || (typeof value == 'string' && value.length <= 11 && value.length >= 10)) {
    return dayjs
      .unix(typeof value == 'number' ? value : parseInt(value))
      .format(format)
  }
  return dayjs(value)
    .format(format)

}

export const toTimestamp = (value: any) => {
  if (!value) return 0
  if (typeof value == 'object') {
    return Math.ceil(value.getTime() / 1000)
  }
  if (typeof value == 'string') {
    return Math.ceil(dayjs(value).valueOf() / 1000)
  }
  if (typeof value == 'number' && value.toString().length <= 11) {
    return value
  }
  return Math.ceil(value / 1000)
}

export const fuzzyTime = (time: number) => {
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  time = time.toString().length <= 11 ? time * 1000 : time;
  const elapsed = Date.now() - time;
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(today - DAY).setHours(0, 0, 0, 0);

  if (elapsed < MINUTE) {
    return '刚刚';
  } else if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / MINUTE);
    return `${minutes}分钟前`;
  } else if (time >= today) {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `今天 ${hours}:${minutes}`;
  } else if (time >= yesterday) {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `昨天 ${hours}:${minutes}`;
  } else {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}

export const inWechatBrowser = () => {
  let ua = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua) ? true : false;
}

export const inQQBrowser = () => {
  let ua = navigator.userAgent.toLowerCase();
  console.log('ua', ua)
  return /qq\//.test(ua) ? true : false;
}


// 计算两个时间戳之间的天数(秒级）
export const getDays = (start: number, end: number) => {
  return Math.floor((end - start) / (24 * 60 * 60))
}

/**
 * 隐藏手机号中间四位
 */
export const hideMobile = (mobile: string) => {
  return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export const track = (eventName: string, params?: any) => {
  // 如果不是生产环境，不发送埋点
  if (import.meta.env.VITE_APP_ENV !== 'pro') return;
  window.LA && window.LA.track(eventName, params);
}

export const isIos = () => {
  return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
}

export const isWeChatBrowser = () => {
  var ua = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua);
}



export const apisRequest = async (path:string, params?:any) => {
  const url = `https://apis.map.qq.com${path}?key=XY7BZ-BZ4YB-J3LU4-JZ37R-4277K-ZNFLZ`;
  return await axios.get(url)
}


export const getCityByCode =  (code:string) => {
  const allList = {...areaList.city_list, ...areaList.province_list, ...areaList.county_list}
  return allList[code]
}
