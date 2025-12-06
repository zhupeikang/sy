<script setup lang="ts" name="PlanDetail">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ActivityType, PlanItemType, PlanType, RightsDisplayType, UserDisplayType } from '@/types';
import { getPlanApi } from '@/api/plan';
import Error from '@/components/Error.vue';
import Loading from '@/components/Loading.vue';
import { useEventListener } from '@vant/use';
import BottomNav from './components/BottomNav.vue';
import { useDictStore } from '@/store/Dict';
import { amountFormatter } from '@/utils';
import NavBar from '@/components/NavBar.vue';
import AssetMain from '@/components/AssetMain.vue';
import router from '@/router';
import AssetRights from '@/components/AssetRights.vue';
import Share from '@/components/Share.vue';
import { useConfigStore } from '@/store/Config';
import Tag from '@/components/Tag.vue';

const config = useConfigStore();
const route = useRoute();
const active = ref(0);
const contractActive = ref(0);
const tabOpacity = ref(0);
//处理错误
const errorShow = ref(false);
const errorText = ref('');
//3D模型
const showModel = ref(false);

const user = ref<UserDisplayType>();
const rights = ref<RightsDisplayType[]>();
const activities = ref<ActivityType[]>([]);
const plan = ref<PlanType>();
const children = ref<PlanItemType[]>([]);
const loading = ref(true);
const shareUrl = ref(window.location.origin + route.path);
watch(
  () => route.params.plan_no,
  (newData) => {
    if (!newData) return;
    loading.value = true;
    errorShow.value = false;
    errorText.value = '';
    showModel.value = false;
    plan.value = undefined;
    children.value = [];
    rights.value = [];
    activities.value = [];
    user.value = undefined;
    getPlanApi({
      plan_no: newData,
      showError: true,
    })
      .then(res => {
        loading.value = false;
        if (res.code != 200) {
          errorShow.value = true;
          errorText.value = res.msg;
          return;
        }
        shareUrl.value = window.location.origin + route.path;
        plan.value = res.data.plan;
        children.value = res.data.children;
        rights.value = res.data.rights;
        user.value = res.data.user;
        activities.value = res.data.activities;
      })
      .catch(e => {
        loading.value = false;
        console.error(e);
        errorShow.value = true;
        errorText.value = '发生了错误' + e.message;
      });
  },
  {
    deep: true,
    immediate: true,
  },
);
useEventListener('scroll', () => {
  tabOpacity.value = window.scrollY > window.innerWidth ? 1 : window.scrollY / window.innerWidth;
}, {
  capture: true,
});
const showShare = ref(false);

