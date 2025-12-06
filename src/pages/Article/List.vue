<script setup lang="ts" name="ArticleCate">
import { ArticleType } from '@/types';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import { useDictStore } from '@/store/Dict';
import { getArticleListApi } from '@/api/article';
import Article from '@/components/Article.vue';
import router from '@/router';

const dictStore = useDictStore()
const route = useRoute()
const cate = ref<string>(route.params.cate as string || 'article')
const dataList = ref<ArticleType[]>([])
const limit = 20
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const errorText = ref('')
const onLoad = () => {
    if (loading.value) {
        return;
    }
    loading.value = true
    getArticleListApi({
        cate: cate.value,
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
        .finally(() => loading.value = false)
    console.log('onload')
}
watch(() => route.params.cate as string, newValue => {
    console.log('更换文章分类', newValue)
    cate.value = newValue || 'article'
}, { immediate: true })
watch(() => cate.value, newValue => {
    console.log('加载文章详情', newValue)
    dataList.value = []
    finished.value = false
    error.value = false
    onLoad()
}, { immediate: true })
// onLoad()
</script>
<template>
    <van-sticky>
        <NavBar :title="dictStore.getDictLabel('article_cate', cate)" :fixed="false" />
        <van-search :placeholder="'搜索' + dictStore.getDictLabel('article_cate', cate)" disabled @click="router.push('/search?type=article')"/>
    </van-sticky>
    <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-model:error="error"
        :error-text="errorText">
        <Article  v-for="(item, index) in dataList" :key="index.toString()" :item="item"/>
    </van-list>
</template>
