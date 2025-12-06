<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { useRoute } from 'vue-router';
import { reactive, ref } from 'vue';
import { accountExploreApi } from '@/api/explore';
import { toDatetime } from '@/utils';
import router from '@/router';
import dayjs from 'dayjs';
import useClipboard from 'vue-clipboard3';
import { showFailToast, showToast } from 'vant';

const errorShow = ref(false)
const errorText = ref('')
const route = useRoute()
const finished = ref(false)
const account = ref<{
    address: string,
    created_at: number
}>()

const loading = ref(false)

const dataList = reactive<any[][]>([])
const count = ref(0)
const pageSize = 20

const onLoad = async () => {
    if (loading.value) return
    loading.value = true
    const pageNum = dataList.length + 1

    const res = await accountExploreApi({
        ...route.query,
        pageSize,
        pageNum,
        showError: true
    })
        .catch(e => {
            errorShow.value = true
            errorText.value = e.message

        })
        .finally(() => {
            loading.value = false
        })

    if (res) {
        if (res.code == 200) {
            account.value = res.data.account
            count.value = res.data.count
            finished.value = res.data.list.length < pageSize
            dataList[pageNum - 1] = res.data.list
        } else {
            errorShow.value = true
            errorText.value = res.msg
        }
    }

}
const activeNames = ref(['1', '2']);

onLoad()
const toAsset = (item: any) => {
    router.push({
        name: 'ExploreAsset',
        query: {
            hash: item.tokenId
        }
    })
}

const toContract = (item: any) => {
    router.push({
        name: 'ExploreContract',
        query: {
            hash: item.contractId
        }
    })
}

const showDate = (date: string) => {
    return dayjs(date).add(8, 'h').format('YYYY-MM-DD HH:mm:ss')
}

const { toClipboard } = useClipboard();
const onCopy = async (text: string) => {
    try {
        await toClipboard(text);
        showToast('复制成功');
    } catch (e) {
        showFailToast('复制失败');
        console.error(e);
    }
}
</script>
<template>
    <NavBar title="区块链账户" />
    <van-watermark content="恺英链" opacity="0.3"
        style="height:calc(100vh - var(--van-nav-bar-height));top:var(--van-nav-bar-height);" :gap-x="50" />

    <van-collapse v-if="account" v-model="activeNames" class="margin shadow-gold">
        <van-collapse-item title="账户信息" name="1">
            <div class="text-deep-gold">区块链地址</div>
            <div class="value">{{ account.address }} <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon" @click="onCopy(account.address)" /></div>
            <div class="text-deep-gold">注册时间</div>
            <div class="value">{{ toDatetime(account.created_at) }}</div>
        </van-collapse-item>
        <van-collapse-item :title="'TA的资产 ' + count" name="2">
            <van-list v-model:loading="loading" v-model:error="errorShow" :error-text="errorText" @load="onLoad"
                :finished="finished" finished-text="没有更多了" :immediate-check="false" disabled>
                <div v-for="(groups, index) in dataList" :key="index.toString()">
                    <div class="" v-for="(item) in groups" :key="item.tokenId">
                        <van-divider content-position="left">{{ item.name }}</van-divider>
                        <div class="text-deep-gold" @click="toAsset(item)">资产哈希值 <van-icon name="arrow" /></div>
                        <div class="value">{{ item.tokenId }} <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                        @click="onCopy(item.tokenId)" /></div>
                        <div class="text-deep-gold">铸造时间</div>
                        <div class="value">{{ showDate(item.createAt) }}</div>
                        <div class="text-deep-gold" @click="toContract(item)">合约哈希值 <van-icon name="arrow" /></div>
                        <div class="value">{{ item.contractId }} <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                        @click="onCopy(item.contractId)" /></div>
                    </div>
                </div>
                <van-divider @click="onLoad" class="margin-top" v-if="!finished && !loading"><span class="text-deep-gold">更多</span></van-divider>

            </van-list>
        </van-collapse-item>
    </van-collapse>
</template>
<style scoped lang="less">
@import url('./style.less');
</style>
