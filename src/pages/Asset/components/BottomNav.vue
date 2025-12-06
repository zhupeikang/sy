<script setup lang="ts">
import { getUserPlatformApi, loginUserPlatformApi } from '@/api/user';
import { useDictStore } from '@/store/Dict';
import { AssetType, ContractType } from '@/types';
import { rpxToPx, showLoading } from '@/utils';
import { PropType, ref, watch } from 'vue';
import Avatar from '@/components/Avatar.vue';
import { showToast } from 'vant';
import { useUserStore } from '@/store/User';
import { applyAssetApi } from '@/api/asset';

const userStore = useUserStore();

const props = defineProps({
  asset: {
    type: Object as PropType<AssetType>,
    default: () => {
    },
  },
  contract: {
    type: Object as PropType<ContractType>,
    default: () => {
    },
  },
  favored: {
    type: Boolean,
    default: false,
  },
});
const showPopover = ref(false);
const dictStore = useDictStore();
const platforms = ref<{
  name: string
  text: string
  logo: string
}[]>([]);
watch(() => dictStore.getDict('platform'), (val) => {
  //@ts-ignore
  platforms.value = val;
}, {
  immediate: true,
});

const emits = defineEmits(['transfer']);

const showDialog = ref(false);
const platform = ref<{
  name: string
  text: string
  logo: string
}>();
const auth = ref<null | {
  status: string
}>();
const allowMobile = ref(true);
const allowRealname = ref(false);
const onSelect = async (action: any) => {
  showPopover.value = false;
  const loading = showLoading();
  const res = await getUserPlatformApi({
    name: action.name,
  });

  if (res) {
    loading.end();
    showDialog.value = true;
    platform.value = action;
    allowMobile.value = true;
    allowRealname.value = res.data.auth ? res.data.auth.status == 'Y' : true;
    auth.value = res.data.auth;
  }

};

const toPlatform = async () => {
  showLoading('正在跳转...');
  const res = await loginUserPlatformApi({
    name: platform.value?.name,
    allowMobile: allowMobile.value,
    allowRealname: allowRealname.value,
  });
  if (res) {
    showDialog.value = false;
    showToast(res.msg);
    setTimeout(() => {
      if (res.data.type == 'redirect') {
        window.location.href = res.data.url;
      } else if (res.data.type == 'open') {
        window.open(res.data.url);
      }
    }, 1500);
  }
};
const loading=ref(false)
const registerCfx = () => {
  if (userStore.userInfo?.wallet?.cfx_address) {
    loading.value=true
    applyAssetApi({asset_no:props.asset.asset_no}).then(res => {
      showToast(res.msg);
    })
    return;
  }
  // 新开窗口注册CFX
  window.open('https://confluxnetwork.org/zh', '_blank');
};
</script>
<template>
  <div class="ignore-tabbar-box"></div>
  <div class="ignore-tabbar" v-if="props.asset.status==='success'">
    <van-button type="primary" class="ignore-theme-btn action" @click="emits('transfer')"
                v-if="props.asset.lock_flag == 'no'">转赠
    </van-button>
    <van-button type="primary" @click="emits('transfer')"
                v-else-if="props.asset.lock_flag == 'transfer'">转赠待对方接收中...
    </van-button>
      <van-button type="primary" v-else-if="props.asset.lock_flag != 'no'">{{
          platforms.find(n => n.name == props.asset.lock_flag)?.text }}锁定中
      </van-button>
        <!--        <van-button type="primary" class="ignore-theme-btn more-btn margin-left">-->
        <!--          <van-icon name="ellipsis" class="more" />-->
        <!--        </van-button>-->
        <van-button v-if="!['conflux','conflux_test'].includes(props.asset.platform)" @click="onSelect({name:'xmeta'})" type="primary" class="ignore-theme-btn px-4  margin-left">
          XMETA
        </van-button>

    <van-popup v-model:show="showDialog" closeable position="bottom">
      <div class="authBox">

        <Avatar :url="platform?.logo || ''" :size="rpxToPx(400)" />
        <div class="to">您即将访问 {{ platform?.text }}，请注意您的财产安全</div>
        <div class="checkbox">
          <van-checkbox v-model="allowMobile" shape="square">授权身份信息，用于快速注册和认证</van-checkbox>
        </div>
        <!-- <div class="checkbox">
            <van-checkbox v-model="allowRealname" shape="square"
                :disabled="!allowMobile">授权实名信息，用于帐号认证</van-checkbox> -->
        <!-- </div> -->
        <div class="checkbox">
          <van-button class="theme-btn" type="primary" block @click="toPlatform">{{ !allowMobile ? '不授权，直接跳转' :
            allowRealname ?
              '快速注册/登录并实名' : '快速注册/登录' }}
          </van-button>
        </div>
      </div>

    </van-popup>
  </div>
  <div class="ignore-tabbar" v-else>
    <van-button style="width: 100%" @click="registerCfx" :disabled="loading" type="primary">去领取</van-button>
  </div>
</template>

<style scoped lang="less">
.ignore-tabbar {
  background-color: var(--theme-bar);
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
  text-align: right;
  color: #ffffff;

  .more-btn {
    padding: 0px;

    .more {
      //旋转90度
      transform: rotate(90deg);
    }
  }
}

.ignore-tabbar-box {
  height: calc(64px + constant(safe-area-inset-bottom));
  height: calc(64px + env(safe-area-inset-bottom));
}

.authBox {
  margin: 100px 20px 20px;
  text-align: center;

  .to {
    margin-bottom: 50px;
  }

  .checkbox {
    margin: 0 40px 20px;
  }
}
</style>