const dict = useDictStore();
</script>
<template>
  <Error :text="errorText" :show="errorShow" />
  <Loading mask v-if="loading" />
  <!--加载后-->
  <div v-else>
    <!-- <Model v-if="showModel" :modelFileName="plan?.model_url" :scale="plan?.model_scale" @close="showModel = false" /> -->
    <NavBar :title="tabOpacity >= 1 ? plan?.subject : ''">
      <template #right>
        <div class="ignore-share" @click="showShare = true"></div>
      </template>
    </NavBar>

    <Share v-model:show="showShare" :url="shareUrl" :name="plan?.subject" :img="plan?.main_url"
           v-if="plan?.extends == 'kingnetfamily'" :background="config?.getConfig('share_kf')">
      <template #content>
        <div>
          KINGNET FAMILY x 拾元立方
        </div>
        <div>
          {{ plan?.subject }}
        </div>
        <Tag title="限量" :value="plan?.total_supply + '份'" />
      </template>
    </Share>
    <Share v-model:show="showShare" :url="shareUrl" :name="plan?.subject" :img="plan?.main_url" v-else>
      <template #content>

        <div>
          {{ plan?.subject }}
        </div>
        <Tag title="限量" :value="plan?.total_supply + '份'" />
      </template>
    </Share>
    <van-tabs v-model:active="active" scrollspy sticky :style="{
            '--tab-opacity': tabOpacity
        }" class="top-tabs ignore-tabs" offset-top="46">
      <van-tab title="资产">
        <asset-main  :title="plan?.subject" :img="plan?.main_url" :limit="plan?.total_supply" />
        <div class="flex justify-between bg-gradual-cell margin radius padding shadow-gold text-default">
          <div>套餐参数：</div>
          <div>{{ plan?.type == 'blind' ? '盲盒' : '组合' }}套餐</div>
          <div>{{ plan?.limits == 0 ? '不限购' : `每人限购${plan?.limits}份` }}</div>
        </div>
        <div v-if="plan.pre_contracts.length"
             class="flex justify-between  margin radius padding shadow-gold text-default">
          <div>1:点击下方：立即验证</div>
          <div>2:选择验证资产</div>
          <div>3:领取/购买</div>
        </div>
        <van-tabs v-model:active="contractActive" shrink animated class="contractList">
          <van-tab v-for="(item, index) in children" :title="item.contract.name" :key="index.toString()">
            <div class="bg-gradual-cell margin shadow-gold">
              <div class="contract flex justify-between align-center ">
                <div class="cover" :style="{
                                    backgroundImage: `url(${item.contract.cover_url})`
                                }" @click="router.push('/contract/' + item.contract.contract_no)"></div>
                <div class="info text-sm">
                  <div>资产价值：<span>{{ amountFormatter(item.contract.amount / 100) }}</span></div>
                  <div>发行数量：<span>{{ item.contract.total_supply }}份</span></div>
                  <div>发行商/作者：<span>{{ item.contract.user.nickname }}</span>/<span>{{ item.contract.author
                    }}</span></div>
                  <div>可否转赠：<span>{{ item.contract.transfer_flag == 'Y' ? '可转赠' : '不可转赠' }}</span></div>
                  <div>合约平台：<span>{{ item.contract.platform }}</span></div>
                  <div v-if="item.contract.is_trade">
                    可否交易：<span>{{ item.contract.is_trade === 'Y' ? '可交易' : '不可交易' }}</span></div>
                  <div class="van-ellipsis">合约地址：<span>{{ item.contract.chain_contract_id }}</span></div>
                  <div v-if="plan?.type == 'blind'">获得概率：<span>{{ item.value }}%</span></div>
                  <div v-else-if="plan?.type == 'normal'">获得数量：<span>{{ item.value }}份</span></div>
                </div>
              </div>
              <AssetRights :s="item.rights?.findIndex(n => n.tag == 'S') >= 0"
                           :x="item.rights?.findIndex(n => n.tag == 'X') >= 0"
                           :a="item.rights?.findIndex(n => n.tag == 'A') >= 0"
                           :u="item.rights?.findIndex(n => n.tag == 'U') >= 0"
                           :is-conflux="item.contract.is_con_flux"
              />
            </div>
          </van-tab>
        </van-tabs>

        <!-- <User :data="user" /> -->
      </van-tab>
      <van-tab v-for="tab in plan?.htmls" :key="tab" :title="dict.getDictLabel('plan_html', tab)">
        <div v-html="plan?.activity_html" v-if="tab == 'activity'" class="html"></div>
        <div v-html="plan?.desc_html" v-else-if="tab == 'desc'" class="html"></div>
        <div v-html="plan?.agree_html" v-else-if="tab == 'agree'" class="html"></div>
        <div v-html="plan?.rights_html" v-else-if="tab == 'rights'" class="html"></div>
      </van-tab>
    </van-tabs>
    <BottomNav :data="plan" />

  </div>
</template>
<style scoped lang="less">
.top-tabs {
  --van-tabs-nav-background: var(--theme-bar);

  :deep(.van-sticky) {
    width: 750px;
    position: fixed;
    z-index: var(--van-sticky-z-index);
    opacity: var(--tab-opacity);

    .van-tabs__content {
      font-size: 0px;
    }
  }
}

.contractList {
  --van-tabs-nav-background: transparent;

  :deep(.van-tabs__nav) {
    margin: 0;
  }

  .contract {
    .cover {
      width: 250px;
      height: 250px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  .info {
    width: 430px;
  }
}

.html {
  :deep(img) {
    max-width: 100%;
  }

  :deep(img) {
    max-width: 100%;
  }
}

.desc_img {
  max-width: 100%;
}
</style>
