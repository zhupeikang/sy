import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getConfigApi } from '@/api/common';
import { showLoading } from '@/utils';

/**
 * 该store用于判断是否需要更新当前页面，作为flag
 */
export const useConfigStore = defineStore('config', () => {
    const configs = ref<{ [key: string]: string }>()
    const loaded = ref(false)
    const loading = showLoading()
    getConfigApi()
        .then(res => {
            if (res) {
                loading.end()
                configs.value = res.data
                loaded.value = true
            }
        })

    const getConfig: (name: string,dvalue?:any) => string = (name: string,dvalue?:any) => {
        if (!configs.value) return dvalue || '';
        return configs.value[name] || ''
    }



    return {
        configs,
        getConfig,
        loaded
    }
})
