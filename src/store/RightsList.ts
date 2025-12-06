import { getUserRightsListApi } from '@/api/user';
import { AssetRightsType, AssetType } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 权益列表
 */
export const useRightsListStore = defineStore('rightsList', () => {
    const list = ref<(AssetType&{
        asset_rights: AssetRightsType[]
    })[]>([]);
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);
    const error = ref(false)
    const errorText = ref('')
    const status = ref('all')
    const inited = ref(false)

    const limit = 10
    const onLoad = () => {
        if (loading.value) return
        inited.value = true
        loading.value = true
        getUserRightsListApi({
            status: status.value,
            skip: list.value.length,
            limit,

            showError: true
        })
            .then(res => {
                if (res.code != 200) {
                    error.value = true
                    errorText.value = res.msg
                    return
                }
                if (res.data.list.length < limit) {
                    finished.value = true
                }
                if (res.data.list.length > 0) {
                    list.value = list.value.concat(res.data.list)
                }
            })
            .catch(err => {
                error.value = true
                errorText.value = err.message
            })
            .finally(() => {
                loading.value = false
                refreshing.value = false
            })
    };

    const onRefresh = () => {
        // 清空列表数据
        finished.value = false;

        error.value = false
        errorText.value = ''
        // 重新加载数据
        list.value = []
        onLoad();
    };
    const onInit = (st:string) => {
        inited.value = false
        status.value = st
        // 清空列表数据
        finished.value = false;

        error.value = false
        errorText.value = ''
        // 重新加载数据
        list.value = []
        // onLoad();
    };
    // onLoad()
    return {
        list,
        loading,
        finished,
        refreshing,
        error,
        errorText,
        status,
        limit,
        onLoad,
        onRefresh,
        onInit,
        inited
    }
})
