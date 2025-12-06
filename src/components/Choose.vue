<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getPriorityAssetListApi } from '@/api/order';

interface RootObject {
  plan_id: number;
  plan_no: string;
  appid: number;
  subject: string;
  type: string;
  orig_price: number;
  price: number;
  total_supply: number;
  limits: number;
  status: string;
  cover_url: string;
  main_url: string;
  model_url: string;
  htmls: string[];
  activity_html: string;
  rights_html: string;
  desc_html: string;
  agree_html: string;
  begin_at: number;
  end_at: number;
  created_at: number;
  updated_at: number;
  profit_flag: string;
  extends: string;
  wepay_flag: string;
  pre_contracts: RootObjectPre_contracts[];
  pre_order: number;
  pre_text: string;
  favored: boolean;
  reminded: boolean;
}

interface RootObjectPre_contracts {
  name: string;
  cover_url: string;
  contract_no: string;
}

const show = ref(false);
const tabActive = ref();
// 资产列表
const assetList = ref([]);
const inited = ref(true);//是否初始化过
const initData = ref<RootObject>({
  plan_id: 0,
  plan_no: '',
  appid: 0,
  subject: '',
  type: '',
  orig_price: 0,
  price: 0,
  total_supply: 0,
  limits: 0,
  status: '',
  cover_url: '',
  main_url: '',
  model_url: '',
  htmls: [],
  activity_html: '',
  rights_html: '',
  desc_html: '',
  agree_html: '',
  begin_at: 0,
  end_at: 0,
  created_at: 0,
  updated_at: 0,
  profit_flag: '',
  extends: '',
  wepay_flag: '',
  pre_contracts: [],
  pre_order: 0,
  pre_text: '',
  favored: false,
  reminded: false,
});
const assetLoading = ref(false);
const assetFinished = ref(false);
const image = computed(() => {
  return initData.value.pre_contracts.find(i => i.contract_no == tabActive.value)?.cover_url;
});
const init = (params: RootObject) => {
  tabActive.value = params.pre_contracts[0].contract_no;
  initData.value = params;
  show.value = true;
  inited.value = true;
};
const selectItem = ref('');
defineExpose({
  init,
});
const limit = ref(10);


const getDataList = () => {
  assetLoading.value = true;
  getPriorityAssetListApi({
    plan_no: initData.value.plan_no,
    skip: assetList.value.length,
    limit: limit.value,
    contract_no: tabActive.value,
  }).then(res => {
    assetLoading.value = false;
    assetFinished.value = res.data.list.length < limit.value;
    if (res.data.list.length > 0) {
      assetList.value = assetList.value.concat(res.data.list);
    }
  });
};
// 监听tab切换
watch(
  () => tabActive.value,
  (newValue) => {
    if (newValue) {
      assetList.value = [];
      limit.value = 10;
      getDataList();
    }
  },
  {
    immediate: true,
  },
);
const emits = defineEmits(['chooseAssets']);
const setSelect = (item: any) => {
  if (item.status) return;

  if (selectItem.value == item.asset_no) {
    selectItem.value = '';
    return false;
  }
  selectItem.value = item.asset_no;
  emits('chooseAssets', item);

};
</script>

<template>
  <van-popup v-model:show="show" closeable position="bottom"  :style="{ height: '50%',overflow:'hidden'}">
    <van-nav-bar title="请选择资产进行验证" class="popup-nav-bar"/>
    <div style="height: 100%">
      <van-tabs lazy-render v-model:active="tabActive" shrink class="ignore-tabs">
        <van-tab :key="index" v-for="(item,index) in initData.pre_contracts" :title="item.name"
                 :name="item.contract_no"></van-tab>
      </van-tabs>
      <div style="padding: 10px 6px;height:90%;overflow: hidden">
        <div style="height: 100%;overflow:auto;">
          <van-list :offset="100" :immediate-check="false" @load="getDataList" :loading="assetLoading"
                    :finished="assetFinished" :finished-text="assetList.length===0?'您还未拥有此资产':'没有更多'">
            <van-grid :column-num="3" :border="false" class="grid" :icon-size="100">
              <van-grid-item @click="setSelect(item)"
                             :key="index"
                             :class="{'van-grid-item-active':selectItem===item.asset_no,'van-grid-item-disabled':item.status}"
                             v-for="(item,index) in assetList" :icon="image" :text="item.asset_no" />
            </van-grid>
          </van-list>
        </div>
      </div>


    </div>
  </van-popup>
</template>

<style scoped lang="less">
.ignore-tabs {
  --van-tabs-nav-background: transparent;
}

.grid {
  --van-grid-item-content-padding: 4px;

  .van-grid-item-active {
    border: 1px solid var(--theme-gold);
  }

  .van-grid-item-disabled {
    //  禁止点击
    pointer-events: none;
    opacity: 0.3;
  }
}
</style>
