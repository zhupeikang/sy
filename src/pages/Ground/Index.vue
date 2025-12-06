<script setup lang="ts" name="Ground">
import { getHomeGroundApi } from '@/api/home';
import type { BannerType, TopicType } from '@/types';
import { showLoading, track } from '@/utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Banner from './components/Banner.vue';
import List from './components/List.vue';

const router = useRouter()
const banners = ref<BannerType[]>([])
const series = ref<TopicType[]>([])
const albums = ref<TopicType[]>([])
const onInit = () => {
  track('ground', {
    action: 'index'
  })
  const loading = showLoading()
  getHomeGroundApi()
    .then(res => {
      loading.end(() => {
        banners.value = res.data.banners
        series.value = res.data.series
        albums.value = res.data.albums
      })
    })
    .finally(() => {
      loading.end()
    })
}
const onClickBrand = (item: TopicType) => {
  track('ground', {
    action: 'brand_'+item.topic_no
  })
  router.push('/topic/' + item.topic_no)
  console.log('onClickBrand', item)
}
const onClickTopic = (item: TopicType) => {
  track('ground', {
    action: 'album_'+item.topic_no
  })
  router.push('/topic/' + item.topic_no)
  console.log('onClickTopic', item)
}
onInit()
const toSearch = () => {
  track('ground', {
    action: 'search'
  })
  router.push({
    path:'/search',
  })
}

const join = ()=>{
  track('ground', {
    action: 'artistapply'
  })
  router.push('/publisher/apply')
}
</script>

<template>
  <van-icon name="search" size="24px" class="ignore-search" color="var(--color-primary)" @click="toSearch" />
  <Banner :data-list="banners" />
  <List :data-list="series" title="推荐系列" @click-item="onClickBrand" url="/topic-series" />
  <List :data-list="albums" title="精选专题" @click-item="onClickTopic" url="/topic-album"  text-align="center"/>
  <div class="join-box">
    <van-button type="primary" class="ignore-theme-btn" block v-login="join">艺术家入驻</van-button>
  </div>
</template>
<style lang="less" scoped>
.join-box {
  padding: 20px;
}

.ignore-search {
  position: fixed;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 100;
}
</style>
