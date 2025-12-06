<script setup lang="ts">
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { getAppRedirect } from '@/api/app';
import Error from '@/components/Error.vue';
import { useUserStore } from '@/store/User';
import Login from '@/components/Login.vue';
import { storeToRefs } from 'pinia';
import route from '@/router';

const userStore = useUserStore();
const store = storeToRefs(userStore);
const router = useRoute();
const iframeUrl = ref('');
const errorShow = ref(false);
const errorText = ref('');
const params = router.query;
const showBubble=computed(() => {
  return params.appid !== '1724758212945';
})
const getData = () => {
  getAppRedirect({
    showError: true,
    ...params,
  }).then(res => {
    if (res.code === 200) {
      const { url } = res.data;
      iframeUrl.value = url;
    } else {
      errorShow.value = true;
      errorText.value = res.msg;
    }
  }).catch(e => {
    errorShow.value = true;
    errorText.value = e.msg;
  });

};
watch(store.isLogin, (newValue, oldValue) => {
  if (newValue && store.userInfo) {
    getData();
  }
}, {
  immediate: true,
});
const loading = ref(false);
const onLogin = () => {
  errorShow.value = false;
  getData();
};

onMounted(() => {
  document.body.style.overflow = 'hidden';
});
onBeforeRouteLeave(() => {
  document.body.style.overflow = '';
});
// 监听窗口变化
window.addEventListener('resize', () => {
  document.getElementsByClassName('container')[0].style.height = window.innerHeight + 'px';
});
const offset = ref({ x: 10, y: 100 });
const back = () => {
    return route.replace('/');
};
</script>

<template>
  <div class="container" v-if="userStore.isLogin && userStore.userInfo">
    <iframe class="iframe" ref="iframe" v-if="iframeUrl" :src="iframeUrl" style="" />
    <Error v-if="errorShow" :show="errorShow" :text="errorText" />
<!--    <van-floating-bubble v-if="showBubble" @click="back" v-model:offset="offset" magnetic="x" axis="xy" icon="revoke">-->
<!--      <span style="font-size: 12px">返回</span>-->
<!--    </van-floating-bubble>-->
  </div>
  <div v-else>
    <Login @success="onLogin" />
  </div>
</template>

<style scoped lang="less">

//隐藏滚动条
::-webkit-scrollbar {
  display: none;
}

.iframe {
  overflow: hidden;
  width: 100vw;
  border: 0;
  height: 100%
}

//  垂直水平居中
.container {
  height: 100vh;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
}

</style>
