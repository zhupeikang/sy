<script setup lang="ts" name="UserAssetlogDetail">
import NavBar from '@/components/NavBar.vue';
import { AssetLogType, AssetType, UserType } from '@/types';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Loading from '@/components/Loading.vue';
import router from '@/router';
import { useDictStore } from '@/store/Dict';
import { getAssetLogDetailApi } from '@/api/asset';
import { showToast } from 'vant';
import { toDatetime } from '@/utils';
import Avatar from '@/components/Avatar.vue';

const dictStore = useDictStore()
const route = useRoute()
const loading = ref(false)
const asset = ref<AssetType>()
const logList = ref<AssetLogType[]>([])
const publisher = ref<UserType>()

const loadData = (asset_no: string) => {
    loading.value = true
    getAssetLogDetailApi({
        asset_no,
        showError: true
    })
        .then(res => {
            loading.value = false
            if (res.code != 200) {
                showToast(res.msg)
                return
            }
            asset.value = res.data.asset
            logList.value = res.data.log_list
            publisher.value = res.data.publisher
        })
        .catch(err => {
            loading.value = false
            showToast(err.message)
        })
}
watch(() => route.params.asset_no as string, (asset_no) => {
    if (!asset_no) return
    loadData(asset_no)
}, {
    immediate: true
})

</script>
<template>
    <NavBar title="资产记录" />
    <Loading mask navbar v-if="loading" />

    <div v-else-if="asset">
        <div class="padding margin clickable shadow-gold bg-gradual-cell asset">
            <div class="clickable flex justify-between align-center margin-bottom" @click.stop="router.push('/u/'+publisher?.uid)">
                <div>{{ publisher?.nickname }}</div>
                <van-icon name="arrow"/>
            </div>
            <div class="flex align-center left" @click="router.push('/asset/'+asset.asset_no)">
                <Avatar :url="asset?.cover_url" />
                <div>
                    <div class="text-deep-gold">{{ asset.name }}</div>
                    <div>{{ asset.asset_no }}</div>
                </div>
            </div>
        </div>


        <van-steps direction="vertical" :active="0" class="margin-lr steps" finish-icon="warning" active-icon="warning"	>
            <van-step v-for="(item, index) in logList" :key="index.toString()">
                <div>{{ toDatetime(item.created_at) }} {{ dictStore.getAssetLogStatusLabel(item) }}</div>
            </van-step>
        </van-steps>
    </div>
</template>
<style>
.steps{
    --van-steps-background:#171717;
    color:#666666;
}
</style>
