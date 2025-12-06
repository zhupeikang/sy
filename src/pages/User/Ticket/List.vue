<script lang="ts" setup>

import NavBar from '@/components/NavBar.vue';
import { ref } from 'vue';
import { getOrderList } from '@/api/ticket';
import { Datum } from '@/types/ticket';
import Rmb from '@/components/Rmb.vue';

import type { ListInstance } from 'vant';
import router from '@/router';
import { OrderStatus, OrderStatusText } from '@/types';
import { it } from 'node:test';

const list = ref<Datum[]>([]);

const loading = ref(false);
const finished = ref(false);
const pageParams = ref({
  page: 1,
  size: 10, status: undefined,

});
const onLoad = () => {
  getOrderList(
    pageParams.value,
  ).then((res) => {
    loading.value = false;
    const { data, current_page, last_page } = res.data;
    list.value = list.value.concat(data);
    if (current_page == last_page) {
      finished.value = true;
    } else if (current_page < last_page) {
      pageParams.value.page += 1;
    }
  }).catch(() => {
    loading.value = false;
    finished.value = true;
  });
};
const listRef = ref<ListInstance>();

const refresh = () => {
  pageParams.value.page = 1;
  list.value = [];
  listRef.value?.check();
};
const goDetail = (v: any) => {
  router.push({
    path: '/user/ticket/' + v.master_order.no,
  });
};
const tabActive = ref('all');
const tabs = ref([
  {
    title: '全部',
    name: 'all',
  },
  {
    title: '锁票中',
    name: OrderStatus.MASTER_ORDER_STATUS_ORDERED,
  },
  {
    title: '待支付',
    name: OrderStatus.MASTER_ORDER_STATUS_WAIT_PAY,
  },
  {
    title: '已支付',
    name: OrderStatus.MASTER_ORDER_STATUS_PAYED,
  },
  // {
  //   title: '待发货',
  //   name: OrderStatus.MASTER_ORDER_STATUS_WAIT_SEND,
  // },
  // {
  //   title: '已发货',
  //   name: OrderStatus.MASTER_ORDER_STATUS_SEND,
  // },
  {
    title: '已完成',
    name: OrderStatus.MASTER_ORDER_STATUS_FINISH,
  },
  {
    title: '已取消',
    name: OrderStatus.MASTER_ORDER_CANCELED,
  },
  // {
  //   title: '支付失败',
  //   name: OrderStatus.MASTER_ORDER_PAY_FAILED,
  // },
  {
    title: '全额退款',
    name: OrderStatus.MASTER_ORDER_STATUS_REFUND,
  },

]);
const clickTab = (v: any) => {
  pageParams.value.page = 1;
  list.value = [];
  console.log(v);
  if (v.name === 'all') {
    delete pageParams.value.status;
  } else {
    pageParams.value.status = [v.name];
  }
  console.log(pageParams.value);
  onLoad();
};
</script>

<template>
  <NavBar title="我的门票">
    <template #right>
      <van-icon name="replay" @click="refresh" />
    </template>
  </NavBar>
  <div class="">
    <van-tabs v-model:active="tabActive" class="ignore-tabs" lazy-render @click-tab="clickTab">
      <van-tab v-for="(item,index) in tabs" :key="index" :name="item.name" :title="item.title">
      </van-tab>
      <van-list
        class="mt-20px p-x-15px"
        ref="listRef"
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="(item,index) in list" :key="index" class="mb-28px">
          <div class="bg border-1px">
            <div class="p-22px flex justify-between border-b-1px">
              <div>
                {{ item.event.type?.name }}
              </div>
              <div>
                <van-icon name="arrow" @click="goDetail(item)" />
              </div>
            </div>
            <div class="flex p-32px bg-black  ">
              <div>
                <img :src="item.sku?.img" alt="" class="b-rd-10px h-240px w-180px" style="object-fit: cover">
              </div>
              <div class="flex ml-40px flex-col justify-between">
                <div>
                  {{ item.event?.name }}
                </div>
                <div class="text-#666666">
                  场次： {{ item.sku?.use_date }}
                </div>
              </div>
            </div>
            <div class="p-22px text-right font-bold">
              {{ item.ticket_count }}张票 <span>合计 </span><span class="text-deep-gold"><Rmb></Rmb>{{ item.master_order.amount_actual }}</span>
            </div>
          </div>
        </div>
      </van-list>

    </van-tabs>

  </div>

</template>

<style lang="less" scoped>

</style>
