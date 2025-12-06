import { AssetLogType, OptionType } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDictApi } from '@/api/common';

/**
 * 该store用于判断是否需要更新当前页面，作为flag
 */
export const useDictStore = defineStore('dict', () => {
    const dicts = ref<{ [key: string]: OptionType[] }>()

    getDictApi()
        .then(res => {
            if (res) {
                console.log('字典加载成功', res.data)
                dicts.value = res.data
            }
        })

    const getDictLabel: (dictName: string, value: string) => string = (dictName: string, value: string) => {
        if (!dicts.value) return '';
        return dicts.value[dictName]?.find(item => item.value === value)?.label || ''
    }



    return {
        dicts,
        getDictLabel,
        getDict:(dictName:string)=>{
            return dicts.value?.[dictName] || []
        },
        getAssetLogStatusLabel: (item:AssetLogType) => {
            if(['mint','compose','destory'].includes(item.action)){
                return getDictLabel('asset_log_status',item.action)
            }
            if(item.action === 'transfer'){
                return getDictLabel('asset_log_status',item.action+'_'+item.type)
            }
        }
    }
})
