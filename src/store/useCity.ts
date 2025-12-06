import { defineStore } from 'pinia';
import { reactive } from 'vue';
import store from '@/store/index';

export const useCityStore = defineStore('city', () => {
  // 创建一个响应式对象 city
  const city = reactive({
    name: '',
    code: undefined,
  });

  // 设置城市信息，解构参数对象中的 name 和 code
  const setCity = (value: { name: string, code: any }) => {
    const { name, code } = value; // 解构 name 和 code
    city.name = name;
    city.code = code;
  };

  // 返回响应式对象和设置函数
  return {
    city,
    setCity,
  };
});


export const useCityStoreHook = () => {
  return useCityStore(store);
};
