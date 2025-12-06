<template>
    <van-grid v-if="dataList.length > 0" :border="false" clickable :column-num="configStore.getConfig('home-grid',5)">
        <van-grid-item :icon="item.src_url" :text="item.name" v-for="(item, index) in dataList" :key="index.toString()" @click="onClick(item)"/>
    </van-grid>
</template>
<script setup lang="ts">
import { useConfigStore } from '@/store/Config';
import { useUserStore } from '@/store/User';
import type { GridType } from '@/types';
import { track } from '@/utils';
import { showToast } from 'vant';
import { PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const configStore = useConfigStore()


const props = defineProps({
    dataList: {
        type: Array as PropType<GridType[]>,
        default: () => []
    }
})
const router = useRouter()
// 将props转换为响应式变量
const dataList = ref<GridType[]>([])
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

const onClick = (item:GridType)=>{
    track('home', {
        action: 'grid_'+item.grid_id
    })
    if(item.click_params.link=='toGallery'){
        //判断是否登录
        if(!userStore.isLogin){
            showToast('请先登录')
            router.push('/login')
            return
        }
        router.push('/gallery?uid='+userStore.userInfo?.uid)
        return
    }
    if(item.click_event=='push'){
        router.push(item.click_params.link)
        return
    }
    if(item.click_event=='link'){
        window.location.href = item.click_params.link
        return
    }
}
</script>
