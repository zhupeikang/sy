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
const activeIndex = ref(null)
const planTypeList = ref<{
  id: number,
  value: number,
  label: string
}[]>([]);
const planTypeLoad = () => {
  getPlanType().then(res => {
    planTypeList.value = res.data;
  });
};

const tabActive = ref('recommend');
watch(() => tabActive.value, () => {
  if (tabActive.value == 'topic' || tabActive.value == 'plan') {
    track('home', {
      action: tabActive.value,
    });
  }
});
watch(activeIndex, (newVal, oldVal) => {
  if (tabActive.value === 'recommend') {
    recommendList.value = [];
    recommendFinished.value = false;
    currentRecommendPage.value = 1;
    recommendLoad();
  } else if (tabActive.value === 'plan') {
    planList.value = [];
    planFinished.value = false;
    currentPlanPage.value = 1;
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
const currentRecommendPage = ref(1);
const recommendLoad =  () => {

  recommendLoading.value = true;
  getPlanListApi({
    page: currentRecommendPage.value,
    size:30,
    recommend: 'Y',
    showError: true,
    type_id: activeIndex.value
  })
    .then(res => {
      if (res.code != 200) {
        recommendError.value = true;
        recommendErrorText.value = res.msg;
        return;
      }
      if (res.data.current_page >= res.data.last_page) {
        recommendFinished.value = true;
      }
      if (res.data.data.length > 0) {
        recommendList.value = recommendList.value.concat(res.data.data);
        currentRecommendPage.value += 1;
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
const currentPlanPage = ref(1);
const planLoad = () => {
  if (planLoading.value) {
    return;
  }
  planLoading.value = true;
  getPlanListApi({
    page: currentPlanPage.value,
    size:10,
    showError: true,
    type_id: activeIndex.value
  })
    .then(res => {
      if (res.code != 200) {
        planError.value = true;
        planErrorText.value = res.msg;
        return;
      }
      if (res.data.current_page >= res.data.last_page) {
        planFinished.value = true;
      }
      if (res.data.data.length > 0) {
        planList.value = planList.value.concat(res.data.data);
        currentPlanPage.value += 1;
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
};


</script>
<template>
  <div class="content">
    <van-search class="search ignore-search" disabled placeholder="搜索" @click="toSearch" />
    <van-tabs v-model:active="tabActive" class="ignore-tabs" lazy-render shrink>
      <div class="relative w-full overflow-x-auto"> <!-- -mx-2 只是为示例，让滚动条不被 padding 吃掉 -->
        <!-- 内层用 inline-flex 或 flex flex-nowrap + 子元素 shrink-0 -->
        <div class="flex gap-20px p-2 whitespace-nowrap">
          <div
            v-for="(item, index) in planTypeList"
            :key="item.value"
            @click="activeIndex = item.value"
            :class="activeIndex === item.value ? 'tag-active' : ''"
            class="text-center  shadow-gold p-x-16px p-y-12px min-w-150px text-center inline-block text-sm"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <van-tab name="recommend" title="推荐">
        <!-- 父容器必须是固定宽度或占满可视宽度，且允许横向滚动 -->



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
