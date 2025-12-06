<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height: 100vh">
        <NavBar title="订单详情">
            <template #right>
                <van-icon name="replay" @click="onRefresh" />
            </template>
        </NavBar>
        <Error :text="errorText" :show="errorShow" />
        <Loading mask v-if="loading" navbar />
        <!--加载后-->
        <div v-if="orderData">
            <van-cell-group class="cell margin-top" inset :border="false">
                <van-cell :border="false" title="订单名称" :value="planData?.subject" is-link
                    :to="`/plan/${planData?.plan_no}`" />
                <van-cell :border="false" title="订单状态">
                    <van-tag mark :class="`order-status-${orderData.status}`">{{ dictStore.getDictLabel('order_status',
                        orderData.status) }}</van-tag>
                </van-cell>
                <van-cell :border="false" title="订单金额">
                    {{ amountFormatter(orderData.price / 100) }}
                </van-cell>
                <van-cell :border="false" title="优惠券" v-if="orderData.coupon_no">
                    {{ orderData.coupon_no }}
                </van-cell>
                <van-cell :border="false" title="优惠金额" v-if="orderData.coupon_amount">
                    {{ amountFormatter(orderData.coupon_amount / 100) }}
                </van-cell>
                <van-cell :border="false" title="实付金额">
                    {{ amountFormatter(orderData.amount / 100) }}
                </van-cell>
                <van-cell :border="false" title="订单编号">
                    {{ orderData.order_no }}
                    <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                        @click="onCopy(orderData?.order_no || '')" />
                </van-cell>
                <van-cell :border="false" title="创建时间" :value="toDatetime(orderData.created_at)" />
                <van-cell :border="false" title="付款时间" :value="toDatetime(orderData.payment_at)"
                    v-if="orderData.payment_at" />
                <van-cell :border="false" title="过期时间" :value="toDatetime(orderData.expired_at)"
                    v-if="orderData.status == 'pending' || orderData.status == 'expire'" />
                <van-cell :border="false" title="支付订单号" :value="orderData.payment_id" v-if="orderData.payment_id" />
            </van-cell-group>

            <van-cell-group title="包含资产信息" v-if="assets && assets.length > 0" class="cell margin-tb" inset>
                <van-card v-for="(item, index) in assets" :key="index.toString()" :desc="'作者：' + item.author"
                    :title="item.name" :thumb="item.contract.cover_url"
                    @click-thumb="router.push(`/asset/${item.asset_no}`)" class="asset">

                    <template #price>
                        价值：{{ amountFormatter(item.contract.amount / 100) }}
                    </template>
                    <template #title>
                        <span @click="router.push(`/asset/${item.asset_no}`)">{{ item.name }}</span>
                        <van-tag type="primary" class="asset_status" mark size="medium">{{
                            dictStore.getDictLabel('asset_status', item.status) }}</van-tag>
                    </template>
                    <template #tags>
                        <Tag title="限量" :value="`${item.contract.total_supply}份`" />
                    </template>
                    <template #footer>
                        <div class="text-left">
                            <van-cell-group class="cell" :border="false">
                                <van-cell title="合约地址" :border="false">
                                    <div class="flex">
                                        <div class="van-ellipsis" style="width:260px">{{ item.contract.chain_contract_id }}}
                                        </div>
                                        <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                                            @click="onCopy(item.contract.chain_contract_id)" />
                                    </div>
                                </van-cell>
                                <van-cell title="资产编号" :border="false">
                                    <div class="flex">
                                        <div class="van-ellipsis" style="width:260px">{{ item.asset_no }}</div>
                                        <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                                            @click="onCopy(item.contract.chain_contract_id)" />
                                    </div>
                                </van-cell>
                                <van-cell title="资产地址" :border="false" v-if="item.status == 'success'">
                                    <div class="flex">
                                        <div class="van-ellipsis" style="width:260px">{{ item.token_id }}</div>
                                        <van-icon name="file-copy" class="right-icon" class-prefix="sylf-icon"
                                            @click="onCopy(item.token_id)" />
                                    </div>
                                </van-cell>
                                <van-cell title="铸造时间" :border="false" v-if="item.status == 'success'">
                                    {{ toDatetime(item.minted_at) }}
                                </van-cell>
                            </van-cell-group>
                        </div>
                    </template>
                </van-card>
            </van-cell-group>

            <van-button class="bar-btn" v-if="orderData.status == 'pending'" @click="toPay">继续支付</van-button>
        </div>

    </van-pull-refresh>
    <Pay ref="payRef" />
