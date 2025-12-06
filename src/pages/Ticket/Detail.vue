<script lang="ts" setup>

import NavBar from '@/components/NavBar.vue';
import { computed, ref, watch } from 'vue';
import router from '@/router';
import { getTicketDetail } from '@/api/ticket';
import { getCityByCode } from '../../utils';
import Bottom from '@/pages/Ticket/components/Bottom.vue';

const detail = ref<any>({});
const getDetail = (id: string) => {
  getTicketDetail({
    id,
  }).then(res => {
    detail.value = res.data;
  });
};
// 筛选出票务分类，剔除重复
const cateTicket = computed(() => {
  return detail.value.sku?.map((item: any) => item.ticket_cate).filter((item: any, index: number, arr: any) => arr.indexOf(item) === index);
});

// 筛选出票务种类中sale_begin_at最早的和价格最低的（price）信息组合起来
const sku = computed(() => {
  return cateTicket.value?.map((item: any) => {
    const sku = detail.value.sku.filter((v: any) => v.ticket_cate === item);
    const sale_begin_at = sku.reduce((prev: any, current: any) => {
      return prev.sale_begin_at < current.sale_begin_at ? prev : current;
    });
    const price = sku.reduce((prev: any, current: any) => {
      return prev.price < current.price ? prev : current;
    });
    return {
      ticket_cate: item,
      //去除时分秒
      sale_begin_at: sale_begin_at.sale_begin_at,
      price: price.price,
    };
  });
});


// 查询路由参数
watch(() => router.currentRoute.value.params, (params: any) => {
  if (params.id) {
    getDetail(params.id);
  }
}, {
  immediate: true,
});

const tabs = ref([
  {
    id: 'desc',
    name: '活动介绍',
  },
  {
    id: 'info',
    name: '票务说明',
  },
  {
    id: 'activity',
    name: '活动信息',
  },
  {
    id: 'know',
    name: '观演须知',
  },

]);
const active = ref(0);
const changeTab = (index: number) => {
  active.value = index;
//   跳转到锚点
  const id = tabs.value[index].id;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

};


</script>

<template>
  <NavBar title="活动详情" />
  <div class="p-15px">
    <div class="bg-gradient-to-r text-30px b-rd-20x text-white  from-#232322  to-#36332D p-20px">
      <div class="text-34px text-white">
        <span  v-if="detail?.type">【{{ detail?.type?.name }}】</span>{{ detail.name }}
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
    </div>
    <van-sticky :offset-top="46">
      <div class="flex bg-black  justify-between items-center p-18px">
        <div v-for="(item,index) in tabs" :class="{'tab':index===active}" @click="changeTab(index)">
          {{ item.name }}
        </div>
      </div>
    </van-sticky>
    <div class="p-18px">
      <div id="desc">
        <img v-for="(item,index) in detail.details" :src="item" alt="" width="100%">
      </div>
      <div id="info" class=" p-28px  bg">
        <div class="text-#DBB985 text-41px ">票务说明</div>
        <van-divider />
        <div v-for="(v,k) in sku" :key="k">
          <div class="flex justify-between items-end ">
            <div class="">
              <div>
                {{ v.ticket_cate }}
              </div>
              <div class="text-28px">
                开票时间：{{ v.sale_begin_at }}
              </div>
            </div>
            <div class="linear  p-10px  b-rd-40px text-#1F1F1F">￥{{ v?.price }} 起</div>
          </div>
          <van-divider />
        </div>
      </div>
      <div id="activity" class=" mt-18px p-28px  bg">
        <div class="text-#DBB985 text-41px ">活动信息</div>
        <van-divider />
        <div class="flex justify-between item">
          <div class="w-150px shrink-0 item-title">活动日期</div>
          <div class="flex-1 item-value">{{ detail.date_begin_at }}
            {{ detail.time_begin_at }}-{{ detail.date_begin_at }} {{ detail.time_end_at }}
          </div>
        </div>
        <div class="flex justify-between item">
          <div class="w-150px shrink-0 item-title">场馆地址</div>
          <div class="flex-1 item-value">{{ getCityByCode(detail.city) }}
            {{ detail.address }} {{ detail.address_detail }}
          </div>
        </div>
        <div class="flex justify-between item">
          <div class="w-150px shrink-0 item-title">入场说明</div>
          <div class="flex-1 item-value">{{detail.ticket_detail?.enter_info}}
          </div>
        </div>
<!--        <div v-for="(v,k) in detail?.ticket_detail?.ticket_detail" :key="k" class="flex justify-between item">-->
<!--          <div class="w-150px shrink-0 item-title">{{ v.name }}</div>-->
<!--          <div class="flex-1 item-value">{{ v.value }}</div>-->
<!--        </div>-->
      </div>
      <div id="know" class=" mt-18px p-28px  bg">
        <div class="text-#DBB985 text-41px ">购票观影须知</div>
        <van-divider />
        <div class="grid! grid-cols-1 gap-4 text-26px">
          <div v-for="(item,index) in detail?.ticket_detail?.ticket_detail">
            <div>
              {{ item.name }}
            </div>
            <div class="text-#666666">
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <Bottom :data="detail" />
</template>

<style lang="less" scoped>
.tab {
  font-size: 29px;
  padding: 7px 10px;
  background: var(--theme-gradual-gold);
  border-radius: 5px;
  color: var(--black);
}

#activity {
  .item {
    padding: 20px 0;

    :last-child {
      border-bottom: none;
    }

    .item-title, .item-value {
      font-size: 26px;
    }
  }
}

</style>
