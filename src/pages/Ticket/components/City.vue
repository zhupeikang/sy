<script lang="ts" setup>
import NavBar from '@/components/NavBar.vue';
import { onMounted, ref } from 'vue';
import pinyin from 'pinyin';
import { areaList } from '@vant/area-data';
import { useCityStore, useCityStoreHook } from '@/store/useCity';
import { storeToRefs } from 'pinia';
import router from '@/router';

const navBarRef = ref(null);
const cityStore = useCityStore();
const { city } = storeToRefs(cityStore);
const clickCity = (v: { id: string, name: string }) => {
  useCityStoreHook().setCity({
    name: v.name,
    code: v.id,
  });
  router.back()
};

function groupCitiesByFirstLetter(cities: any) {
  const groupedCities = <any>{};
  for (const cityId in cities) {
    const cityName = cities[cityId];
    // 获取城市名称的首字母
    const firstLetter = pinyin(cityName, { style: pinyin.STYLE_FIRST_LETTER, heteronym: false })[0][0].toUpperCase();
    if (!groupedCities[firstLetter]) {
      groupedCities[firstLetter] = [];
    }
    groupedCities[firstLetter].push({
      id: cityId,
      name: cityName,
    });
  }
  // 根据键名排序对象
  return Object.keys(groupedCities)
    .sort()
    .reduce((acc, key) => {
      acc[key] = groupedCities[key];
      return acc;
    }, {} as Record<string, any>);
}

const indexList = ref();
// 根据首字母对城市进行分组
onMounted(() => {
  indexList.value = groupCitiesByFirstLetter(areaList.city_list);
});

const hotCity=[
  {
    name:'北京',
    id:110100
  },
  {
    name:'上海',
    id:310100
  },
  {
    name:'广州',
    id:440100
  },
  {
    name:'深圳',
    id:440300
  },
  {
    name:'杭州',
    id:330100
  }


]

</script>

<template>
  <NavBar ref="navBarRef" fixed navbox title="城市选择" />
  <van-sticky :offset-top="46">
    <div class="bg-black p-20px">
      <div>
        当前位置：{{ city.name }}
      </div>
      <div class="mt-10px" >
        热门城市:
        <div class="flex flex-wrap  gap-20px p-10px justify-between items-center">
          <div @click="clickCity(v)" :key="k" class="b-rd-10px    linear p-x-20px " v-for="(v,k) in hotCity ">
            <div class=" ">{{v.name}}</div>
          </div>
        </div>
      </div>
    </div>

  </van-sticky>
  <div class="index">
    <van-index-bar :sticky="false" teleport="body">
      <div v-for="(item,index) in indexList" :key="item.id">
        <van-index-anchor :index="index" />
        <van-cell v-for="(v,k) in indexList[index]" :key="k" :title="v.name" @click="clickCity(v)" />
      </div>
    </van-index-bar>
  </div>

</template>

<style lang="less" scoped>

</style>
