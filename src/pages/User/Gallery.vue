<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { PATH_URL } from '@/config/axios/service';

const route = useRoute()
const uid = ref(route.query.uid)
const returnURL = ref(route.query.returnURL)

</script>
<template>
    <iframe :src="`/gallery.html?page=1&uid=${uid}&domain=${encodeURIComponent(PATH_URL+'/v2')}&returnUrl=${returnURL}`" class="gallery"/>
</template>
<style scoped lang="less">
.gallery{
    height:100vh;
    width:100vw;
    border:none;

}
</style>
