<script lang="ts" setup>

import NavBar from '@/components/NavBar.vue';
import { getTicketOrderRefundCancel, getTicketOrderRefundDetail } from '@/api/ticket';
import { computed, ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { RefundStatus, RefundStatusText } from '@/types';
import Rmb from '@/components/Rmb.vue';
import { getCityByCode } from '@/utils';
import { PAY_TYPE_TEXT } from '@/types/ticket';
import useClipboard from 'vue-clipboard3';
import { showFailToast, showToast } from 'vant';
import router from '@/router';

const keys = Object.keys(RefundStatus).filter(key => isNaN(Number(key)));
const route = useRoute();
const event = ref({});
const refund = ref({});
const sku = ref({});
const { toClipboard } = useClipboard();
const onCopy = async (text: string) => {
  try {
    await toClipboard(text);
    showToast('复制成功');
  } catch (e) {
    showFailToast('复制失败');
    console.error(e);
  }
};
function detail(){
  getTicketOrderRefundDetail({
    no: route.params.master_order_no,
  }).then(r => {
    if (r.code === 200) {
      event.value = r.data.event;
      refund.value = r.data.refund;
      // refund.value.status=70
      sku.value = r.data.sku;
    }
  });
}
watch(() => route.params, (v) => {
  if (!v.master_order_no) return;
  detail()

}, {
  immediate: true,
});


const steps = ref(['申请退款', '平台处理中']);
watchEffect(() => {
  if (refund.value?.status !== undefined) {
    // @ts-ignore
    steps.value.push(RefundStatusText[refund.value?.status]);
  }
});
const canCancel = computed(() => {
  return [RefundStatus.TICKET_ORDER_REFUND_STATUS_APPLY].includes(refund.value?.status);
});
const canApply = computed(() => {
  return [RefundStatus.TICKET_ORDER_REFUND_STATUS_CANCELED, RefundStatus.TICKET_ORDER_REFUND_STATUS_REJECT].includes(refund.value?.status);
});

const onSubmit = () => {
  if (canCancel.value) {
    getTicketOrderRefundCancel({
      no:refund.value?.no
    }).then(r=>{
      if (r.code===200){
        showToast('取消成功')
        detail()
      }
    })
    return;
  }else if (canApply.value){
    router.push({
      path:'/user/ticket/refund/'+refund.value?.master_order.no
    })
  }
};

</script>

<template>
  <div class="p-20px">
    <NavBar title="退款进度"></NavBar>
    <div>
      <div class="bg-without-rd ">
        <div class="p-y-66px flex flex-col gap-30px justify-center items-center">
          <div class="button">
            {{ RefundStatusText[refund.status] }}
          </div>
          <div>
            将会在未来30个工作日内退款到原付款路径
          </div>
          <div class="w-100%">
            <van-steps active="2" style="">
              <van-step v-for="(item,index) in steps" :key="index">{{ item }}</van-step>
            </van-steps>
          </div>

        </div>

      </div>
    </div>
    <div class="mt-10px ">
      <van-cell-group>
        <van-cell :border="false" title="订单金额">
          <Rmb />
          {{ refund.master_order?.amount_total }}
        </van-cell>
        <van-cell :border="false" title="优惠金额">
          <Rmb />
          {{ refund.master_order?.amount_cost }}
        </van-cell>
        <van-cell :border="false" title="实付金额">
          <Rmb />
          {{ refund.master_order?.amount_actual }}
        </van-cell>
      </van-cell-group>
    </div>
    <van-cell title="应退金额">
      <Rmb />
      {{ refund.refund_total }}
    </van-cell>

    <div class=" font-bold flex gap-20px   p-28px">
      <div>
        <img :src="sku.img" alt="" class="b-rd-10px h-248px w-170px object-cover">
      </div>
      <div class="flex flex-1 shrink-0 ml-a flex-col justify-between ">
        <div>
          <div class="text-white">{{ event.name }}</div>
        </div>
        <div class="text-#666666 text-26px">
          <div>{{ getCityByCode(event.city) }} | {{ event.address_detail }}</div>
          <div>
            {{ sku.use_date }}
          </div>
        </div>
      </div>

    </div>
    <van-divider hairline></van-divider>
    <div class="">
      <van-cell-group :border="false">
        <van-cell :border="false" title="订单编号">{{ refund.master_order?.no }}
          <template #right-icon>
            <van-icon class="right-icon" class-prefix="sylf-icon" name="file-copy" size="14"
                      @click.stop="onCopy(refund.master_order?.no)" />
          </template>
        </van-cell>
        <van-cell :border="false" title="支付方式">{{ PAY_TYPE_TEXT[refund.master_order?.pay_type] }}
        </van-cell>
        <van-cell :border="false" title="交易单号">{{ refund.master_order?.pay_id }}</van-cell>
        <van-cell :border="false" title="下单时间">{{ refund.master_order?.created_at }}</van-cell>
        <van-cell :border="false" title="支付时间">{{ refund.master_order?.pay_at }}</van-cell>
      </van-cell-group>
    </div>
    <van-submit-bar
      v-if="canCancel"
      button-text="取消退款"
      button-color="var(--theme-gradual-btn)"
      placeholder
      style="--van-submit-bar-text-color:white;--van-submit-bar-background:var(--theme-bar)"
      text-align="left"
      @submit="onSubmit" />
  </div>
</template>

<style lang="less" scoped>
.button {
  border-radius: 55px;
  padding: 16px 42px;
  border: 2px solid var(--theme-deep-gold);
  color: var(--theme-deep-gold);
}

:deep(.van-step__circle-container), :deep(.van-step__line) {
  top: 80px;
}
</style>
