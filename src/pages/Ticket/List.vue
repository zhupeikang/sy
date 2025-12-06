<script lang="ts" setup>

import NavBar from '@/components/NavBar.vue';
import { onBeforeMount, ref } from 'vue';
import TitcketList from '@/components/TitcketList.vue';
import { getLocation, getTicketListApi } from '@/api/ticket';
import router from '@/router';
import { Datum } from '@/types/ticket';
import { showToast } from 'vant';
import { useCityStore, useCityStoreHook } from '@/store/useCity';
import { storeToRefs } from 'pinia';

const cityStore = useCityStore();
const { city } = storeToRefs(cityStore);
const changeCity = () => {
  router.push('/ticket/city');
};
const list = ref<Datum[]>([]);

const loading = ref(true);
const finished = ref(false);
const pageParams = ref({
  page: 1,
  size: 10,
});
const onLoad = async () => {
  getTicketListApi({
      ...pageParams.value,
      city: city.value.code,
    },
  ).then((res) => {
    loading.value = false;
    const { data, current_page, last_page } = res.data;
    list.value = list.value.concat(data);
    if (current_page == last_page) {
      finished.value = true;
    } else if (current_page < last_page) {
      pageParams.value.page += 1;
    }
  }).catch(() => {
    loading.value = false;
    finished.value = true;
  });
};

function replaceLastTwoDigitsWithZero(num: number) {
  return parseInt(num.toString().slice(0, -2) + '00');
}

const init = () => {
  if (city.value.code) {
    loading.value=false
    return
  };
  getLocation({
    method: 'get',
    path: '/ws/location/v1/ip2',
    params: { ip: '' },
    showError: true,
  }).then(r => {
    if (r.data.status !== 0) {
      return showToast(r.data.message);
    }
    const { ad_info } = r.data.result;
    // 最后两位改为0
    ad_info.adcode = replaceLastTwoDigitsWithZero(ad_info.adcode);
    useCityStoreHook().setCity({
      name: ad_info.city,
      code: ad_info.adcode,
    });
  }).finally(() => {
    loading.value = false;
  });
};

onBeforeMount(() => {
  init();
});
</script>

<template>
  <NavBar title="拾元立方" />
  <div class="p-15px">
    <div>
      <div class="flex items-center text-25px">
        <div class="text-white  ">
          <van-icon name="location-o" />
        </div>
        <div class="text-white text-25px">当前城市：</div>
        <div class="p-x-22px ml-44px border-solid text-#5F5F5F  border-1px b-rd-20px" @click="changeCity">{{ city.name
          }}
        </div>
      </div>
    </div>
    <van-divider />
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <TitcketList :data-list="list"><</TitcketList>
    </van-list>
  </div>

</template>

<style lang="less" scoped>

</style>
