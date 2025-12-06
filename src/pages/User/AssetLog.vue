<script setup lang="ts" name="UserAssetlog">
import NavBar from '@/components/NavBar.vue';
import { useDictStore } from '@/store/Dict';
import { ref, watch } from 'vue';
import router from '@/router';
import { toDatetime } from '@/utils';
import { AssetLogType } from '@/types';
import { getAssetLogListApi } from '@/api/asset';
import Avatar from '@/components/Avatar.vue';

const checked = ref(['transfer_in', 'transfer_out', 'mint', 'compose', 'destory']);

const dictStore = useDictStore()

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const errorText = ref('')
const list = ref<AssetLogType[]>([])
const limit = 20
const onLoad = () => {
    if (loading.value) return

    loading.value = true

    getAssetLogListApi({
        status: checked.value.includes('all') ? '' : checked.value.join(','),
        skip: list.value.length,
        limit,
        showError: true
    })
        .then(res => {
            loading.value = false
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
}
const onRefresh = () => {
    finished.value = false;

    error.value = false
    errorText.value = ''
    // 重新加载数据
    list.value = []
    onLoad();
}
const statusList = ref<{
    label: string
    value: string
}[]>([])
watch(() => dictStore.getDict('asset_log_status'), (newValue) => {
    statusList.value = newValue
}, {
    immediate: true
})
const chooseStatus = (val: string) => {
    if (checked.value.includes(val)) {
        checked.value = checked.value.filter(item => item != val)
    } else {
        checked.value.push(val)
    }
    onRefresh()
}
const cancelAll = ()=>{
    checked.value = []
    onRefresh()
}
const checkAll = ()=>{
    checked.value = statusList.value.map(item=>item.value)
    onRefresh()
}
</script>
<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height:100vh">

        <NavBar title="资产记录" />
        <div class="flex margin">
            <van-tag size="large" class="margin-right tag-active" @click="cancelAll()" v-if="checked.length==statusList.length">全选</van-tag>
            <van-tag size="large" class="margin-right tag-unactive" @click="checkAll()" v-else>全选</van-tag>
            <van-tag v-for="(item, index) in statusList"
                :key="index.toString()" size="large" :class="'margin-right '+(!checked.includes(item.value) ? 'tag-unactive' : 'tag-active')" @click="chooseStatus(item.value)">{{ item.label
                }}</van-tag>
        </div>
        <!-- <van-search v-model="value" placeholder="请输入搜索关键词" /> -->
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
            :error-text="errorText">
            <div class="margin-lr padding align-center flex cell justify-between margin-bottom clickable shadow-gold"
                v-for="(item, index) in list" :key="index.toString()" @click="router.push('/user/assetlog/'+item.asset_no)">
                <div class="flex align-center left">
                    <Avatar :url="item.cover_url" />
                    <div>
                        <div class="text-deep-gold">{{ item.name }}</div>
                        <div>{{ item.asset_no }}</div>
                    </div>
                </div>
                <div class="flex align-center right">
                    <div class="text-right">
                        <div>
                            <van-tag type="primary">{{ dictStore.getAssetLogStatusLabel(item) }}</van-tag>
                        </div>
                        <div class="text-gray">
                            {{ toDatetime(item.created_at) }}
                        </div>
                    </div>
                    <van-icon name="arrow" />
                </div>
            </div>

        </van-list>
    </van-pull-refresh>
</template>
<style scoped lang="less">
.cell {
    background: var(--theme-gradual-cell);
    box-sizing: border-box;
    font-size: 28px;
    color: #ffffff;

    .left,
    .right {
        gap: 20px;
    }
}
</style>
