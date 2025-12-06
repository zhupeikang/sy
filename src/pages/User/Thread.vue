<script setup lang="ts" name="UserThread">
import { ThreadType as ItemType } from '@/types';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import router from '@/router';
import { getUserThreadListApi } from '@/api/user';
import Thread from '@/components/Thread.vue';
import { likeForumThreadApi } from '@/api/forum';

const dataList = ref<ItemType[]>([])
const limit = 10
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const errorText = ref('')
const type = ref('')
const route = useRoute()
const refreshing = ref(false)
const onLoad = () => {
    if (loading.value) {
        return;
    }
    loading.value = true
    getUserThreadListApi({
        type: type.value,
        skip: dataList.value.length,
        limit,
        showError: true
    })
        .then(res => {
            if (res.code != 200) {
                error.value = true
                errorText.value = res.msg
                return
            }
            if (res.data.list.length < limit) {
                finished.value = true
            }
            if (res.data.list.length > 0) {
                dataList.value = dataList.value.concat(res.data.list)
            }
        })
        .catch(err => {
            error.value = true
            errorText.value = err.message
        })
        .finally(() => {
            loading.value = false
            refreshing.value = false
        })
    console.log('onload')
}
const onRefresh = () => {
    dataList.value = []
    finished.value = false
    error.value = false
    refreshing.value = true
    onLoad()
}
watch(() => route.params.type as string, newValue => {
    type.value = newValue
}, {
    immediate: true
})
watch(() => type.value, newValue => {
    dataList.value = []
    finished.value = false
    error.value = false
    onLoad()
})
const liking = ref('')
const onLike = async(item:ItemType)=>{
    if(liking.value){
        return
    }
    liking.value = item.thread_no
    const res = await likeForumThreadApi({
        thread_no: item.thread_no
    }).catch((err) => {
        console.error(err)
        liking.value = ''
    })
    liking.value = ''
    if (res) {

        item.liked = res.data.result
        if (res.data.result) {
            item.likes++
        }else{
            item.likes--
        }
    }
}
</script>
<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height: 100vh">
        <NavBar title="我的动态" />

        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-model:error="error"
            :error-text="errorText">
            <Thread :thread="item" v-for="(item,index) in dataList" :key="index.toString()" @like="onLike(item)" @click="router.push('/thread/'+item.thread_no)" @reply="router.push('/thread/'+item.thread_no)" simple/>
        </van-list>
    </van-pull-refresh>
</template>
