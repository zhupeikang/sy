<script setup lang="ts">
import { useUserStore } from '@/store/User';
import { ref, watch } from 'vue';
import { amountFormatter, isWeChatBrowser, showLoading } from '@/utils';
import { calOrderCouponApi, checkOrderApi, payOrderApi } from '@/api/order';
import { showDialog, showSuccessToast, showToast } from 'vant';
import router from '@/router';
import { useRoute } from 'vue-router';
import { getJsApi } from '@/api/user';

const route = useRoute();
const userStore = useUserStore();
const show = ref(false);
const inited = ref(true);//是否初始化过
const price = ref(0);//价格
const amount = ref(0);//付款金额
const coupon_no = ref('');//优惠券
const asset_no = ref('');//资产编号
const expired_at = ref(0);
const order_no = ref('');
const initPrice = ref(0);
const disabled = ref(false);
const allowWepay = ref(false);
const props = defineProps({
  couponLength: {
    type: Number,
    default: 8,
  },
  isPre: {
    type: Boolean,
    default: false,
  },
});

defineExpose({
  init: (params: {
    order_no: string
    expired_at: number
    coupon_no: string
    price: number
    amount: number,
    allow_wepay: boolean
    wepay?: boolean
  }) => {
    show.value = true;
    price.value = params.price;
    initPrice.value = params.price;
    amount.value = params.amount;
    coupon_no.value = params.coupon_no;
    expired_at.value = params.expired_at;
    order_no.value = params.order_no;
    allowWepay.value = params.allow_wepay;
    inited.value = true;
    disabled.value = false;
    asset_no.value = params.pre_asset;

    if (params.wepay) {
      //拉起JSAPI
      toPay('wepay');
    }
  },
  close: () => {
    show.value = false;
  },
});


watch(() => show.value, (newValue) => {
  if (!newValue) {
    //重置状态
    inited.value = false;
    price.value = 0;
    amount.value = 0;
    coupon_no.value = '';
    expired_at.value = 0;
    order_no.value = '';
    disabled.value = false;
  }
}, {
  immediate: true,
});
watch(() => coupon_no.value, async (newValue, oldValue) => {
  if (!order_no.value) return;
  if (newValue.length == 8) {
    const loading = showLoading('计算中');
    const res = await calOrderCouponApi({
      coupon_no: newValue,
      order_no: order_no.value,
    });
    if (res) {
      loading.end();
      amount.value = res.data.amount;
      disabled.value = false;
    } else {
      console.log('优惠券查询失败');
      amount.value = initPrice.value;
      disabled.value = true;
    }
  } else {
    if (newValue.length > 0) {
      disabled.value = true;
      amount.value = initPrice.value;
    } else {
      //初始化
      console.log('初始化', newValue, oldValue);
      if (oldValue && oldValue.length > 0) {
        //清空优惠券
        const res = await calOrderCouponApi({
          order_no: order_no.value,
        });
        if (res) {
          disabled.value = false;
          amount.value = initPrice.value;
        }
      } else {
        disabled.value = false;
        amount.value = initPrice.value;
      }
    }
  }
}, {
  immediate: true,
});

const goAssets = (item:string) => {
  router.push('/asset/' + item);
}

