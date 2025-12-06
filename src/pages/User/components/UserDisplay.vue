<script setup lang="ts">
import AssetList from '@/components/AssetList.vue';
import ContractList from '@/components/ContractList.vue';
import { PropType, ref, watch } from 'vue';
import { useUserStore } from '@/store/User';
import { UserType } from '@/types';
import { track } from '@/utils';
import router from '@/router';

const props = defineProps({
    user: {
        type: Object as PropType<UserType>,
        required: true
    },

})


const toGallray = () => {
    track('profile', {
        action: 'enterhall'
    })
    const returnURL = router.currentRoute.value.fullPath
    router.push('/gallery?uid=' + props.user.uid+'&returnURL='+encodeURIComponent(returnURL))
}

const userStore = useUserStore()
const isSelf = ref(false)
watch(() => userStore.userInfo?.uid, (newValue) => {
    if (!newValue) {
        isSelf.value = false
        return
    }
    isSelf.value = newValue == props.user.uid
}, {
    immediate: true
})
const active = ref(0)
watch(()=>active.value,()=>{
    if(active.value==0){
        track('profile',{
            action:'myasset'
        })
    }else{
        track('profile',{
            action:'submitasset'
        })
    }
},{
    immediate:true
})

</script>
<template>
    <van-tabs v-model:active="active"  shrink class="ignore-tabs asset-nav" sticky>
        <van-tab :title="isSelf ? '我的资产' : 'Ta的资产'">
            <AssetList  :uid="props.user.uid" v-if="isSelf|| props.user.privacy_collection_flag == 'Y'"/>
            <div v-else class="text-sm margin text-center text-gray">用户隐私设置不可见</div>
        </van-tab>
        <van-tab :title="isSelf ? '我的作品' : 'Ta的作品'" v-if="isSelf || props.user.publisher_flag == 'Y'">
            <ContractList :uid="props.user.uid" />
        </van-tab>
        <template #nav-right>
            <div class="asset-action"  @click="toGallray" v-if="isSelf || props.user.privacy_collection_flag == 'Y'">
              进入展览馆
              <van-icon   name="arrow"></van-icon>
            </div>
        </template>
    </van-tabs>

</template>
<style scoped lang="less">
.asset-nav {
    position: relative;
    --van-tabs-nav-background: var(--theme-bg);

    .asset-action {
        position: absolute;
        top: 0px;
        right: 20px;
        font-size: 26px;
        top: 20px;
        cursor: pointer;
        z-index: 100;
    }
}
</style>
