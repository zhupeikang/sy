<template>
  <div class="ignore-tabbar-box"></div>
  <div class="ignore-tabbar">
    <div :class="favored ? 'liked' : 'like'" @click="onFavor"></div>
    <div class="ignore-button flex align-center" v-if="status == 'pending'" v-login="onRemind">
      <Price :value="props.data.price / 100" class="price" />
      <div class="status appoint">
        {{ reminded ? '取消预约' : '立即预约' }}
        <div class="date">{{ toDatetime(props.data.begin_at, 'MM-DD HH:mm') }} 开售</div>
      </div>
    </div>
    <div class="ignore-button flex align-center" v-else-if="status == 'on'" v-login="onPay">
      <Price :value="props.data.price / 100" class="price" />
      <div class="status">
        <div v-if="isPre">立即验证</div>
        <div v-else>
          {{ props.data.price == 0 ? '立即领取' : '立即购买' }}
        </div>
      </div>
    </div>
    <div class="ignore-button flex align-center" v-else-if="status == 'off'">
      <Price :value="props.data.price / 100" class="price" />
      <div class="status">
        已下架
      </div>
    </div>
    <div class="ignore-button flex align-center" v-else-if="status == 'ban'">
      <Price :value="props.data.price / 100" class="price" />
      <div class="status">
        无法购买
      </div>
    </div>
    <div class="ignore-button flex align-center" v-else-if="status == 'out'">
      <Price :value="props.data.price / 100" class="price" />
      <div class="status">
        已售罄
      </div>
    </div>
  </div>
  <Pay :is-pre="isPre" ref="payRef" />
  <Choose @chooseAssets="onPay" ref="chooseRef"></Choose>
  <van-popup v-model:show="showNoAssets" closeable position="bottom"
             :style="{ height: '40%',padding: '40px 20px',overflow:'hidden'}">
    <div>
      <div class="text-center">
        <p>您好 您的资产</p>
        <p> 未满足当前购买条件</p>
        <p> 请检查“我的资产”后，重新进行购买
        </p>

      </div>
      <div>
        <van-button style="width: 100%" @click="()=>{showNoAssets=false}" type="primary">返回</van-button>
      </div>

    </div>
  </van-popup>
  <van-popup v-model:show="showNoCfx" closeable position="bottom"
             :style="{ height: '40%',padding: '40px 20px',overflow:'hidden'}">
    <div>
      <div class="text-center">
        <p>您尚未注册/绑定</p>
        <p> CONFLUX钱包地址</p>
        <p> 请先注册</p>
        <p>然后到“我的”-“绑定Conflux钱包”后购买</p>
      </div>
      <div>
        <van-button style="width: 100%" @click="registerCfx" type="primary">去注册</van-button>
      </div>
      <p></p>
      <div>
        <van-button style="width: 100%" @click="bindCfx" type="primary">我已注册，去绑定</van-button>
      </div>

    </div>
  </van-popup>
  <BindWallet v-model:show="showBind"></BindWallet>

</template>
<script setup lang="ts">
import { favorPlanApi, favorRemindApi } from '@/api/favor';
import { PlanType } from '@/types';
import { getPlanStatus, showLoading, toDatetime } from '@/utils';
import { computed, PropType, ref, watch } from 'vue';
import Pay from '@/components/Pay.vue';
import Choose from '@/components/Choose.vue';
import { createOrderApi } from '@/api/order';
import Price from '@/components/Price.vue';
import { showToast } from 'vant';
import BindWallet from '@/components/BindWallet.vue';

const showNoAssets = ref(false);
const showNoCfx = ref(false);
const showBind = ref(false);

const registerCfx = () => {
  // 新开窗口注册CFX
  window.open('https://confluxnetwork.org/zh', '_blank');
};
const bindCfx = () => {
  showBind.value = true;
};

const props = defineProps({
  data: {
    type: Object as PropType<PlanType>,
    default: () => [],
  },
});
const payRef = ref<InstanceType<typeof Pay>>();
const chooseRef = ref<InstanceType<typeof Choose>>();
const status = ref(getPlanStatus(props.data));
const favored = ref(props.data.favored || false);
const reminded = ref(props.data.reminded || false);
console.log('套餐状态', status.value);
watch(() => props.data, (newValue) => {
  status.value = getPlanStatus(newValue);
  favored.value = newValue.favored;
  reminded.value = newValue.reminded;
  // onPay()
  console.log('套餐状态', status.value);
});
// 是不是优先购类型
const isPre = computed(() => props.data?.pre_contracts?.length > 0);
const onFavor = async () => {
  const loading = showLoading(favored.value ? '取消收藏中' : '收藏中');
  const res = await favorPlanApi({
    plan_no: props.data.plan_no,
  });
  if (res) {
    loading.end();
    if (res.data.result) {
      favored.value = true;
    } else {
      favored.value = false;
    }
  }
};

const onRemind = async () => {
  const loading = showLoading(reminded.value ? '取消预约中' : '预约中');
  const res = await favorRemindApi({
    plan_no: props.data.plan_no,
  });
  if (res) {
    loading.end();
    if (res.data.result) {
      reminded.value = true;
    } else {
      reminded.value = false;
    }
  }
};
const onPay = async (params: any) => {
  const loading = showLoading('下单中');
  const p = {
    plan_no: props.data.plan_no,
    pre_asset: params?.asset_no,
  };
  if (isPre.value) {
    p.showError = true;
  }
  if (props.data.isConflux) {
    p.showError = true;
  }
  const res = await createOrderApi(p);
  if (isPre.value) {
    if (res.code === 50001) {
      loading.end();
      chooseRef.value?.init(props.data);
    } else if (res.code === 50002 || res.code === 50003) {
      loading.end();
      showNoAssets.value = true;
    } else {
      if (res.code !== 200) {
        showToast(res.msg);
        return;
      }
      loading.end();
      payRef.value?.init(res.data);
    }
    return;
  }
  if (props.data.isConflux) {
    loading.end();
    if (res.code !== 200) {
      showNoCfx.value = true;
      return;
    }
    payRef.value?.init(res.data);
    return;
  }
  if (res) {
    loading.end();
    payRef.value?.init(res.data);
    return;
  }


};
</script>
<style scoped lang="less">
.ignore-tabbar {
  background-color: var(--theme-bar);
  color: #1f1f1f;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 10px);
  padding-bottom: calc(env(safe-area-inset-bottom) + 10px);
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: calc(100vw - 40px);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ignore-button {
    text-align: center;
    box-sizing: border-box;
    width: calc(100% - 50px);
    padding: 0 20px;
    height: 48px;
    line-height: 48px;
    background: var(--theme-gradual-btn);
    border-radius: 48px;
    text-align: center;

    .price {
      flex: 2;
      font-size: 16px;
      height: 48px;
      line-height: 48px;

      :deep(.integer) {
        color: #1f1f1f;
        font-size: 28px;
        font-weight: 500;
      }

      :deep(.unit) {
        color: #1f1f1f;
        font-size: 24px;
      }

      :deep(.digital) {
        color: #1f1f1f;
        font-size: 24px;
      }
    }

    .status {
      flex: 3;
      font-size: 16px;
    }

    .appoint {
      line-height: 20px;

      .date {
        font-size: 12px;
        color: #a68b60;
      }
    }
  }
}

.ignore-tabbar-box {
  height: calc(64px + constant(safe-area-inset-bottom));
  height: calc(64px + env(safe-area-inset-bottom));
}
</style>
