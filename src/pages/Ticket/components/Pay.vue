<script lang="ts" setup>
import Status from '@/pages/Ticket/components/Status.vue';
import { OrderStatus } from '@/types';
import { storeToRefs } from 'pinia';
import { useCouponStore } from '@/store/UseCoupon';
import { isWeChatBrowser, showLoading } from '@/utils';
import { showToast } from 'vant';
import { getJsApi } from '@/api/user';
import { useRoute } from 'vue-router';
import { payOrderApiTicket, updateOrder } from '@/api/ticket';
import { watch } from 'vue';

const emits = defineEmits(['payCall']);
const route = useRoute();
const { selectedValues } = storeToRefs(useCouponStore());
const props = defineProps(['order', 'sku', 'price', 'payType', 'realBind', 'agree']);
const toPay = async (payment: string) => {
  let params: {
    no: string
    payment: string
    state?: string
    code?: string
    pay_type?: 1,
  } = {
    no: props.order.no,
    payment,
    pay_type: 1,
  };
  if (payment == 'wepay') {
    //判断是否是微信浏览器

    //判断query中是否包含f=wechat
    if ('f' in route.query && route.query.f == 'wepay') {
      //拉起JSAPI
      params.code = route.query.code as string;
      params.no = props.order.no;
    } else {
      //跳转微信授权
      const loading = showLoading('支付中');
      const res = await getJsApi();
      if (res) {
        loading.end();
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + res.data.appid + '&redirect_uri=' + encodeURIComponent(window.location.origin + '/ticket/orderConfirm/' + props.order.no + '?f=wepay') + '&response_type=code&scope=snsapi_base&state=' + res.data.state + '#wechat_redirect';
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
          emits('payCall', res);
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
    return;
  }

  if (res.data === true) {
    emits('payCall', res);
  }

};
const onSubmit = async () => {
  if (!props.agree) {
    showToast('请阅读并同意购票服务条款、平台服务协议');
    return;
  }
  if (!isWeChatBrowser()) {
    showToast('请使用微信打开');
    return;
  }

  const status = props.order.status;
  let res: boolean;
  const grouped = Object.entries(selectedValues.value).reduce((acc, [selectedValuesKey, value]) => {
    const [key] = Object.keys(value);  // Extract the key
    const val = Object.values(value)[0];  // Extract the value
    const group = key === '1' ? 'nft_rights' : key === '2' ? 'coupons' : null;  // Map the key
    if (group) {
      // @ts-ignore
      acc[group] = acc[group] || {};  // Initialize the group if not yet created
      // @ts-ignore
      acc[group][selectedValuesKey] = val;  // Assign the value to the corresponding group
    }
    return acc;
  }, {});
  // @ts-ignore
  const { nft_rights = {}, coupons = {} } = grouped;  // Destructure the grouped results
  switch (status) {
    case OrderStatus.MASTER_ORDER_STATUS_ORDERED:
      const r = await updateOrder({
        'master_order_id': props.order.id,
        coupons,
        nft_rights,
        'real_binds': props.realBind,
        'price_actual': props.price,
      });
      res=false
      if (r.code===200){
        res = r.data;
      }
      break;
    case OrderStatus.MASTER_ORDER_STATUS_WAIT_PAY:
      res = true;
      break;
    default:
      res = false;
      break;
  }
  if (res) {
    await toPay('wepay');
  } else {
    showToast('订单错误');
  }
};

function parseCustomDateString(dateString: string) {
  // 使用正则表达式解析日期和时间部分
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error('Invalid date format. Expected format: YYYY-MM-DD HH:mm:ss');
  }

  // 解构出年、月、日、时、分、秒
  const [_, year, month, day, hour, minute, second] = match;

  // 创建 Date 对象 (注意：月份从 0 开始，需要减 1)
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
}

watch(() => route.query, (v) => {
  if (v.f) {
    toPay('wepay');
  }
}, {
  immediate: true,
});
const calculateTimeDifference = (targetTime: string) => {
  const parsedDate = parseCustomDateString(targetTime);
  const updatedDate = new Date(parsedDate.getTime() + 30 * 60 * 1000);
  // 获取当前时间
  const now = new Date();

  // 计算时间差（单位为毫秒）
  return updatedDate - now;
};
</script>

<template>
  <div style="
  --van-count-down-text-color:var(--theme-bar);
  --van-submit-bar-tip-background:var(--theme-deep-gold);
  --van-submit-bar-tip-color:var(--theme-bar);
  --van-submit-bar-background:var(--theme-bar);
  --van-submit-bar-text-color:var(--van-tabbar-item-text-color)">
    <van-submit-bar
      :disabled="![OrderStatus.MASTER_ORDER_STATUS_ORDERED,OrderStatus.MASTER_ORDER_STATUS_WAIT_PAY].includes(order.status)"
      :price="price*100"
      button-color="var(--theme-gradual-btn)"
      button-text="立即支付" placeholder
      text-align="left" @submit="onSubmit">
      <template #tip>
        <div class="flex text-25px font-bold font-black items-center justify-between">
          <div>
            <Status v-bind="props"></Status>
          </div>
          <div v-if="order.status===OrderStatus.MASTER_ORDER_STATUS_ORDERED">
            <van-count-down :time="calculateTimeDifference(order.created_at)" />
          </div>
        </div>
      </template>
    </van-submit-bar>

  </div>

</template>

<style lang="less" scoped>
.bottom-placeholder {
  height: 100px; /* 占位元素的高度与固定元素相同 */
  padding: 20px;
}
</style>