</template>
<script setup lang="ts" name="OrderDetail">
import Pay from '@/components/Pay.vue';
import NavBar from '@/components/NavBar.vue';
import { ref, watch } from 'vue';
import Error from '@/components/Error.vue';
import Loading from '@/components/Loading.vue';
import { amountFormatter, toDatetime } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import { AssetType, OrderType, PlanDisplayType } from '@/types';
import { getOrderDetailApi } from '@/api/order';
import { useDictStore } from '@/store/Dict';
import useClipboard from 'vue-clipboard3';
import { showFailToast, showToast } from 'vant';
import Tag from '@/components/Tag.vue';

const router = useRouter()
const dictStore = useDictStore()
//处理错误
const errorShow = ref(false)
const errorText = ref('')

const refreshing = ref(false);
const loading = ref(false)

const order_no = ref('')

const onRefresh = () => {
    orderData.value = undefined
    planData.value = undefined
    refreshing.value = true
    errorShow.value = false
    errorText.value = ''
    assets.value = []
    onLoad()
}

const orderData = ref<OrderType>()
const planData = ref<PlanDisplayType>()
const assets = ref<AssetType[]>()
const inited = ref(false)
const onLoad = async () => {
    if (loading.value || !order_no.value) return
    loading.value = true
    const res = await getOrderDetailApi({
        order_no: order_no.value,
        showError: true
    })
    loading.value = false
    refreshing.value = false
    if (res.code == 200) {
        if (JSON.stringify(res.data.order) != JSON.stringify(orderData.value)) {
            console.log('orderData change')
            orderData.value = res.data.order
        }
        if (JSON.stringify(res.data.plan) != JSON.stringify(planData.value)) planData.value = res.data.plan
        if (JSON.stringify(res.data.assets) != JSON.stringify(assets.value)) assets.value = res.data.assets
        if (res.data.order.status == 'pending' || res.data.assets.filter(item => item.status == 'pending').length > 0) {
            setTimeout(onLoad, 3000)
        }

        if (!inited.value) {
            inited.value = true
            //拉起支付
            if ('f' in route.query && route.query.f == 'wepay') {

                payRef.value?.init({
                    order_no: res.data.order.order_no,
                    expired_at: res.data.order?.expired_at,
                    coupon_no: res.data.order?.coupon_no || '',
                    price: res.data.order.price,
                    amount: res.data.order.amount,
                    allow_wepay: res.data.plan?.wepay_flag == 'Y',
                    wepay: true
                })
            }
        }
    } else {
        errorShow.value = true
        errorText.value = res.msg
    }
}

const route = useRoute()
watch(() => route.params.order_no as string, newValue => {
    order_no.value = newValue
    orderData.value = undefined
    planData.value = undefined
    assets.value = []
    onLoad()
}, {
    immediate: true
})

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

const payRef = ref<InstanceType<typeof Pay>>()
const toPay = () => {
    if (!orderData.value) return;
    payRef.value?.init({
        order_no: orderData.value?.order_no,
        expired_at: orderData.value?.expired_at,
        coupon_no: orderData.value?.coupon_no || '',
        price: orderData.value.price,
        amount: orderData.value.amount,
        allow_wepay: planData.value?.wepay_flag == 'Y',
    })
}
</script>
<style scoped lang="less">
@import url('@/assets/css/cell.css');

.cell {
    :deep(.van-cell__value) {
        flex: 2;
    }
}

.asset {
    --van-card-text-color: #ffffff;
    --van-card-background: #333333;
    --van-card-font-size: 32px;

    .asset_status {
        position: absolute;
        top: 0px;
        right: 0px;
    }

    :deep(.van-card__desc) {
        font-size: 26px;
    }
}

:deep(.van-card__footer) {
    .van-cell-group {
        --van-cell-horizontal-padding: 0px;
    }
}
</style>
