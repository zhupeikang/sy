<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import PlanList from '@/components/PlanList.vue';
import TopicList from '@/components/TopicList.vue';
import { PlanDisplayType, TopicDisplayType } from '@/types';
import { getPlanListApi } from '@/api/plan';
import { getHomeTopicListApi, getPlanType } from '@/api/home';
import { track } from '@/utils';

const router = useRouter();
const activeIndex = ref(0)
const planTypeList = ref<{
  id: number,
  name: string
}[]>([]);
const planTypeLoad = () => {
  getPlanType().then(res => {
    planTypeList.value = res.data.data;
  });
};
const selectPlanType=computed(()=>{
  if (planTypeList.value.length==0) return 0;
  return planTypeList.value[activeIndex.value].id
})
const tabActive = ref('recommend');
watch(() => tabActive.value, () => {
  if (tabActive.value == 'topic' || tabActive.value == 'plan') {
    track('home', {
      action: tabActive.value,
    });
  }
});
watch(() => selectPlanType.value, () => {
  if (tabActive.value == 'recommend') {
    recommendList.value = [];
    recommendFinished.value = false;
    recommendLoad();
  } else if (tabActive.value == 'plan') {
    planList.value = [];
    planFinished.value = false;
    planLoad();
  }

});
const toSearch = () => {
  track('home', {
    action: 'search',
  });
  router.push('/search');
};
const clickTab = () => {
  console.log(tabActive.value);
};

onBeforeMount(() => {
  planTypeLoad();
});
const limit = 20;
//推荐
const recommendList = ref<PlanDisplayType[]>([]);
const recommendLoading = ref(false);
const recommendFinished = ref(false);
const recommendError = ref(false);
const recommendErrorText = ref('');
const recommendLoad =  () => {
  if (recommendLoading.value) {
    return;
  }
  recommendLoading.value = true;
  getPlanListApi({
    skip: recommendList.value.length,
    limit,
    recommend: 'Y',
    showError: true,
    type_id: selectPlanType.value
  })
    .then(res => {
      if (res.code != 200) {
        recommendError.value = true;
        recommendErrorText.value = res.msg;
        return;
      }
      if (res.data.list.length < limit) {
        recommendFinished.value = true;
      }
      if (res.data.list.length > 0) {
        recommendList.value = recommendList.value.concat(res.data.list);
      }
    })
    .catch(err => {
      recommendError.value = true;
      recommendErrorText.value = err.message;
    })
    .finally(() => recommendLoading.value = false);
};
//全部
const planList = ref<PlanDisplayType[]>([]);
const planLoading = ref(false);
const planFinished = ref(false);
const planError = ref(false);
const planErrorText = ref('');
const planLoad = () => {
  if (planLoading.value) {
    return;
  }
  planLoading.value = true;
  getPlanListApi({
    skip: planList.value.length,
    limit,
    showError: true,
    type_id: selectPlanType.value

  })
    .then(res => {
      if (res.code != 200) {
        planError.value = true;
        planErrorText.value = res.msg;
        return;
      }
      if (res.data.list.length < limit) {
        planFinished.value = true;
      }
      if (res.data.list.length > 0) {
        planList.value = planList.value.concat(res.data.list);
      }
    })
    .catch(err => {
      planError.value = true;
      planErrorText.value = err.message;
    })
    .finally(() => planLoading.value = false);
  console.log('planLoading');
};
//系列
const topicList = ref<TopicDisplayType[]>([]);
const topicLoading = ref(false);
const topicFinished = ref(false);
const topicError = ref(false);
const topicErrorText = ref('');
const topicLoad = () => {
  if (topicLoading.value) {
    return;
  }
  topicLoading.value = true;
  getHomeTopicListApi({
    skip: topicList.value.length,
    limit,
    showError: true,
  })
    .then(res => {
      if (res.code != 200) {
        topicError.value = true;
        topicErrorText.value = res.msg;
        return;
      }
      if (res.data.list.length < limit) {
        topicFinished.value = true;
      }
      if (res.data.list.length > 0) {
        topicList.value = topicList.value.concat(res.data.list);
      }
    })
    .catch(err => {
      topicError.value = true;
      topicErrorText.value = err.message;
    })
    .finally(() => topicLoading.value = false);
  console.log('topicLoad');
};
</script>
<template>
  <div class="content">
    <van-search class="search ignore-search" disabled placeholder="搜索" @click="toSearch" />
    <van-tabs v-model:active="tabActive" class="ignore-tabs" lazy-render shrink>
      <van-tab name="recommend" title="推荐">
        <div class="flex gap-20px margin">
          <div @click="()=>activeIndex=index" :class="activeIndex===index?'tag-active':''" class="shadow-gold p-x-10px p-y-6px  text-center" v-for="(item,index) in planTypeList" :key="item.id">
            {{ item.name }}
          </div>
        </div>
        <van-list v-model:error="recommendError" :error-text="recommendErrorText" :finished="recommendFinished"
                  :loading="recommendLoading" finished-text="没有更多推荐了" @load="recommendLoad">
          <PlanList :data-list="recommendList" />
        </van-list>
      </van-tab>
      <van-tab name="topic" title="品牌">
        <van-list v-model:error="topicError" :error-text="topicErrorText" :finished="topicFinished" :loading="topicLoading"
                  finished-text="没有更多品牌了" @load="topicLoad">
          <TopicList :data-list="topicList" />
        </van-list>
      </van-tab>
      <van-tab name="plan" title="全部">
        <div class="flex gap-20px margin">
          <div @click="()=>activeIndex=index" :class="activeIndex===index?'tag-active':''" class="shadow-gold p-x-10px p-y-6px  text-center" v-for="(item,index) in planTypeList" :key="item.id">
            {{ item.name }}
          </div>
        </div>

        <van-list v-model:error="planError" :error-text="planErrorText" :finished="planFinished" :loading="planLoading"
                  finished-text="没有更多了" @load="planLoad">
          <PlanList :data-list="planList" />
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<style lang="less" scoped>
.content {
  padding-top: 20px;
  position: relative;

  .ignore-tabs {
    --van-tabs-nav-background: transparent;
  }

  .search {
    position: absolute;
    right: 0px;
    top: 0;
    z-index: 99;
    padding: 0;
    width: 300px;
  }

  .ignore-search {
    top: 15px;
    right: 16px;
    border-radius: 34px;

    :deep(.van-search__content) {
      border-radius: 34px;
    }
  }
}
</style>
