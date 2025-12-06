<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import router from '@/router';
import { getBuyerList, getOrderDetail } from '@/api/ticket';
import { getCityByCode, showLoading } from '@/utils';
import NavBar from '@/components/NavBar.vue';
import Rmb from '@/components/Rmb.vue';
import { usePurchaser } from '@/store/UsePurchaser';
import { storeToRefs } from 'pinia';
import Coupon from '@/components/Coupon.vue';
import CouponList from '@/components/CouponList.vue';
import Pay from '@/pages/Ticket/components/Pay.vue';
import ArticleAgree from '@/components/ArticleAgree.vue';
import { PAY_TYPE, PAY_TYPE_TEXT } from '@/types/ticket';

const { setData } = usePurchaser();
const { checkedIds, list } = storeToRefs(usePurchaser());
const no = router.currentRoute.value.params.no;
const detail = ref<any>({});
const orderInfo = ref<any>({});
const skuInfo = ref<any>({});
// 获取购票人列表
const orderDetail=()=>{
  const loading = showLoading();
  getOrderDetail(
    {
      master_order_no: no,
    },
  ).then((res: { data: { event: any; master_order: any; sku: any } }) => { // Add type annotation for res
    detail.value = res.data.event;
    orderInfo.value = res.data.master_order;
    // 判断订单有没有设置购买人
    const {ticket_order}=orderInfo.value
    ticket_order.map(v=>{
      const {ticket=null}=v
      if (!ticket)return
      const {real_bind}=ticket
      checkedIds.value=[]
      checkedIds.value.push(real_bind.id)
    })
    skuInfo.value = res.data.sku;
  }).finally(() => {
    loading.end();
  });
}

// 设置选择的购票人
onMounted(() => {
  orderDetail()
  getBuyerList().then((res: { data: any }) => { // Add type annotation for res
    setData(res.data);
  });
});

onUnmounted(()=>{
  checkedIds.value=[]
})

const enterSelect = () => {
  router.push({
    path: '/purchaser/select',
    query: {
      max: skuInfo.value.order_limit,
    },
  });
};


const value1 = ref<{ [key: string]: number }>({}); // Add type annotation for value1
const showCoupon = ref<{ [key: string]: number }>({}); // Add type annotation for showCoupon
const option1 = [
  { text: '不使用优惠', value: 0 },
  { text: '平台资产优惠', value: 1 },
  { text: '兑换码兑换', value: 2 },
];

watch(() => orderInfo.value.ticket_order, (value) => {
  if (!value) return;
  value.forEach((item: any) => {
    value1.value[item.no] = 0;
    showCoupon.value[item.no] = 0;
  });
}, {
  immediate: true,
});

const setCoupon = (item: any) => {
  showCoupon.value[item.no] = value1.value[item.no];
};
const showCouponPop = ref(false);
const showAgree = ref(false);

const CouponListRef = ref(null);

const agree = ref(true);
const agreeGo=(type: number)=>{
  switch (type){
    case 1:
      router.push('/article/agree')
      break;
    case 2:
      router.push('/article/privacy')
      break
  }
  // showAgree.value=true
}

const getCoupon = () => {
  if (showCouponPop.value) {
    showCouponPop.value = false;
  }
  if (CouponListRef.value) {
    CouponListRef.value.map(item => {
      item.refresh();
    });
  }
};

const payTypeSelect = ref(PAY_TYPE.WECHAT);
console.log(payTypeSelect.value);
watchEffect(()=>{
  if (CouponListRef.value){
    reCalPrice()
  }
})
const price=ref(0)

const reCalPrice=()=>{
  price.value=0
  CouponListRef.value.map(item => {
    price.value+=Number(item.discountInfo.pay)
  });
}

const payCall=()=>{
  router.push({
    path:'/ticket/orderPay/'+orderInfo.value.no
  })
}

</script>

