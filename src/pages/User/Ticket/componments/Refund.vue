<script lang="ts" setup>

import NavBar from '@/components/NavBar.vue';
import { computed, onBeforeUpdate, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getTicketOrderDetail, getTicketOrderRefund } from '@/api/ticket';
import Rmb from '@/components/Rmb.vue';
import { getCityByCode } from '@/utils';
import router from '@/router';

const route = useRoute();

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
const checked = ref([]);
const checkboxRefs = ref([]);
const toggle = (index) => {
  checkboxRefs.value[index].toggle();
};

const price = computed(() => {
  if (checked.value.length) {
    return checked.value.reduce((acc, curr) => acc + Number(curr.amount_actual), 0);
  }
  return 0;
});

onBeforeUpdate(() => {
  checkboxRefs.value = [];
});
const message = ref('');
const loading = ref(false);

function onSubmit() {
  if (loading.value) return;
  loading.value = true;
  getTicketOrderRefund({
    master_order_id: orderInfo.value.id,
    order_ids: checked.value.map(v => v.id),
    remark: message.value,
  }).then((r) => {
    if (r===undefined) return;
    if (r.data.id) {
      router.push({
        path:'/user/ticket/refund/'+r.data.no+'/detail'
      })
    }
  }).finally(() => {
    loading.value = false;
  });

}
</script>

<template>
  <div>
    <NavBar title="退款申请"></NavBar>
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
    <van-divider hairline></van-divider>
    <div class="p-28px">
      <van-checkbox-group v-model="checked">
        <van-cell-group :border="false" title="请选择子订单进行退款">
          <van-cell v-for="(item,index) in orderInfo.ticket_order"
                    :key="item.id"
                    :label="item.no"
                    :title="item.ticket.real_bind.card_name"
                    clickable
                    @click="toggle(index)">
            <template #right-icon>
              <van-checkbox
                :ref="el => checkboxRefs[index] = el"
                :name="item"
                @click.stop
              >
              </van-checkbox>
            </template>
            <template #label>
              <div>
                订单编号：{{ item.no }}
              </div>

              <div>
                实付金额：
                <Rmb></Rmb>
                {{ item.amount_actual }}
              </div>
            </template>
          </van-cell>
          <van-field
            v-model="message"
            autosize
            border
            label="留言"
            maxlength="50"
            placeholder="请输入留言"
            rows="3"
            show-word-limit
            type="textarea"
          />

        </van-cell-group>
      </van-checkbox-group>
    </div>
    <van-submit-bar :disabled="!checked.length"
                    :loading="loading"
                    placeholder
                    :price="price*100"
                    button-color="var(--theme-gradual-btn)"
                    button-text="申请退款"
                    style="--van-submit-bar-text-color:white;--van-submit-bar-background:var(--theme-bar)"
                    text-align="left"
                    @submit="onSubmit" />
  </div>
</template>

<style lang="less" scoped>

</style>
