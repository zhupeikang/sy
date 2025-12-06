<script setup lang="ts">
import { getLinkApi } from '@/api/utils';
import router from '@/router';
import { showLoading } from '@/utils';
import { useRoute } from 'vue-router';

const route = useRoute()

const onLoad = async()=>{
    const loading = showLoading('跳转中')
    const res = await getLinkApi({
        link_no:route.params.link_no
    })
    if(res){
        loading.end()
        if(res.data.type=='link'){
            window.location.href = res.data.url
        }else{
            router.push(res.data.url)
        }
    }
}
onLoad()
</script>
<template>

</template>