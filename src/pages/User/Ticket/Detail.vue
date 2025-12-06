<script lang="ts" setup>

import NavBar from '@/components/NavBar.vue';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTicketOrderDetail, payOrderApiTicket } from '@/api/ticket';
import Item from '@/pages/User/Ticket/componments/Item.vue';
import { getCityByCode, showLoading } from '@/utils';
import Rmb from '@/components/Rmb.vue';
import { PAY_TYPE_TEXT } from '@/types/ticket';
import { OrderStatus, TicketStatusText } from '@/types';
import { getJsApi } from '@/api/user';
import { showFailToast, showToast } from 'vant';
import useClipboard from 'vue-clipboard3';
import Qrcode from '@/pages/User/Ticket/componments/Qrcode.vue';
import { vOnLongPress } from '@vueuse/components';

const route = useRoute();
const router = useRouter();
const orderInfo = ref({});
const eventInfo = ref({});
const skuInfo = ref({});
const getDetail = (no: string) => {
  getTicketOrderDetail({
    master_order_no: no,
  }).then(res => {
    orderInfo.value = res.data.master_order;
    eventInfo.value = res.data.event;
    skuInfo.value = res.data.sku;
  });
};
watch(() => route.params, (v) => {
  if (!v.master_order_no) return;
  getDetail(route.params.master_order_no as string);

}, {
  immediate: true,
});
const active = ref(0);
const needPay = computed(() => {
  return [OrderStatus.MASTER_ORDER_STATUS_ORDERED, OrderStatus.MASTER_ORDER_STATUS_WAIT_PAY].includes(orderInfo?.value.status);
});
const doPay = computed(() => {
  return OrderStatus.MASTER_ORDER_STATUS_WAIT_PAY === orderInfo.value.status;
});

const toPay = async (payment: string) => {
  let params: {
    no: string
    payment: string
    state?: string
    code?: string
    pay_type?: 1,
  } = {
    no: orderInfo.value.no,
    payment,
    pay_type: 1,
  };
  if (payment == 'wepay') {
    console.log(payment);
    //判断query中是否包含f=wechat
    if ('f' in route.query && route.query.f == 'wepay') {
      //拉起JSAPI
      params.code = route.query.code as string;
      params.no = orderInfo.value.no;
      console.log(params);
    } else {
      //跳转微信授权
      const loading = showLoading('支付中');
      const res = await getJsApi();
      if (res) {
        loading.end();
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + res.data.appid + '&redirect_uri=' + encodeURIComponent(window.location.origin + '/user/ticket/' + orderInfo.value.no + '?f=wepay') + '&response_type=code&scope=snsapi_base&state=' + res.data.state + '#wechat_redirect';
      }
      return;
    }

  }
  const loading = showLoading('支付中');
  const res = await payOrderApiTicket(params);
  if (res.data.msg === 'ok') {
    loading.end();

    function onBridgeReady() {
      //@ts-ignore
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        res.data.extra_data,
        function(res: any) {
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            showToast('支付成功');
          } else {
            showToast('取消支付');
          }
          router.push({
            path:'/ticket/orderPay/'+orderInfo.value.no
          })
          // emits('payCall', res);
        },
      );
    }

    //@ts-ignore
    if (typeof WeixinJSBridge == 'undefined') {
      if (document.addEventListener) {
        document.addEventListener(
          'WeixinJSBridgeReady',
          onBridgeReady,
          false,
        );
        //@ts-ignore
      } else if (document.attachEvent) {
        //@ts-ignore
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        //@ts-ignore
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    } else {
      onBridgeReady();
    }

  }


};

watch(() => route.query, (v) => {
  if (v.f) {
    setTimeout(() => {
      toPay('wepay');
    }, 500);
  }
}, {
  immediate: true,
});
const goPay = async () => {
  if (doPay.value) {
    await toPay('wepay');
    return;
  }
  await router.push('/ticket/orderConfirm/' + orderInfo.value.no);
};
const { toClipboard } = useClipboard();
const onCopy = async (text: string) => {
  try {
    await toClipboard(text);
    showToast('复制成功');
  } catch (e) {
    showFailToast('复制失败');
  }
}
const  showCode=ref(false)

const show=(e:any)=>{
  showCode.value=true
}
const paginate=(type:number)=>{
  active.value+=type
}

function onLongPressCallbackDirective(e: PointerEvent) {
  router.push('/user/ticket/refund/'+orderInfo.value.no)
}
</script>