const toPay = async (payment: string) => {
  let params: {
    order_no: string
    payment: string
    state?: string
    code?: string
  } = {
    order_no: order_no.value,
    payment,
  };
  if (payment == 'wepay') {
    //判断是否是微信浏览器
    if (!isWeChatBrowser()) {
      showToast('请使用微信打开');
      return;
    }
    //判断query中是否包含f=wechat
    if ('f' in route.query && route.query.f == 'wepay') {
      //拉起JSAPI
      params.state = route.query.state as string;
      params.code = route.query.code as string;

    } else {
      //跳转微信授权
      const loading = showLoading('支付中');
      const res = await getJsApi();
      if (res) {
        loading.end();
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + res.data.appid + '&redirect_uri=' + encodeURIComponent(window.location.origin + '/order/' + order_no.value + '?f=wepay') + '&response_type=code&scope=snsapi_base&state=' + res.data.state + '#wechat_redirect';
      }

      return;
    }

  }
  const loading = showLoading('支付中');
  const res = await payOrderApi(params);
  if (res) {
    if (res.data.type == 'pending') {
      const checkStatus = () => {
        const loading = showLoading('订单处理中');
        setTimeout(async () => {
          const res = await checkOrderApi({
            order_no: order_no.value,
          });
          if (res) {
            if (res.data.status == 'pending') {
              checkStatus();
            } else if (res.data.status == 'success') {
              loading.end();
              showSuccessToast('支付成功');
              router.push('/order/' + order_no.value);
            } else {
              loading.end();
              showToast('订单已超时');
            }
          }
        }, 2000);
      };
      checkStatus();
    } else if (res.data.type == 'success') {
      showSuccessToast('支付成功');
      loading.end();
      router.push('/order/' + order_no.value);
    } else if (res.data.type == 'redirect') {
      loading.end();
      window.location.href = res.data.url;
    } else if (res.data.type == 'jsapi') {
      loading.end();

      function onBridgeReady() {
        //@ts-ignore
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          //@ts-ignore
          res.data.jsapi.extra_data,
          function(res: any) {
            console.log(res);
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              showToast('支付成功');
              show.value = false;
            } else {
              showToast('取消支付');
            }
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
  }
};
/**
 * 订单过期
 */
const onExpire = () => {
  disabled.value = true;
  showDialog({
    message: ' 订单已过期，请重新下单',
  });

};


</script>
<template>
  <van-popup v-model:show="show" closeable position="bottom"
             :style="{ maxHeight: '60%', minHeight: '10%', padding: '40px 20px' }">
    <div class="text-center" v-if="!inited">
      <van-loading />
    </div>
    <div v-else>
      <div class="price">
        {{ amountFormatter(amount / 100) }}
        <span class="orig_price" v-if="amount != price">{{ amountFormatter(price / 100) }}</span>
      </div>
      <van-cell-group :border="false">
        <van-cell title="昵称" :value="userStore.userInfo?.nickname" />
        <!-- <van-cell title="订单号" :value="order_no" /> -->
        <van-field v-model="coupon_no" label="优惠码" placeholder="请输入优惠码" :maxlength="props.couponLength"
                   input-align="right" />
        <van-field disabled @click="goAssets(asset_no)" is-link v-model="asset_no" label="资产编码" placeholder="" v-if="props.isPre" input-align="right" />
        <van-cell title="剩余支付时间">
          <van-count-down millisecond :time="expired_at * 1000 - Date.now()" format="mm:ss" @finish="onExpire" />
        </van-cell>
        <van-field :border="false" v-if="amount == 0">
          <template #input>
            <van-button block type="primary" class="ignore-theme-btn" @click="toPay('')"
                        :disabled="disabled">立即领取
            </van-button>
          </template>
        </van-field>
        <template v-else>
          <van-field :border="false" v-if="allowWepay">
            <template #input>
              <van-button icon="wechat-pay" block type="success" round @click="toPay('wepay')"
                          :disabled="disabled">微信支付
              </van-button>
            </template>
          </van-field>
          <van-field :border="false">
            <template #input>
              <van-button icon="card" block type="primary" class="ignore-theme-btn" @click="toPay('adapay')"
                          :disabled="disabled">银行卡支付
              </van-button>
            </template>
          </van-field>
        </template>
      </van-cell-group>
    </div>
  </van-popup>
</template>
<style scoped lang="less">
.price {
  font-size: 48px;
  font-weight: bold;
  text-align: center;

  .orig_price {
    font-size: 30px;
    color: #999;
    text-decoration: line-through;
  }
}
</style>
