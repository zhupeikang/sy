<script setup lang="ts" name="Forum">
import { getForumHomeApi } from '@/api/forum';
import Loading from '@/components/Loading.vue';
import Error from '@/components/Error.vue';
import { ref, watch } from 'vue';
import type { BannerType } from '@/types';
import Banner from '@/components/Banner.vue';
import { useRouter } from 'vue-router';
import List from './components/ThreadList.vue';
import { track } from '@/utils';

const loading = ref(true)
const errorShow = ref(false)
const errorText = ref('')
const banners = ref<BannerType[]>([])
const router = useRouter()
const onInit = async () => {
    track('forum', {
        action: 'index'
    })
    const res = await getForumHomeApi({
        showError: true
    })
        .catch(err => {
            errorShow.value = true
            errorText.value = err
        })
    loading.value = false
    if (res) {
        if (res.code == 200) {
            banners.value = res.data.banners
        } else {
            errorShow.value = true
            errorText.value = res.msg
        }
    }
}
const toAdd = () => {
    track('forum', {
        action: 'button'
    })
    router.push('/forum/add')
}
onInit()

const active = ref(0)
const tabs = ref<{
    title: string;
    type: string;
    show: boolean;
}[]>([
    { title: '推荐', type: 'recommend', show: true },
    { title: '官方', type: 'official', show: false },
    { title: '最新', type: 'new', show: true },
])
watch(() => active.value, (val) => {
    tabs.value[val].show = true
    track('forum', {
        action: active.value
    })
}, {
    immediate: true
})
const toSearch = () => {
    track('forum', {
        action: 'search'
    })
    router.push('/search')
}
const toMessage = ()=>{
    track('forum', {
        action: 'message'
    })
    router.push('/message')
}
const toRank = ()=>{
    track('forum', {
        action: 'rank'
    })
    router.push('/rank')
}
</script>
<template>
    <Error :text="errorText" :show="errorShow" />
    <Loading mask v-if="loading" />
    <div v-else>
        <div class="clickable floatBtn" v-login="toAdd" ></div>
        <div class="top-actions">
            <div class="search" @click="toSearch"></div>
            <div class="msg" @click="toMessage"></div>
        </div>
        <Banner :dataList="banners" module="forum" />
        <div class="rank" @click="toRank">
            <div class="btn"></div>
        </div>
        <van-tabs v-model:active="active" swipeable sticky class="ignore-tabs">
            <van-tab :title="item.title" v-for="item in tabs" :key="item.type">
                <List v-if="item.show" :type="item.type" />
            </van-tab>
        </van-tabs>
    </div>
</template>
<style scoped lang="less">
.rank {
    height: 96px;
    background-image: url(@/assets/imgs/rank_banner.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: relative;
    cursor: pointer;

    .btn {
        position: absolute;
        right: 20px;
        height: 48px;
        width: 96px;
        top: 24px;
        background-image: url(@/assets/imgs/btn_view.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
}

.floatBtn {

    z-index: 1000;
    position: fixed;
    bottom: calc(120px + constant(safe-area-inset-bottom));//兼容ios有底部导航栏的情况
    bottom: calc(120px + env(safe-area-inset-bottom));//兼容ios有底部导航栏的情况
    right: 20px;
    width:96px;
    height: 96px;
    background-image: url(@/assets/imgs/btn_add.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;

}

.top-actions{
    position: absolute;
    top:20px;
    right:20px;
    z-index: 10;
    .search,.msg{
        width: 64px;
        height: 64px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        display: inline-block;
        margin-left: 20px;
        opacity: .9;
    }
    .search{
        background-image: url(@/assets/imgs/icon_search.png);
    }
    .msg{
        background-image: url(@/assets/imgs/icon_msg.png);
    }
}
</style>
