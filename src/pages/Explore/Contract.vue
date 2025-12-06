<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { contractExploreApi } from '@/api/explore';
import useClipboard from 'vue-clipboard3';
import { showFailToast, showToast } from 'vant';
import Error from '@/components/Error.vue';
import dayjs from 'dayjs';

const errorShow = ref(false)
const errorText = ref('')
const route = useRoute()
const contract = ref<{
    contract_id: string
    create_at: string
    image_url: string
    name: string
    publisher_address: string
    total_supply: number
}>()

const loading = ref(false)
const onLoad = async () => {
    if (loading.value) return
    loading.value = true

    const res = await contractExploreApi({
        ...route.query,
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
            contract.value = res.data
        } else {
            errorShow.value = true
            errorText.value = res.msg
        }
    }

}
const activeNames = ref(['1',]);

onLoad()

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
const showDate = (date: string) => {
    return dayjs(date).add(8, 'h').format('YYYY-MM-DD HH:mm:ss')
}
</script>
<template>
    <NavBar title="区块链合约信息" />
    <van-watermark content="恺英链" opacity="0.3"
        style="height:calc(100vh - var(--van-nav-bar-height));top:var(--van-nav-bar-height);" :gap-x="50" />
    <Error v-if="errorShow" :text="errorText" show />
    <van-collapse v-else-if="contract" v-model="activeNames" class="margin shadow-gold">
        <van-collapse-item title="合约信息" name="1">
            <div class="text-deep-gold">合约名称</div>
            <div class="value">{{ contract.name }}</div>
            <div class="text-deep-gold">发行数</div>
            <div class="value">{{ contract.total_supply }}</div>
            <div class="text-deep-gold">合约图片</div>
            <div class="value">
                <img :src="contract.image_url" alt="" class="image">
            </div>
            <div class="text-deep-gold">合约哈希值</div>
            <div class="value">{{ contract.contract_id }} <van-icon name="file-copy" class="right-icon"
                    class-prefix="sylf-icon" @click="onCopy(contract.contract_id)" /></div>
            <div class="text-deep-gold">发行商哈希值</div>
            <div class="value">{{ contract.publisher_address }} <van-icon name="file-copy" class="right-icon"
                    class-prefix="sylf-icon" @click="onCopy(contract.publisher_address)" /></div>

            <div class="text-deep-gold">上链时间</div>
            <div class="value">{{ showDate(contract.create_at) }}</div>

        </van-collapse-item>
    </van-collapse>
</template>
<style scoped lang="less">
@import url('./style.less');
.image{
    width:300px;
}
</style>