<template>
  <div class="">
    <NavBar title="门票详情"></NavBar>
    <div  class="bg-without-rd p-26px"
          v-on-long-press="[onLongPressCallbackDirective, { delay: 5000, modifiers: { stop: true } }]"
    >
      {{ eventInfo?.type?.name }} <span class="text-34px text-deep-gold">{{TicketStatusText[orderInfo?.ticket_order?.[active]?.ticket?.status]}}</span>
    </div>
    <div v-if="orderInfo.status!==OrderStatus.MASTER_ORDER_STATUS_ORDERED">
      <van-tabs v-model:active="active" animated class="tabReset" shrink swipeable>
        <div v-for="(item,index) in orderInfo.ticket_order" :key="item.id">
          <van-tab :title="item.ticket.real_bind.card_name">
            <Item @get-finish="getDetail" @show-code="show" :event="eventInfo" :master-order="orderInfo" :item="item" :sku="skuInfo" />
          </van-tab>
        </div>
      </van-tabs>
    </div>

    <div class=" font-bold flex gap-20px   p-28px">
      <div>
        <img :src="skuInfo.img" alt="" class="b-rd-10px h-248px w-170px object-cover">
      </div>
      <div class="flex flex-1 shrink-0 ml-a flex-col justify-between ">
        <div>
          <div class="text-white">{{ eventInfo.name }}</div>
          <div class="text-right font-bold">
            <Rmb></Rmb>
            {{ skuInfo.price }}
          </div>
        </div>
        <div class="text-#666666 text-26px">
          <div>{{ getCityByCode(eventInfo.city) }} | {{ eventInfo.address_detail }}</div>
          <div>
            {{ skuInfo.use_date }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-without-rd p-28px">
      <span class="w-50%">{{ skuInfo.ticket_cate }}</span> <span class="float-right text-right">{{orderInfo.ticket_order?.length}} 张</span>
    </div>
    <div class="mt-10px ">
      <van-cell-group :border="false">
        <van-cell :border="false" title="商品总额">
          <Rmb />
          {{ orderInfo.amount_total }}
        </van-cell>
        <van-cell :border="false" title="订单总价">
          <Rmb />
          {{ orderInfo.amount_total }}
        </van-cell>
        <van-cell v-if="orderInfo.amount_cost" :border="false" title="优惠价格">
          <Rmb />
          {{ orderInfo.amount_cost }}
        </van-cell>
        <van-cell :border="false" title="实付金额">
          <Rmb />
          {{ orderInfo.amount_actual }}
        </van-cell>
      </van-cell-group>
    </div>
    <van-divider hairline></van-divider>
    <div class="">
      <van-cell-group :border="false">
        <van-cell :border="false" title="订单编号">{{ orderInfo.no }}
        <template #right-icon>
          <van-icon size="14" name="file-copy"  class="right-icon" class-prefix="sylf-icon"
                    @click.stop="onCopy(orderInfo.no)" />
        </template>
        </van-cell>
        <van-cell :border="false" v-if="!needPay" title="支付方式">{{ PAY_TYPE_TEXT[orderInfo.pay_type] }}</van-cell>
        <van-cell :border="false" v-if="!needPay" title="交易单号">{{ orderInfo.pay_id }}</van-cell>
        <van-cell :border="false" title="下单时间">{{ orderInfo.created_at }}</van-cell>
        <van-cell :border="false" v-if="!needPay" title="支付时间">{{ orderInfo.pay_at }}</van-cell>
      </van-cell-group>
    </div>
    <div v-if="needPay" @click="goPay" class="bottom-placeholder">
      <div class="linear text-40px fixed-bottom">立即支付</div>
    </div>
        <van-popup teleport="body" round v-model:show="showCode" :style="{height: '75%'}"  closeable position="bottom"  safe-area-inset-bottom >
          <div class="  ">
            <Qrcode @next="paginate(1)" @prev="paginate(-1)" :key="orderInfo.ticket_order?.[active].no" v-bind="{sku:skuInfo,item:orderInfo.ticket_order[active],event:eventInfo}" ></Qrcode>
          </div>
        </van-popup>
  </div>

</template>

<style lang="less" scoped>
.bottom-placeholder {
  height: 100px; /* 占位元素的高度与固定元素相同 */
  padding: 20px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 20px;
  box-sizing: border-box;
  font-size: 26px;
  width: 100%;
  right: 0;
  z-index: 100;
  text-align: center;
  color: #000000;
}
.tab {
  font-size: 29px;
  padding: 7px 10px;
  background: var(--theme-gradual-gold);
  border-radius: 5px;
  color: var(--black);
}

.tabReset {
  --van-tabs-nav-background: transparent;
  --van-tab-active-text-color: var(--theme-deep-gold);
  --van-tab-text-color: var(--white);
  --van-tab-font-size: 30px;
}
</style>
