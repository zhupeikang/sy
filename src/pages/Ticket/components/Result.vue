<script lang="ts" setup>
import NavBar from '@/components/NavBar.vue';
import { computed, onBeforeMount, ref, watch, watchEffect } from 'vue';
import { getOrderDetail } from '@/api/ticket';
import { useRoute } from 'vue-router';
import { OrderStatus } from '@/types';
import router from '@/router';

const route = useRoute();
const info = ref({});
const t = setInterval(() => {
  getInfo(route.params?.no);
}, 3000);
const getInfo = (v) => {
  getOrderDetail({
    master_order_no: v,
  }).then(r => {
    info.value = r.data.master_order;
  });
};
const paySuccess = computed(() => {
  return info.value?.status >= OrderStatus.MASTER_ORDER_STATUS_PAYED && info.value?.status <= OrderStatus.MASTER_ORDER_STATUS_FINISH;
});
watchEffect(() => {
  if (paySuccess.value) {
    clearInterval(t);
  }
});
onBeforeMount(()=>{
  if (t){
    clearInterval(t);
  }
})
watch(() => route.params, (v) => {
  if (v.no) {
    getInfo(v.no);
  }
}, {
  immediate: true,
});

const image = ref(null);


</script>

<template>
  <div class="">
    <NavBar :left-arrow="false" :router-back="false" :title="`支付${paySuccess?'成功':'失败'}`"></NavBar>
    <div class="flex  flex-col justify-center items-center">
      <div :class="paySuccess?'success':'fail'" class="w-300px h-300px" style="">
      </div>
        <div class="info" @click="router.push('/')">
          回到首页
        </div>
        <div class="info mt-20px" @click="router.push('/user/ticket/event')">
          我的门票
        </div>
      <div class="text-white font-bold text-50px mt-100px">
        看看大家都在聊什么
      </div>
      <div class="mt-20px ">
        <img ref="image" class="border-rd-10px" alt="Image to save" src="@/assets/imgs/v3/qrcode.png" width="200px" />
      </div>
      <div class="van-safe-area-bottom">
        QQ群二维码
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.success {
  background: url("@/assets/imgs/v3/pay_success.png") no-repeat center;
  background-size: contain;
}
.fail {
  background: url("@/assets/imgs/v3/pay_fail.png") no-repeat center;
  background-size: contain;
}
.info {
  border: .5px solid var(--theme-deep-gold);
  text-align: center;
  padding: 16px 10px;
  width: 300px;
  box-sizing: border-box;
  border-radius: 12px;
  font-weight: bolder;
  font-size: 30px;
}
</style>
