<script setup lang="ts" name="TopicList">
import { TopicDisplayType as ItemType } from '@/types';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import { getTopicListApi } from '@/api/topic';
import { useDictStore } from '@/store/Dict';
import Topic from '@/components/Topic.vue';

const dictStore = useDictStore()
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
    getTopicListApi({
        cate: type.value,
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
watch(() => route.params.cate as string, newValue => {
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

</script>
<template>
    <NavBar :search="type" :title="dictStore.getDictLabel('topic_cate', type)" />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-model:error="error"
            :error-text="errorText">
            <div class="list">
                <Topic v-for="(item, index) in dataList" :key="index.toString()" :item="item" favor />
            </div>
        </van-list>
    </van-pull-refresh>
</template>
<style lang="less" scoped>
.list {
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0;
    gap: 20px;
}
</style>
