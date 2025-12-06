<template>
    <van-swipe :autoplay="3000" lazy-render v-if="dataList.length > 0">
        <van-swipe-item v-for="(item, index) in dataList" :key="index.toString()">
            <img :src="item.src_url" class="banner" @click="onClick(item)" />
        </van-swipe-item>
    </van-swipe>
</template>
<script setup lang="ts">
import type { BannerType } from '@/types';
import { track } from '@/utils';
import { PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
    dataList: {
        type: Array as PropType<BannerType[]>,
        default: () => []
    },
    module:{
        type:String,
        default:'home'
    }
})

const dataList = ref<BannerType[]>([])
watch(
    () => props.dataList,
    (newData) => {
        dataList.value = newData
    },
    {
        deep: true,
        immediate: true
    }
)
const onClick = (item: BannerType) => {
    track(props.module, {
        action: 'banner_'+item.banner_id
    })
    if (item.click_event == 'push') {
        router.push(item.click_params.link)
        return
    }
    if (item.click_event == 'link') {
        window.location.href = item.click_params.link
        return
    }
}
</script>
<style scoped>
.banner {
    width: 750px;
    height: 421.875px;
    /* height: 320px; */
}
</style>
