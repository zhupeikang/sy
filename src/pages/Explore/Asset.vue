<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { useRoute } from 'vue-router';
import { reactive, ref } from 'vue';
import { assetExploreApi } from '@/api/explore';
import router from '@/router';
import dayjs from 'dayjs';
import useClipboard from 'vue-clipboard3';
import { showFailToast, showToast } from 'vant';

const errorShow = ref(false)
const errorText = ref('')
const route = useRoute()
const finished = ref(false)
const asset = ref<{
    tokenId: string;
    txId: string;
    contractId: string;
    author: string;
    name: string;
    userAddress: string;
    traits: any[];
    ownerName: string;
    ownerMobile: string;
    publisherAddress: string;
    createAt: string;
    isMixed: boolean;
    rights: any[];
}>()

const loading = ref(false)

const dataList = reactive<any[][]>([])
const count = ref(0)
const pageSize = 20

const onLoad = async () => {
    if (loading.value) return
    loading.value = true
    const pageNum = dataList.length + 1

    const res = await assetExploreApi({
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
            if (asset) {
                asset.value = res.data.asset
            }
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
const toLog = (hash: string) => {
    router.push({
        name: 'ExploreLog',
        query: {
            hash
        }
    })
}

const toContract = (hash: string) => {
    router.push({
        name: 'ExploreContract',
        query: {
            hash
        }
    })
}
const toAccount = (hash: string) => {
    router.push({
        name: 'ExploreAccount',
        query: {
            hash
        }
    })
}

const showDate = (date: string) => {
    return dayjs(date).add(8, 'h').format('YYYY-MM-DD HH:mm:ss')
}

const transferType = {
    gift: '转赠',
    mint: '铸造',
    sale: '买卖',
    recycle:'回收'
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
    <NavBar title="区块链资产" />
    <van-watermark content="恺英链" opacity="0.3"
        style="height:calc(100vh - var(--van-nav-bar-height));top:var(--van-nav-bar-height);" :gap-x="50" />

    <van-collapse v-if="asset" v-model="activeNames" class="margin shadow-gold">
        <van-collapse-item title="资产信息" name="1">
            <div class="text-deep-gold">资产名称</div>
            <div class="value">{{ asset.name }}</div>
            <div class="text-deep-gold">资产哈希值</div>
            <div class="value">{{ asset.tokenId }} <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                    @click="onCopy(asset.tokenId)" /></div>
            <div class="text-deep-gold" @click="toContract(asset.contractId)">合约哈希值 <van-icon name="arrow" /></div>
            <div class="value">{{ asset.contractId }} <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                    @click="onCopy(asset.contractId)" /></div>
            <div class="text-deep-gold">作者</div>
            <div class="value">{{ asset.author }}</div>
            <div class="text-deep-gold" v-if="asset.publisherAddress" @click="toAccount(asset.publisherAddress)">发行商哈希值 <van-icon name="arrow" /></div>
            <div class="value" v-if="asset.publisherAddress">{{ asset.publisherAddress }} <van-icon name="file-copy"
                    class="right-icon" class-prefix="sylf-icon" @click="onCopy(asset.publisherAddress)" /></div>
        </van-collapse-item>
        <van-collapse-item title="流转信息" name="2">
            <van-list v-model:loading="loading" v-model:error="errorShow" :error-text="errorText" @load="onLoad"
                :finished="finished" finished-text="没有更多了" :immediate-check="false" disabled>
                <div v-for="(groups, index) in dataList" :key="index.toString()">
                    <div class="" v-for="(item) in groups" :key="item.tokenId">
                        <van-divider content-position="left">{{ showDate(item.createAt) }} {{ transferType[item.transferType as 'mint' ]}}</van-divider>
                        <div class="text-deep-gold" @click="toLog(item.txId)">交易ID <van-icon name="arrow" /></div>
                        <div class="value">{{ item.txId }} <van-icon name="file-copy" class="right-icon"
                                class-prefix="sylf-icon" @click="onCopy(item.txId)" /></div>
                        <div class="text-deep-gold" @click="toAccount(item.toAddress)">区块链地址 <van-icon name="arrow" /></div>
                        <div class="value">{{ item.toAddress }} <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon" @click="onCopy(item.toAddress)" /></div>
                    </div>
                </div>
                <van-divider @click="onLoad" class="margin-top" v-if="!finished && !loading"><span
                        class="text-deep-gold">更多</span></van-divider>

            </van-list>
        </van-collapse-item>
    </van-collapse>
</template>
<style scoped lang="less">@import url('./style.less');</style>
