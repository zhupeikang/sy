<script setup lang="ts">
import { changeArtworkStatusApi, getArtworkListApi } from '@/api/manage';
import type { ArtworkType } from '@/types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showLoading, toFixed } from '@/utils';
import { useDictStore } from '@/store/Dict';
import Tag from '@/components/Tag.vue';
import { showConfirmDialog, showToast } from 'vant';

const dictStore = useDictStore()
const list = ref<ArtworkType[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const error = ref(false)
const errorText = ref('')

const props = defineProps({
    status: {
        type: String
    }
})

const limit = 20

const onLoad = () => {
    if (loading.value) return
    loading.value = true
    getArtworkListApi({
        status: props.status,
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
const router = useRouter()
onLoad()

const onPublish = (item: ArtworkType) => {
    router.push('/manage/publish?artwork_id='+item.artwork_id)
}
const changeArtworkStatus = (item: ArtworkType, status: 'on' | 'off') => {
    showConfirmDialog({
        title: '提示',
        message: `确定要${status=='on'?'上架':'下架'}该艺术品吗？`,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    })
        .then(async() => {
            showLoading('处理中')
            const res = await changeArtworkStatusApi({
                artwork_id: item.artwork_id,
                status,
            })
            if (res) {
                showToast(res.msg)
                item.plan.status = res.data.status
            }
        })
}
</script>
<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
            :error-text="errorText">

            <van-card :desc="item.author" :title="item.name" :thumb="item.cover_url" v-for="(item, index) in list"
                :key="index.toString()"
                class="margin radius item bg-gradual-cell">
                <template #tags>
                    <div class="flex justify-between">
                        <Tag title="价格" :value="'¥' + toFixed(item.amount / 100)" />
                        <Tag title="限量" :value="item.total_supply + '份'" />
                    </div>

                </template>
                <template #tag>
                    <van-tag mark type="primary" :class="`order-status-${item.status}`">{{
                        dictStore.getDictLabel('artwork_status', item.status)
                    }}</van-tag>
                </template>
                <template #price>
                    <div v-if="item.status == 'success' && !item.contract_id">
                        <van-button size="mini" @click="router.push(`/manage/edit?artwork_id=`+item.artwork_id)">编辑</van-button>
                        <van-button size="mini" @click="onPublish(item)">发布</van-button>
                    </div>
                    <div v-else-if="item.status == 'success'">
                        <van-button size="mini" @click="router.push(`/plan/${item.plan?.plan_no}`)">查看</van-button>
                        <van-button size="mini" v-if="item.plan.status=='on'" @click="changeArtworkStatus(item,'off')">下架</van-button>
                        <van-button size="mini" v-else-if="item.plan.status=='off'" @click="changeArtworkStatus(item,'on')">上架</van-button>
                    </div>
                    <van-button size="mini" @click="router.push(`/manage/edit?artwork_id=`+item.artwork_id)" v-else>编辑</van-button>
                </template>
                <template #bottom>
                    <div v-if="item.status == 'success' && !item.contract_id">
                        未发布，允许修改
                    </div>
                    <div v-else-if="item.status == 'success'">
                        已发布，无法修改
                    </div>
                    <div v-else-if="item.admin_remark">审核反馈：{{ item.admin_remark }}</div>
                    <div v-else>审核通过后方可发布</div>

                </template>
            </van-card>
        </van-list>
    </van-pull-refresh>
</template>
<style lang="less" scoped>
.item {
    --van-card-text-color: #ffffff;
    --van-card-price-color: var(--theme-gold);
    --van-card-font-size: 28px;

    // --van-card-background;
    :deep(.van-card__bottom) {
        display: flex;
        justify-content: space-between;
        align-items: end;
    }
}
</style>
