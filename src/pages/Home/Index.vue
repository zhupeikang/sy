<script setup lang="ts" name="Home">
import { getHomeIndexApi, getPlanType } from '@/api/home';
import type { BannerType, GridType } from '@/types';
import { showLoading, track } from '@/utils';
import { ref } from 'vue';
import Banner from '@/components/Banner.vue';
import Grid from './components/Grid.vue';
import Content from './components/Content.vue';

const banners = ref<BannerType[]>([])
const grids = ref<GridType[]>([])
const onInit = () => {
  track('home', {
    action: 'index'
  })
  const loading = showLoading()
  getHomeIndexApi()
    .then(res => {
      loading.end(() => {
        banners.value = res.data.banners
        grids.value = res.data.grids
      })
    })
    .finally(() => {
      loading.end()
    })

}
onInit()
</script>

<template>
  <Banner :dataList="banners" v-if="banners.length > 0" />
  <Grid :dataList="grids" v-if="grids.length > 0" />
  <Content />
</template>
