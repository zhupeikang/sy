<script setup lang="ts" name="AssetDetail">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { AssetType, ContractType, PlanDisplayType, TransferType, UserType } from '@/types';
import Transfer from './components/Transfer.vue';
import Error from '@/components/Error.vue';
import Loading from '@/components/Loading.vue';
import { useEventListener } from '@vant/use';
import BottomNav from './components/BottomNav.vue';
import ReceiveNav from './components/ReceiveNav.vue';
import PlanList from '@/components/PlanList.vue';
import { amountFormatter, rpxToPx } from '@/utils';
import { getAssetDetailApi } from '@/api/asset';
import Model from '@/components/Model.vue';
import { useUserStore } from '@/store/User';
import NavBar from '@/components/NavBar.vue';
import AssetMain from '@/components/AssetMain.vue';
import router from '@/router';
import AssetRights from '@/components/AssetRights.vue';
import { showConfirmDialog, showFailToast, showToast } from 'vant';
import Share from '@/components/Share.vue';
import { useConfigStore } from '@/store/Config';
import RightsDetail from '@/components/RightsDetail.vue';
import QrcodeVue from 'qrcode.vue';
import useClipboard from 'vue-clipboard3';

const { toClipboard } = useClipboard();

const route = useRoute();
const active = ref(0);
const plans = ref<PlanDisplayType[]>([]);
const tabOpacity = ref(0);
//处理错误
const errorShow = ref(false);
const errorText = ref('');
//3D模型
const showModel = ref(false);

