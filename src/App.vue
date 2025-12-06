<script lang="ts" setup>
import { reactive, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import Tabbar from '@/components/Tabbar.vue';
import tabbars from '@/config/tabbar';
import { themeVars } from '@/config/theme';
import { useConfigStore } from './store/Config';
import Verify from '@/components/Verify.vue';
import { useUserStore } from './store/User';
//@ts-ignore
import io from 'socket.io-client';
import { showNotify } from 'vant';
import { WS_URL } from './config/axios/service';
import { useRefreshStore } from './store/Refresh';

const refreshStore = useRefreshStore();
const showTabbar = ref(false);
const router = useRouter();
const showCopyRight = ref(true);
const config = useConfigStore();
const userStore = useUserStore();
// 监听当前路由
watch(
  () => router.currentRoute.value,
  (newValue: any) => {
    showTabbar.value = tabbars.findIndex(n => n.name == newValue.name) >= 0 && (newValue.name != 'Profile' || userStore.isLogin);
    if (newValue.name === 'Auth') {
      showTabbar.value = false;
    }

    showCopyRight.value = !['Auth'].includes(newValue.name);
    const {showCopyRight:show} =newValue.meta;
    if(show!==undefined){
      showCopyRight.value=show;
    }
  },
  { immediate: true },
);

// 如果userStore.isLogin 隐藏tabbar
watchEffect(() => {
  if (userStore.isLogin && router.currentRoute.value.name === 'Auth') {
    showTabbar.value = false;
  }
});
// 监听分享参数
watch(
  () => router.currentRoute.value.query,
  (newValue: any) => {
    if (newValue.i) {
      // 先判断是否存在邀请码
      if (!localStorage.getItem('invite_code')) {
        localStorage.setItem('invite_code', JSON.stringify({ v: newValue.i, t: Date.now() }));
      } else {
        const inviteCode = JSON.parse(localStorage.getItem('invite_code') as string);
        if (inviteCode.v !== newValue.i) {
          localStorage.setItem('invite_code', JSON.stringify({ v: newValue.i, t: Date.now() }));
        } else {
          // 如果相等，判断是否超过72小时
          if (Date.now() - inviteCode.t > 72 * 60 * 60 * 1000) {
            localStorage.setItem('invite_code', JSON.stringify({ v: newValue.i, t: Date.now() }));
          }
        }

      }
    }
  },
  { immediate: true },
);

const socket = io(WS_URL);
socket.on('connect', () => {
});
let errorCount = 0;
socket.on('connect_error', (err: Error) => {
  console.log('connect_error: websocket 连接失败！');
  errorCount++;
  if (errorCount > 5) {
    socket.disconnect();
  }
});
socket.on('new_msg', function({ event, content }: {
  event: string
  content: string
}) {
  if (event == 'asset') {
    refreshStore.asset = true;
  }
  if (content.length > 0) {
    userStore.updateUserInfo();
    showNotify({
      type: 'primary', message: content, onClick: () => {
        router.push('/message');
      },
    });
  }

});
socket.on('event', function({ name, params}: {
  name: string
  params: string
}) {
  if (name == 'profile') {
    userStore.updateUserInfo();
  }
});

watch(() => userStore.token, (newValue) => {

  if (newValue) {
    socket.emit('login', newValue);
    //每隔X秒判断是否存在钱包地址
    setInterval(() => {
      if (!userStore.userInfo?.wallet?.address && userStore.isLogin) {
        userStore.updateUserInfo();
      }
    }, 3000);

  } else {
    socket.emit('logout');
    // socket.disconnect()
  }

}, { immediate: true });

const loading = ref(false);
const includeList = reactive<string[]>([]);
router.beforeEach((to, from, next) => {
  loading.value = true;
  if (to.meta?.keepAlive) {
    const name = to.name as string;
    if (!includeList.includes(name)) {
      includeList.push(name);
    }
  }

  next();

});
router.afterEach((to, from) => {
  loading.value = false;
});
//@ts-ignore
const isMiniprogram = window.__wxjs_environment === 'miniprogram';
const onMiniprogram = () => {
  //@ts-ignore
  wx.miniProgram.navigateBack();
  // wx.miniProgram.postMessage({
  //   data:{

  //     action:'back'
  //   }
  // })
};

watch(() => config.getConfig('gray') as string, val => {
  if (val === '1') {
    //页面body增加body-gray class
    document.body.classList.add('body-gray');
  }
}, {
  immediate: true,
});
const setting = ref();
watch(() => config.getConfig('setting') as string, val => {
  setting.value = val ? JSON.parse(val) : {};
}, {
  immediate: true,
});

</script>

<template>
  <div style="display: none;">{{ $route.name }}</div>

  <van-config-provider :theme-vars="themeVars">
    <van-overlay :show="loading" class-name="background">
      <div class="wrapper" @click.stop>
        <van-loading color="var(--theme-deep-gold)" size="48" />
      </div>
    </van-overlay>
    <Verify />

    <div v-show="config.loaded" class="main ignore-main">
      <div v-if="setting?.close" class="close">
        {{ setting?.closeTips }}
      </div>
      <router-view v-else v-slot="{ Component }">
        <keep-alive :include="includeList" :max="30">
          <component :is="Component" :key="$route.name" />
        </keep-alive>
      </router-view>

      <div v-if="showCopyRight" class="copyright text-center text-sm">
        <div>{{ config.getConfig('cbwjyxk') }}</div>
        <div><a href="https://beian.miit.gov.cn/">{{ config.getConfig('icp') }}</a></div>
        <div>{{ config.getConfig('jyxicp') }}</div>
        <div>{{ config.getConfig('bcbeian') }}</div>
      </div>
      <Tabbar v-if="showTabbar" />
      <div v-show="!showTabbar&&showCopyRight" class="ignore-home-btn" @click="router.push('/home')">
        <div class="ignore-home-icon">
          <van-icon name="wap-home" size="24px" />
        </div>
        <div>
          返回首页
        </div>
      </div>
      <div v-if="isMiniprogram" class="ignore-miniprogram-btn" @click="onMiniprogram">
        <div class="ignore-home-icon">
          <van-icon name="miniprogram-o" size="24px" />
        </div>
        <div>
          返回小程序
        </div>
      </div>
    </div>

  </van-config-provider>
</template>
<style lang="less" scoped>
.close {
  text-align: center;
  padding: 200px 0;
}

.main {
  width: 750px;
}

.ignore-main {
  max-width: 750px;
}

.background {
  text-align: center;
  line-height: 100vh;
  z-index: 9999;
  --color-background: var(--theme-bg);
}

.copyright {
  padding-top: 150px;
}

.ignore-home-btn,
.ignore-miniprogram-btn {
  position: fixed;
  right: var(--van-back-top-right);
  bottom: calc(100px + constant(safe-area-inset-bottom));
  bottom: calc(100px + env(safe-area-inset-bottom));
  z-index: 20;
  text-align: center;
  font-size: 12px;
}

.ignore-home-btn .ignore-home-icon,
.ignore-miniprogram-btn .ignore-home-icon {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--van-back-top-size);
  height: var(--van-back-top-size);

  cursor: pointer;
  color: var(--van-back-top-text-color);
  border-radius: var(--van-radius-max);
  box-shadow: 0 2px 8px rgba(0, 0, 0, .12);
  transition: var(--van-duration-base) cubic-bezier(.25, .8, .5, 1);
  background-color: var(--van-back-top-background);
}

.ignore-miniprogram-btn {
  bottom: 160px;
}</style>
