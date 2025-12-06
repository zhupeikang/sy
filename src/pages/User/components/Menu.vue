<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store/User';
import router from '@/router';
import { showLoading, track } from '@/utils';
import { showFailToast, showToast } from 'vant';
import useClipboard from 'vue-clipboard3';

const { toClipboard } = useClipboard();

const menuVisible = ref(false);
const userStore = useUserStore();
const showVerify = () => {
  menuVisible.value = false;
  userStore.showVerify();
};

const onRefresh = async () => {
  const loading = showLoading('更新中');
  await userStore.updateUserInfo();
  loading.end();
};
const onCopy = async (text: string) => {
  if (!text) {
    await router.push('/user/invite');
    return;
  }
  try {
    await toClipboard(window.location.origin + '/?i=' + text);
    showToast('复制成功');
  } catch (e) {
    showFailToast('复制失败');
    console.error(e);
  }
};
const push = (name: string, action: string) => {
  track('profile', {
    action
  })
  router.push({
    name
  })
}
</script>
<template>
  <van-icon name="bars" size="24px" class="ignore-menu" color="var(--color-primary)" @click="menuVisible = true" />

  <van-icon name="replay" size="24px" class="ignore-refresh" color="var(--color-white)" @click="onRefresh" />
  <van-popup v-model:show="menuVisible" position="right"
             :style="{ width: '60%', height: '100%', background: '#121212' }">
    <div class="list">
      <div class="cell clickable flex align-center justify-between" @click="showVerify">
        <div class="title">
          <span class="icon icon-verify" />
          <span>实名认证</span>

        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between" @click="router.push('/user/privacy')">
        <div class="title">
          <span class="icon icon-privacy" />
          <span>隐私设置</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between margin-top" @click="router.push('/user/invite')">
        <div class="title">
          <span class="icon icon-invite" />
          <span>好友邀请</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>

      <div class="cell clickable flex align-center justify-between " @click="router.push('/order')">
        <div class="title">
          <span class="icon icon-order" />
          <span>订单</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between " @click="push('UserFavor','like')">
        <div class="title">
          <span class="icon icon-favorite" />
          <span>我的收藏</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between " @click="push('UserTicketRefundList','refund')">
        <div class="title">
          <span class="icon icon-refund" />
          <span>我的售后</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between" @click="router.push('/user/address')">
        <div class="title">
          <span class="icon icon-address" />
          <span>收货地址</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between" @click="router.push('/wallet')" v-if="false">
        <div class="title">
          <span class="icon icon-wallet" />
          <span>钱包</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between" @click="router.push('/publisher/apply')"
           v-if="userStore.userInfo?.publisher_flag!='Y'">
        <div class="title">
          <span class="icon icon-publisher" />
          <span>艺术家入驻</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between" @click="router.push('/manage')" v-else>
        <div class="title">
          <span class="icon icon-manage" />
          <span>发行中心</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between" @click="router.push('/explore-index')">
        <div class="title">
          <span class="icon icon-browser" />
          <span>区块链浏览器</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between margin-top"
           @click="router.push('/article/service')">
        <div class="title">
          <span class="icon icon-service" />
          <span>联系客服</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between" @click="router.push('/article-help')">
        <div class="title">
          <span class="icon icon-help" />
          <span>帮助中心</span>
        </div>
        <van-icon name="arrow" size="20px" />
      </div>
      <div class="cell clickable flex align-center justify-between" @click="onCopy(userStore.userInfo.invite_code)" >
        <div class="title">
          <span class="icon icon-link" />
          <span style="text-decoration:underline ">我的邀请链接</span>
        </div>
        <van-icon size="16" name="file-copy" class="right-icon" class-prefix="sylf-icon"
        />
      </div>
    </div>

    <div class="about clickable" @click="router.push('/article-about')">关于拾元立方
      <van-icon name="arrow" size="20px" />
    </div>
  </van-popup>
</template>
<style lang="less" scoped>
.ignore-menu {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 100;
}

.ignore-refresh {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  z-index: 100;
}

.list {
  margin: 20px;

  .cell {
    background-color: #1f1f1f;
    font-size: 28px;
    padding: 10px;
    color: #ffffff;

    .title {
      > span {
        vertical-align: middle;
      }

      .icon {
        box-sizing: border-box;
        background-size: 48px 48px;
        background-repeat: no-repeat;
        background-position: center center;
        display: inline-block;
        height: 96px;
        width: 96px;
        line-height: 48px;
        margin-right: 10px;
      }

      .icon-verify {
        background-image: url(@/assets/imgs/icon_verify.png);
      }

      .icon-order {
        background-image: url(@/assets/imgs/icon_order.png);
      }

      .icon-invite {
        background-image: url(@/assets/imgs/normal_u51.png);
      }
      .icon-link {
        background-image: url(@/assets/imgs/normal_u55.svg);
      }
      .icon-wallet {
        background-image: url(@/assets/imgs/icon_wallet.png);
      }

      .icon-address {
        background-image: url(@/assets/imgs/icon_address.png);
      }
      .icon-favorite {
        background-image: url(@/assets/imgs/liked.png);
      }
      .icon-refund {
        background-image: url(@/assets/imgs/v3/refund.png);
      }
      .icon-publisher {
        background-image: url(@/assets/imgs/icon_publisher.png);
      }

      .icon-manage {
        background-image: url(@/assets/imgs/icon_manage.png);
      }

      .icon-browser {
        background-image: url(@/assets/imgs/icon_browser.png);
      }

      .icon-privacy {
        background-image: url(@/assets/imgs/icon_privacy.png);
      }

      .icon-service {
        background-image: url(@/assets/imgs/icon_service.png);
      }

      .icon-help {
        background-image: url(@/assets/imgs/icon_help.png);
      }
    }

  }

  .cell:first-child {
    border-radius: 10px;
  }

  //元素尾部插入右箭头
  // .cell::after {
  //     content: '';
  //     position: absolute;
  //     right: 20px;
  //     top: 50%;
  //     transform: translateY(-50%);
  //     width: 24px;
  //     height: 24px;
  //     // background-image: url(@/assets/imgs/arrow_right.png);
  //     background-size: contain;
  //     background-repeat: no-repeat;
  //     background-position: center;
  // }

  .cell:active {
    box-shadow: 0 0 10px 0 var(--theme-gold);

    .icon {
      background-color: #2e2e2e;
      border-radius: 50%;
    }
  }
}

.about {
  font-size: 28px;
  text-align: center;
  color: #ffffff;
  width: 60vw;

  > * {
    vertical-align: middle;
  }
}
</style>