const shareUrl = ref(window.location.origin + route.path);
const showShare = ref(false);
const contract = ref<ContractType>();
const asset = ref<AssetType>();
const publisher = ref<UserType>();
const transfer = ref<TransferType>();
const loading = ref(true);
const initData = (asset_no: string) => {

  console.log('asset_no', asset_no);
  loading.value = true;
  errorShow.value = false;
  errorText.value = '';
  showModel.value = false;
  contract.value = undefined;
  asset.value = undefined;
  publisher.value = undefined;
  plans.value = [];

  getAssetDetailApi({
    asset_no,
    showError: true,
  })
    .then(res => {
      loading.value = false;
      if (res.code != 200) {
        errorShow.value = true;
        errorText.value = res.msg;
        return;
      }
      contract.value = res.data.contract;
      asset.value = res.data.asset;
      plans.value = res.data.plans;
      publisher.value = res.data.publisher;
      transfer.value = res.data.transfer;
      shareUrl.value = window.location.origin + route.path;
    })
    .catch(e => {
      loading.value = false;
      console.error(e);
      errorShow.value = true;
      errorText.value = '发生了错误' + e.message;
    });
};
watch(
  () => route.params.asset_no as string,
  (newData) => {
    if (!newData) return;
    initData(newData);
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
const userStore = useUserStore();
const planVisible = ref(false);
const showPlan = () => {
  planVisible.value = true;
};
const configStore = useConfigStore();
const transferVisible = ref(false);
const showTransfer = () => {
  console.log(transfer.value);
  if (!transfer.value) {
    showConfirmDialog({
      title: '转赠须知',
      message: configStore.getConfig('transfer_tips'),
      confirmButtonText: '我已知晓',
    })
      .then(() => {

        transferVisible.value = true;
      });
  } else {
    //转赠中
    transferVisible.value = true;
  }
};
const onTransfer = () => {
  transferVisible.value = false;
  //刷新
  initData(asset.value?.asset_no || '');
};
const rightsVisible = ref(false);

const showRights = () => {
  //判断是否是本人
  if (userStore.userInfo?.uid == asset.value?.uid) {
    rightsVisible.value = true;
  }
};
const onCopy = async (text: string) => {
  try {
    await toClipboard(text);
    showToast('复制成功');
  } catch (e) {
    showFailToast('复制失败');
    console.error(e);
  }
}
const onRightsSuccess = () => {
  rightsVisible.value = false;
  initData(asset.value?.asset_no || '');
};

const config = useConfigStore();
</script>
<template>
  <Error :text="errorText" :show="errorShow" />
  <Loading mask v-if="loading" />
  <!--加载后-->
  <div v-else>
    <van-popup v-model:show="planVisible" position="bottom" :style="{ minHeight: '30vh', maxHeight: '60vh' }"
               class="dialog">
      <van-nav-bar title="相关套餐" :border="false" class="popup-nav-bar">
        <template #right>
          <van-icon name="cross" @click="planVisible = false" />
        </template>
      </van-nav-bar>
      <van-empty description="暂时还没有相关套餐" v-if="plans.length == 0" />

      <PlanList :dataList="plans" />
    </van-popup>
    <Share v-model:show="showShare" :url="shareUrl" :name="asset?.name" :img="asset?.main_url"
           v-if="contract?.extends?.substring(0, 4) == 'xgw:'" :background="contract?.extends?.substring(4)"
           :showImg="false" :showQrcode="false" :extends="contract?.extends" :height="rpxToPx(1171)"
           :width="rpxToPx(786)">
      <template #content>
        <div class="xgw-qrcode">
          <qrcode-vue value="https://v2.jimutang.com/plan/Q3ZP2KNF" :size="rpxToPx(150)" level="H" />
        </div>
      </template>
    </Share>
    <Share v-model:show="showShare" :url="shareUrl" :name="asset?.name" :img="asset?.main_url" v-else>
      <template #content>
        <div>
          {{ asset?.name }}
        </div>

        <div>{{ contract?.author }}</div>
        <Tag title="限量" :value="contract?.total_supply + '份'" />
      </template>
    </Share>
    <Model v-if="showModel" :modelFileName="contract?.model_url" :scale="contract?.model_scale"
           @close="showModel = false" />
    <NavBar :title="tabOpacity >= 1 ? contract?.name : ''">
      <template #right>
        <div class="ignore-share" @click="showShare = true"></div>
      </template>
    </NavBar>
    <van-tabs v-model:active="active" scrollspy sticky :style="{
            '--tab-opacity': tabOpacity
        }" class="top-tabs ignore-tabs" offset-top="46" v-if="contract && asset">
      <van-tab title="资产">
        <asset-main :title="asset?.name || contract?.name" :img="asset?.main_url || contract?.main_url"
                    :limit="contract?.total_supply" :model="contract?.model_url ? true : false"
                    @model="showModel = true"
                    limitText="发行" />

        <div class="params bg-gradual-cell margin padding text-default radius">
          <div class="text-deep-gold">资产参数：</div>
          <div>资产价值：{{ amountFormatter((contract.amount) / 100) }}</div>
          <div @click="router.push('/u/' + publisher?.uid)">发行商：{{ publisher?.nickname }}</div>
          <div>作者：{{ asset?.author || contract.author }}</div>
          <div class="van-ellipsis">资产编号：{{ asset.asset_no }}</div>
          <div class="flex align-center justify-between">
            <div class="van-ellipsis" style="width: 80%" v-if="asset.token_id">资产地址：{{ asset.token_id }}
            </div>
            <van-icon size="16" v-if="asset.token_id" name="file-copy" class="right-icon" class-prefix="sylf-icon" @click="onCopy(asset.token_id)" />
          </div>
          <div class="flex align-center justify-between">
            <div class="van-ellipsis">合约地址：{{ contract.chain_contract_id }}</div>
            <van-icon size="16" name="file-copy" class="right-icon" class-prefix="sylf-icon" @click="onCopy(contract.chain_contract_id)" />

          </div>


          <AssetRights :s="asset.asset_rights?.findIndex(n => n.rights.tag == 'S') >= 0"
                       :x="asset.asset_rights?.findIndex(n => n.rights.tag == 'X') >= 0"
                       :a="asset.asset_rights?.findIndex(n => n.rights.tag == 'A') >= 0"
                       :u="asset.asset_rights?.findIndex(n => n.rights.tag == 'U') >= 0" @click="showRights" />
          <div class="text-center text-deep-gold" @click="showPlan">查看相关套餐
            <van-icon name="arrow" />
          </div>
        </div>

      </van-tab>
      <van-tab title="详情">
        <div v-html="contract.desc_html" v-if="contract.desc_type == 'html'" class="html"></div>
        <img :src="contract.desc_img" v-else-if="contract.desc_img" class="desc_img" />
      </van-tab>
    </van-tabs>


    <Transfer v-model:show="transferVisible" :asset="asset" :transfer="transfer" @success="onTransfer" />
    <BottomNav :asset="asset" :contract="contract"
               v-if="userStore.userInfo?.uid == asset?.uid && contract?.transfer_flag == 'Y'"
               @transfer="showTransfer" />
    <ReceiveNav v-else-if="userStore.userInfo?.uid == transfer?.receive_uid && transfer" @transfer="showTransfer" />
    <van-popup v-if="userStore.userInfo?.uid == asset?.uid" v-model:show="rightsVisible" position="bottom"
               :style="{ minHeight: '30vh', maxHeight: '60vh' }" class="dialog">
      <van-nav-bar title="资产权益" :border="false" class="popup-nav-bar">
        <template #right>
          <van-icon name="cross" @click="rightsVisible = false" />
        </template>
      </van-nav-bar>
      <RightsDetail component :asset="asset" v-if="asset" @success="onRightsSuccess" />
    </van-popup>
  </div>
</template>
<style scoped lang="less">
@import url('./style.less');

.rights-item {
  --van-cell-text-color: #ffffff;

  :deep(.van-cell__title) {
    flex: 4;
  }
}

.xgw-qrcode {
  position: absolute;
  left: 138px;
  bottom: -115px;
  box-sizing: border-box;
}</style>
