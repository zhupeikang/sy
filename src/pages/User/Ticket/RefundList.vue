<script lang="ts" setup>

import NavBar from '@/components/NavBar.vue';
import { ref } from 'vue';
import { getOrderRefundList } from '@/api/ticket';
import { Datum } from '@/types/ticket';
import Rmb from '@/components/Rmb.vue';

import type { ListInstance } from 'vant';
import router from '@/router';
import { RefundStatusText } from '../../../types';

const list = ref<Datum[]>([]);

const loading = ref(false);
const finished = ref(false);
const pageParams = ref({
  page: 1,
  size: 10,
});
const onLoad = () => {
  getOrderRefundList(
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

const refresh=()=>{
  console.log(listRef.value);
  pageParams.value.page = 1;
  list.value=[]
  if (!listRef.value?.check()){
    onLoad()
  }
}
const goDetail=(v:any)=>{
  router.push({
    path:'/user/ticket/refund/'+v.no+'/detail'
  })
}

</script>

<template>
  <NavBar title="我的退款">
    <template #right>
      <van-icon @click="refresh" name="replay" />
    </template>
  </NavBar>
  <div class="p-15px">
    <van-list
      ref="listRef"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="(item,index) in list" :key="index"  class="mb-20px">
          <div class="bg " >
            <div class="p-22px flex justify-between">
              <div>
                {{item.event.name}}
              </div>
              <div>
                <van-icon @click="goDetail(item)" name="arrow" />
              </div>
            </div>
            <div class="flex p-32px bg-black ">
              <div>
                <img class="b-rd-10px h-248px w-170px" :src="item.sku.img" style="object-fit: cover" alt="">
              </div>
              <div class="flex ml-40px flex-col ">
                <div>
                  {{item.sku.ticket_cate}}
                </div>
                <div>
                  数量:{{item.order_count}}
                </div>
              </div>
            </div>
            <div class="p-22px flex justify-between  font-bold">
              <div>退款总额：<span class="text-deep-gold"><Rmb></Rmb>{{item.refund_total}}</span></div>
              <div>退款进度：{{RefundStatusText[item.status]}}</div>
            </div>
          </div>
      </div>
    </van-list>
  </div>

</template>

<style lang="less" scoped>

</style>
