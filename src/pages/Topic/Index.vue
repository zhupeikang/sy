<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getTopicHomeApi } from '@/api/topic';
import NavBar from '@/components/NavBar.vue';
import router from '@/router';

onMounted(() => {
  getData();
});
const data = ref<any>(null);
const getData = () => {
  getTopicHomeApi().then((res) => {
    data.value = res.data.list;
  });
};

const go = (item: {url:string}) => {
  router.push(item.url);
};
</script>

<template>
  <NavBar title="品牌馆" />

  <div>
    <div v-for="(item,index) in data" :key="index">
      <div class="padding" @click="go(item)">
        <img class="img" :src="item.img_src" alt="">
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.img {
  width: 100%;
  border-radius: 6px;
  object-fit: contain;
  box-shadow: 0 0 10px 5px var(--theme-deep-gold);
}
</style>