<template>
  <NavBar title="确定订单" />
  <div class="p-26px">
    <div class="bg p-20px text-white ">
      <div>
        【{{ detail?.type?.name }}】{{ detail.name }}
      </div>
      <div class="text-26px mt-40px">
        {{ detail.date_begin_at }} - {{ detail.date_end_at }}
        <div>
          {{ getCityByCode(detail.city) }} | {{ detail.address }}
        </div>
        <div class="text-#666">
          {{ detail.address_detail }}
        </div>
      </div>
      <div class="mt-34px">
        <Rmb class="text-#DDBF8C" />
        <span
          class="text-#DDBF8C">{{ orderInfo.amount_actual
          }}</span>&nbsp;&nbsp;|&nbsp;&nbsp;{{ orderInfo?.ticket_order?.length }}张
        <span class="linear ml-64px p-x-16px b-rd-6px text-25px text-black">{{skuInfo.ticket_cate}}</span>
      </div>
    </div>
  </div>
  <div class="bg">
    <div class="p-x-54px p-y-38px">
      <div class="text-33px flex items-end justify-between">
        <div>
          购买人 <span class="text-25px">({{ checkedIds.length }}/{{ skuInfo.order_limit }})</span>
        </div>
        <div class=" text-#DBB985 border-1px p-2px b-rd-4px text-25px " @click="enterSelect">
          <van-icon name="edit" />
          添加/修改
        </div>
      </div>
      <div class="text-25px  mt-24px text-#DBB985">
        <van-icon name="info" />
        本项目购买人和入场人证件须一致，代买将无法进场
      </div>
      <div class="mt-10px">
        <van-checkbox-group v-model="checkedIds" :max="skuInfo.order_limit" direction="horizontal">
          <van-checkbox v-for="(item,index) in list" :key="index" :name="item.id" icon-size="16px">{{ item.card_name
            }}
          </van-checkbox>
        </van-checkbox-group>
      </div>

    </div>
  </div>
  <div class="section">
    <div v-for="(item,index) in orderInfo.ticket_order" :key="index">
      <div class="block w-full text-center linear  text-36px font-bold p-y-20px">
        {{ skuInfo.sku }}
      </div>
      <div class="bg-#1F1F1F">
        <div class="flex p-10px justify-between items-center">
          <div>
            优惠&nbsp;
            <span v-if="showCoupon[item.no]===2" class="text-25px underline "
                  @click="showCouponPop=true">兑换优惠码</span>
          </div>
          <div
            style="--van-dropdown-menu-background:transparent;--van-dropdown-menu-title-text-color:white;--van-dropdown-menu-title-font-size:14px">
            <van-dropdown-menu>
              <van-dropdown-item v-model="value1[item.no]" :options="option1" @change="setCoupon(item)" />
            </van-dropdown-menu>
          </div>
        </div>
        <div>
          <CouponList
                      ref="CouponListRef"
                      :order="item"
                      :orderNo="item.no"
                      :sku="skuInfo"
                      :type="showCoupon[item.no]" />
        </div>

      </div>
    </div>
  </div>
  <div class="section text-22px">
    <van-checkbox v-model="agree" icon-size="medium" label-disabled>
      我已阅读并同意 <span class="text-deep-gold underline" @click="agreeGo(1)">购票服务条款</span> <span @click="agreeGo(2)" class="text-deep-gold underline" >平台服务协议</span>
    </van-checkbox>
  </div>
  <div class="section">
    <div>
      选择支付方式
    </div>
    <div class="p-20px ">
      <van-radio-group v-model="payTypeSelect">
        <div v-for="(item,index) in PAY_TYPE_TEXT" class="mt-10px">
          <van-radio :name="index">
            {{ item }}
          </van-radio>
        </div>
      </van-radio-group>
    </div>
  </div>
  <Pay @pay-call="payCall"
       v-if="orderInfo.id"
       :real-bind="checkedIds"
       :sku="skuInfo"
       :price="price"
       :agree="agree"
       :pay-type="payTypeSelect"
       :order="orderInfo"></Pay>
  <van-popup v-model:show="showCouponPop" :style="{
    height: '40%'
  }" closeable position="bottom" round safe-area-inset-bottom>
    <Coupon @finish="getCoupon"></Coupon>
  </van-popup>
  <van-popup v-model:show="showAgree" :style="{
    height: '80%'
  }"  closeable position="bottom"  safe-area-inset-bottom>
    <ArticleAgree></ArticleAgree>
  </van-popup>


</template>

<style lang="less" scoped>
.section {
  padding: 26px;
}

:deep(.van-checkbox--horizontal) {
  margin-bottom: var(--van-padding-sm);
}
</style>
