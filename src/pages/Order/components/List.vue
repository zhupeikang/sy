<script setup lang="ts">
import { getOrderListApi } from '@/api/order';
import type { OrderType } from '@/types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toDatetime, toFixed } from '@/utils';
import { useDictStore } from '@/store/Dict';
import Pay from '@/components/Pay.vue';

const dictStore = useDictStore()
const list = ref<OrderType[]>([]);
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
    getOrderListApi({
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
const payRef = ref<InstanceType<typeof Pay>>()
const toPay = (item: OrderType) => {
    payRef.value?.init({
        order_no: item?.order_no,
        expired_at: item?.expired_at,
        coupon_no: item?.coupon_no || '',
        price: item.price,
        amount: item.amount,
        allow_wepay: item!.plan!.wepay_flag == 'Y'
    })
}
</script>
<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
            :error-text="errorText">

            <Pay ref="payRef" />
            <van-card :price="toFixed(item.amount / 100)" :desc="item.plan?.subject" :title="item.order_no"
                :thumb="item.plan?.cover_url"
                :origin-price="item.amount == item.price ? undefined : toFixed(item.price / 100)"
                v-for="(item, index) in list" :key="index.toString()" @click="router.push(`/order/${item.order_no}`)"
                class="margin radius item bg-gradual-cell">
                <template #tag>
                    <van-tag mark type="primary" :class="`order-status-${item.status}`">{{
                        dictStore.getDictLabel('order_status',
                            item.status)
                    }}</van-tag>
                </template>
                <template #tags>
                    {{ toDatetime(item.created_at) }}
                </template>
                <template #bottom>
                    <van-button size="mini" v-if="item.status == 'pending'" @click.stop="toPay(item)">继续支付</van-button>
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