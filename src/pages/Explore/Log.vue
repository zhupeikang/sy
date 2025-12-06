<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { logExploreApi } from '@/api/explore';
import useClipboard from 'vue-clipboard3';
import { showFailToast, showToast } from 'vant';
import Error from '@/components/Error.vue';
import dayjs from 'dayjs';

const errorShow = ref(false)
const errorText = ref('')
const route = useRoute()
const log = ref<{
    create_time: string
    tx_hash: string
    tx_id: string
    token_id: string
}>()

const loading = ref(false)
const onLoad = async () => {
    if (loading.value) return
    loading.value = true

    const res = await logExploreApi({
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
            log.value = res.data
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
    <NavBar title="区块链交易记录" />
    <van-watermark content="恺英链" opacity="0.3"
        style="height:calc(100vh - var(--van-nav-bar-height));top:var(--van-nav-bar-height);" :gap-x="50" />
    <Error v-if="errorShow" :text="errorText" show />
    <van-collapse v-else-if="log" v-model="activeNames" class="margin shadow-gold">
        <van-collapse-item title="交易记录" name="1">
            <div class="text-deep-gold">交易ID</div>
            <div class="value">{{ log.tx_id }} <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                    @click="onCopy(log.tx_id)" /></div>
            <div class="text-deep-gold">交易哈希值</div>
            <div class="value">{{ log.tx_hash }} <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                    @click="onCopy(log.tx_hash)" /></div>
            <div class="text-deep-gold">资产哈希值</div>
            <div class="value">{{ log.token_id }} <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                    @click="onCopy(log.token_id)" /></div>

            <div class="text-deep-gold">上链时间</div>
            <div class="value">{{ showDate(log.create_time) }}</div>

        </van-collapse-item>
    </van-collapse>
</template>
<style scoped lang="less">
@import url('./style.less');
</style>
