<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { getPlanListApi } from '@/api/plan';
import { h, ref } from 'vue';
import Tag from '@/components/Tag.vue';
import { CountDown } from 'vant';
import { toFixed } from '@/utils';
import router from '@/router';
import Render from '@/components/Render';

const dataList = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const getDataList = () => {
  if (loading.value) return;
  loading.value = true;
  getPlanListApi({
    skip: 0,
    limit: 100,
    pre: 'Y',
    showError: true,
  })
    .then(res => {
      dataList.value = res.data.list;
      finished.value = true;
      loading.value = false;
    }).finally(() => {
    loading.value = false;
    refreshing.value = false;
  });
};

const onRefresh = () => {
  finished.value = false;
  dataList.value = [];
  getDataList();
};
const onLoad = () => {
  getDataList();
};
onLoad();
const goDetail = (item: any) => {
  router.push({
    name: 'PlanDetail',
    params: {
      plan_no: item.plan_no,
    },
  });

};
// 如果begin_at>当前时间戳（秒级） 显示 距离开始还剩
// 如果end_at-86400*7<当前时间戳<end_at 显示 距离结束还剩
// 如果end_at<当前时间戳 显示 已结束
// 其余条件 显示 火热抢购中

const getContent = (item: any) => {
  // 获取当前时间戳（秒级）
  const now = new Date().getTime() / 1000;
  if (item.begin_at > now) {
    return h('div', [
      h('div', { style: 'display:flex;align-items:center' }, [
        h('div', { style: { 'margin-right': '4px' } }, '距离开始还剩'),
        h(CountDown, {
          time: (item.begin_at - now) * 1000,
        }, {
          default: (timeData: { days: string; hours: string; minutes: string; seconds: string; }) => [
            h('span', { style: { 'margin-right': '4px' }, class: 'block' }, timeData.days + ' 天'),
            h('span', { style: { 'margin-right': '4px' }, class: 'block' }, timeData.hours + ' 小时'),
            h('span', { style: { 'margin-right': '4px' }, class: 'block' }, timeData.minutes + ' 分'),
            h('span', { style: { 'margin-right': '4px' }, class: 'block' }, timeData.seconds + ' 秒'),
          ],
        }),
      ]),

    ]);
  } else if (item.end_at - 86400 * 7 < now && now < item.end_at) {
    return h('div', [
      h('div', { style: 'display:flex;align-items:center' }, [
        h('div', { style: { 'margin-right': '4px' } }, '距离结束还剩'),
        h(CountDown, {
            time: (item.end_at - now) * 1000,
          }, {
            default: (timeData: { days: string; hours: string; minutes: string; seconds: string; }) => [
              h('span', { style: { 'margin-right': '4px' }, class: 'block' }, timeData.days + ' 天'),
              h('span', { style: { 'margin-right': '4px' }, class: 'block' }, timeData.hours + ' 小时'),
              h('span', { style: { 'margin-right': '4px' }, class: 'block' }, timeData.minutes + ' 分'),
              h('span', { style: { 'margin-right': '4px' }, class: 'block' }, timeData.seconds + ' 秒'),
            ],
          },
        ),
      ]),
    ]);
  } else if (item.end_at < now) {
    return h('div', '已结束');
  } else {
    return h('div', '火热抢购中');
  }

};

</script>

<template>
  <NavBar title="优先购" />
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="info" v-for="(item,index) in dataList" :key="index">
        <van-card
          @click="goDetail(item)"
          class="card"
          :thumb="item.cover_url"
        >
          <template #title>
            <div class="van-multi-ellipsis--l2  " style="margin: 0;font-size: 18px">{{ item?.subject }}</div>
            <Tag :title="item?.limits?'限购':'不限购'" show-unit :show-value="item?.limits" :value="item?.limits" />
          </template>
          <template #desc>
            <div class="flex co" style="width: 85%;margin-top: 8px">
              <div class="left">
                <div class="content text-center">
                  {{ item.pre_text }}
                </div>
              </div>
              <div class="right">
                <div class="content text-center">
                  <div style="display:flex;justify-content: center">
                    <!--                    <Price :value="item?.price / 100" />-->
                    <div>
                      <span style="color: black">&#165; </span>
                      <span style="color: black">{{ toFixed(item?.price / 100, 2) }}</span>
                    </div>
                    <div>
                      <div class="van-card__origin-price">
                        <span class="unit">&#165;</span>
                        <span>
                         {{ toFixed(item?.orig_price / 100, 2) }}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <render :render="getContent(item)"></render>
          </template>
          <template #tag>

          </template>
        </van-card>
        <!--        <div class="text-center" style="background: var(&#45;&#45;van-card-background); ">-->
        <!--          <render :render="getContent(item)"></render>-->
        <!--        </div>-->
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped lang="less">
.card {
  color: var(--theme-gold);
  font-size: 28px;
  --van-card-price-color: var(--theme-gold);

  --van-card-thumb-size: 200px;
}

.block {
  display: inline-block;
  color: #fff;
  text-align: center;
}

.colon {
  display: inline-block;
  margin: 0 4px;
  color: var(--theme-gold);
}

.co{
  background: linear-gradient(45deg, white,wheat );
  border-radius: 6px;

}
.left {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  color: black;
  border-right: 1px solid #dddddd;
  //border-bottom-left-radius: 12px;
  //border-top-left-radius: 12px;
  //border: none;
  //background: linear-gradient(45deg, whitesmoke,var(--theme-gold) );
  //background: whitesmoke;

}

.right {
  flex: 1;
  flex-shrink: 0;
  //border: none;
  //border-bottom-right-radius: 12px;
  //border-top-right-radius: 12px;
  display: flex;
  align-items: center;
  //background:ghostwhite;
  //background: linear-gradient(45deg, var(--theme-gold), whitesmoke);
}

.content {
  font-size: 28px;
  flex: 1;
  font-weight: bolder;
}


</style>
