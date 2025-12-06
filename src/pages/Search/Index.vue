<script setup lang="ts" name="Search">
import { ref, watch } from 'vue';
import router from '@/router';
import List from './components/List.vue';
import { SearchInstance } from 'vant';
import { useRoute } from 'vue-router';

const route = useRoute()
const onBack = () => {
    router.back()
}
const inputing = ref(false)//代表是否输入中
const keyword = ref('')
const text = ref('')
const type = ref(route.query?.type as string || 'plan')
watch(()=>route.query?.type,value=>{
    type.value = value as string || 'plan'
},{
    immediate:true
})

const listPlanRef = ref<InstanceType<typeof List>>()
const listContractRef = ref<InstanceType<typeof List>>()
const listArticleRef = ref<InstanceType<typeof List>>()
const listUserRef = ref<InstanceType<typeof List>>()
const listPublisherRef = ref<InstanceType<typeof List>>()
const listSeriesRef = ref<InstanceType<typeof List>>()
const listBrandRef = ref<InstanceType<typeof List>>()
const listAlbumRef = ref<InstanceType<typeof List>>()
const maps: {
    [key: string]: any
} = {
    plan: listPlanRef,
    contract: listContractRef,
    article: listArticleRef,
    user: listUserRef,
    publisher: listPublisherRef,
    series: listSeriesRef,
    brand: listBrandRef,
    album: listAlbumRef,
}
const onSearch = () => {
    keyword.value = text.value

    maps[type.value]?.value?.search(keyword.value,true)
}
const onBlur = () => {
    inputing.value = false
    setTimeout(() => {
        text.value = keyword.value
    }, 500)
}
const searchRef = ref<SearchInstance>();

const toInput = () => {
    inputing.value = true
    searchRef.value?.focus()
}

const onChange = () => {
    maps[type.value]?.value?.search(keyword.value,false)
}

</script>
<template>
    <div class="ignore-navbar">
        <van-icon name="arrow-left" @click="onBack" class="back" />
        <van-search v-model="keyword" placeholder="请输入搜索关键词" class="searchbar" disabled @click="toInput"
            v-show="!inputing" />
        <van-search v-model="text" placeholder="请输入搜索关键词" class="searchbar" @search="onSearch" @blur="onBlur"
            v-show="inputing" ref="searchRef" />
        <van-button class="ignore-theme-btn" @click="onSearch">搜索</van-button>
    </div>
    <div class="ignore-mask" v-show="keyword.length == 0 || inputing"></div>
    <div v-show="keyword.length>0 && !inputing">
        <van-tabs v-model:active="type" class="ignore-tabs" @change="onChange" :lazy-render="false">
        <!-- <van-tab title="综合">
            <List type="all" ref="listAllRef" />
        </van-tab> -->
        <van-tab title="套餐" name="plan">
            <List type="plan" ref="listPlanRef" />
        </van-tab>
        <van-tab title="合约" name="contract">
            <List type="contract" ref="listContractRef" />
        </van-tab>
        <van-tab title="用户" name="user">
            <List type="user" ref="listUserRef" />
        </van-tab>
        <van-tab title="发行商" name="publisher">
            <List type="publisher" ref="listPublisherRef" />
        </van-tab>
        <van-tab title="文章" name="article">
            <List type="article" ref="listArticleRef" />
        </van-tab>
        <van-tab title="系列" name="series">
            <List type="series" ref="listSeriesRef" />
        </van-tab>
        <van-tab title="品牌" name="brand">
            <List type="brand" ref="listBrandRef" />
        </van-tab>
        <van-tab title="专题" name="album">
            <List type="album" ref="listAlbumRef" />
        </van-tab>
    </van-tabs>
</div>

</template>
<style scoped lang="less">
.ignore-navbar {
    display: flex;
    align-items: center;
    padding: 0 16px;

    .back {
        font-size: 20px;
        color: #ffffff;
    }

    .searchbar {
        flex: 1;
        margin-left: 16px;
    }
}

.ignore-tabs {
    --van-tabs-nav-background: transparent;

    :deep(.van-tab__panel) {
        height: calc(100vh - var(--van-search-input-height) - 20px - var(--van-tabs-line-height));
        overflow-y: scroll;
        overflow-x: hidden;
    }
}

.ignore-mask {
    background: var(--theme-bg);
    position: fixed;
    z-index: 10;
    bottom: 0px;
    left: 0px;
    width: 100vw;
    height: calc(100vh - var(--van-search-input-height) - 20px);
}</style>
