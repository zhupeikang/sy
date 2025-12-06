<script lang="ts" setup>

import { ref, useAttrs } from 'vue';
import { OrderStatus } from '@/types';
import { getNft } from '@/api/ticket';
import { showToast } from 'vant';


const props = defineProps({
  item: {
    type: Object,
    default: () => {
    },
  },
  event: {
    type: Object,
    default: () => {
    },
  },
  sku: {
    type: Object,
    default: () => {
    },
  },
  masterOrder: {
    type: Object,
    default: () => {
    },
  },
});
const emits = defineEmits(['showCode','getFinish']);
const show = () => {
  emits('showCode', props.item);
};
const showCode = ref(false);
const attrs = useAttrs();
const reward = (e) => {
  getNft({
    no: e.no,
  }).then(r => {
    if (r.code === 200) {
      showToast('领取成功');
      emits('getFinish',props.masterOrder.no)
    }
  });
};
</script>

<template>
  <div>
    <van-cell-group :border="false">
      <van-cell icon="qr" is-link label="在检票口出示该信息" title="查看电子票信息" @click="show">
        <template #right-icon>
          <img alt="" src="@/assets/imgs/v3/click.png" style="object-fit: contain">
        </template>
      </van-cell>
      <van-cell :label="item.ticket.real_bind.card_name"
                :value="item.ticket.real_bind.mobile"
                icon="phone-o"
                title="联系人">
      </van-cell>

      <van-cell v-if="masterOrder.status===OrderStatus.MASTER_ORDER_STATUS_FINISH"
                label="说明：该数字资产纪念章可用于下一次该主办方活动折扣"
                title="领取我的折扣权益数字资产">
        <template v-if="sku.nft_plan_id!==0" #right-icon>
          <van-button :disabled="!!item.plan_get_at" class="w-100px" size="mini" type="primary" @click="reward(item)">
            {{ item.plan_get_at ? '已领取' : '领取' }}
          </van-button>
        </template>
      </van-cell>

      <div class="p-20px">
      </div>
    </van-cell-group>
    <!--    <van-popup teleport="body" round v-model:show="showCode" :style="{height: '60%'}"  closeable position="bottom"  safe-area-inset-bottom >-->
    <!--      <div class="overflow-hidden h-full">-->
    <!--        <Qrcode v-bind="props" ></Qrcode>-->
    <!--      </div>-->
    <!--    </van-popup>-->

  </div>
</template>

<style lang="less" scoped>

</style>
