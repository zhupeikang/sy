
<script setup lang="ts" name="UserRights">
import NavBar from '@/components/NavBar.vue';
import { ref } from 'vue';
import RightsDetail from '@/components/RightsDetail.vue';
import { AssetRightsType, AssetType } from '@/types';
import { getUserRightsListApi } from '@/api/user';

const active = ref('all')
const onChange = (name: string) => {
    console.log('更换权益类型')
    onInit(name)
    // onLoad()
}

const list = ref<(AssetType & {
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
    loading.value = false
    error.value = false
    errorText.value = ''
    // 重新加载数据 
    list.value = []
    onLoad();
};
const onInit = (st: string) => {
    inited.value = false
    status.value = st
    // 清空列表数据
    finished.value = false;

    loading.value = false
    error.value = false
    errorText.value = ''
    // 重新加载数据
    list.value = []
    onLoad();
};
const onSuccess = (index:number,update:{
    asset_rights_id:number,
    content:any
})=>{
    console.log('onSuccess',index,update)
    list.value[index].asset_rights = list.value[index].asset_rights.map(item=>{
        if(item.asset_rights_id == update.asset_rights_id){
            console.log(item)
            item.status = 'draw'
            item!.content = update.content
        }
        return item
    })
}
onLoad()
</script>
<template>
    <NavBar title="权益背包">
        <template #right>
            <van-icon name="replay" size="18" @click="onRefresh" />
        </template>
    </NavBar>

    <van-tabs v-model:active="active" @change="onChange" class="ignore-tabs">
        <van-tab title="全部" name="all" />
        <van-tab title="未兑换" name="pending" />
        <van-tab title="已兑换" name="success" />
    </van-tabs>
    <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
        :error-text="errorText">
        <RightsDetail :asset="item" v-for="(item,index) in list" :key="item.asset_no" @success="(params:any)=>onSuccess(index,params)" />
    </van-list>
</template>