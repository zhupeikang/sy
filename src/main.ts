import { createApp } from 'vue';
import 'virtual:uno.css';

import App from './App.vue';
import pinia from '@/store';
import Vant, { showToast } from 'vant';
import router from './router';
import 'vant/lib/index.css';
import './style.css';
import '@vant/touch-emulator';
import { useUserStore } from './store/User';
import Vconsole from 'vconsole';
// main.ts
import vhCheck from 'vh-check';

vhCheck();
const app = createApp(App);
//@ts-ignore
window.myApp = app;
app.use(router)
  .use(pinia)
  .use(Vant);

//实名认证
const userStore = useUserStore();
app.config.globalProperties.$showVerify = function() {
  userStore.showVerify();
};

//登录
app.directive('login', {
  mounted(el, binding) {
    el.addEventListener('click', () => {
      if (!userStore.isLogin) {
        showToast('请先登录');
        router.push('/login?referer=' + encodeURIComponent(router.currentRoute.value.fullPath));
      } else {
        binding.value();
      }
    });
  },
});
if (import.meta.env.VITE_API_BASEPATH != 'pro') {
  //获取操作系统
  if (navigator.platform.indexOf('Win') == -1) {
    let vConsole = new Vconsole();
  }

}


try {
  const setChannel = new BroadcastChannel('sylf');
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    setChannel.onmessage = function(e) {
      if (e.data.action == 'back') {
        router.back();
      } else if (e.data.action == 'push') {
        router.push(e.data.url);
      }

    };
  }
} catch (e) {
  console.log('BroadcastChannel not support');
}

app.mount('#app');
