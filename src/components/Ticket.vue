<template>
  <div class="item relative" @click="onClick">
    <div :style="{backgroundImage: `url(${item?.img})`}" class="cover"></div>
    <div class="p-x-28px p-y-24px bg-gradient-to-r from-#232322  to-#36332D ">
      <div class="flex justify-between items-start">
        <div class="text-34px text-white">
          {{ item.name }}
        </div>
        <div v-if="isNew" class="new text-27px p-x-10px b-rd-10px text-black shrink-0">新上架</div>
      </div>
      <div class="text-#666 mt-28px text-25px flex justify-between items-center">
        <div>
          <div>
            {{ item.date_begin_at }}-{{ item.date_end_at }}
          </div>
          <div>
            {{ getCityByCode(item.province)  }}|{{ item.address }}
          </div>
        </div>

        <div class="text-#DBB985 text-44px">
          <span v-if="isPreSale" class="m-r-28px text-white text-25px  p-x-12px p-y-6px bg-#080707">待开售</span>
          <span :class="isPreSale?'text-#666666':''">¥{{ item?.min_sku?.price }}</span>
          <span class="text-#666666 ml-1 text-29px">起</span>
        </div>
      </div>
    </div>
    <div class="absolute top-0 left-10px">
      <Tag :title="item.type?.name">
      </Tag>
    </div>
    <div class="absolute top-4px right-10px flex flex-col items-center ">
      <van-icon @click..stop="doFavor(item)" class="icon" color="wheat" :name="!item.favor_user?'like-o':'like'" size="24"></van-icon>
      <div >
        {{ item.favor_count }}
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import Tag from './Tag.vue';
import router from '@/router';
import { getCityByCode } from '@/utils';
import { favor } from '@/api/ticket';

// Props
const props = defineProps({
  item: {
    type: Object,
    default: () => [],
  },
});

// 跳转到计划详情
const onClick = () => {
  router.push({
    name: 'TicketDetail',
    params: {
      id: props.item.id,
    },
  });
};
const formatDate = (dateString: string) => {
  return dateString.replace(' ', 'T'); // 替换空格为 'T'，形成 ISO 8601 格式
};
// 计算时间差的工具函数
const calculateTimeDiffInHours = (startDate: string) => {
  const now = new Date();
  const start = new Date(formatDate(startDate)); // 格式化时间为标准的 ISO 格式
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60)); // 返回小时数
};

// 判断是否是新上架的
const isNew = computed(() => calculateTimeDiffInHours(props.item.created_at) <= 72);
// 判断是否是待开售状态
const isPreSale = computed(() => {
  if (props.item.early_sku?.sale_begin_at) {
    const saleBeginAtHoursDiff = calculateTimeDiffInHours(props.item.early_sku.sale_begin_at);
    return saleBeginAtHoursDiff < 0; // 如果销售开始时间晚于当前时间，则为待开售状态
  }
  return false; // 如果没有销售开始时间，默认为不处于待开售状态
});
// 获取活动分类

const doFavor=(e)=>{
  favor({
    type:'ticket',
    value:e.id
  }).then(r=>{
    if(r.code===200){
      if(r.data?.favor_id){
        e.favor_user=1
        e.favor_count+=1
      }else {
        e.favor_user=0
        e.favor_count-=1
      }
    }
  })
}
</script>

<style lang="less" scoped>
.item {
  cursor: pointer;
  display: block;
  box-sizing: border-box;
  border-radius: 10px;
  color: #fff;
  position: relative;
  //background-image: url(../assets/imgs/bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .cover {
    height: 370px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .new {
    background: var(--theme-gold);
  }

  .icon {
  }
}
</style>
