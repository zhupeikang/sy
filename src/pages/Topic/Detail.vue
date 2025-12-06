<script setup lang="ts" name="TopicDetail">
import { TopicDisplayType, TopicItemType as ItemType } from '@/types';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import { getTopicItemListApi } from '@/api/topic';
import { favorTopicApi } from '@/api/favor';
import { showLoading } from '@/utils';
import AutoItem from '@/components/AutoItem.vue';
import { useRefreshStore } from '@/store/Refresh';

const dataList = ref<ItemType[]>([])
const limit = 10
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const errorText = ref('')
const topic_no = ref('')
const route = useRoute()
const refreshing = ref(false)
const topic = ref<TopicDisplayType>()
const favored = ref(false)
const onLoad = () => {
    if (loading.value) {
        return;
    }
    loading.value = true
    getTopicItemListApi({
        topic_no: topic_no.value,
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
            if (res.data.topic) {
                topic.value = res.data.topic
            }
            loading.value = false
            favored.value = res.data.favored
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
    topic.value = undefined
    onLoad()
}
watch(() => route.params.topic_no as string, newValue => {
    topic_no.value = newValue
}, {
    immediate: true
})
watch(() => topic_no.value, newValue => {
    dataList.value = []
    finished.value = false
    error.value = false
    onLoad()
}, {
    immediate: true
})
const refreshStore = useRefreshStore()
const onFavor = async () => {
    const loading = showLoading('提交中')
    const res = await favorTopicApi({
        topic_no: topic_no.value,
    })
    if (res) {
        loading.end()
        refreshStore.favor.topic = true
        if (res.data.result) {
            topic.value!.favors++
            favored.value = true
        } else {
            topic.value!.favors--
            favored.value = false
        }
    }


}
</script>
<template>
    <NavBar :title="topic?.name || '加载中'" />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <div class="background" :style="{
            backgroundImage: topic?.background ? 'url(' + topic.background + ')' : 'none'
        }" v-if="topic?.background">
            <div class="favor" @click="onFavor">
                <van-icon :name="favored ? 'like' : 'like-o'" />
                <span>{{ topic?.favors }}</span>
            </div>
        </div>
        <div class="favor" @click="onFavor" v-else>
            <van-icon :name="favored ? 'like' : 'like-o'" />
            <span>{{ topic?.favors }}</span>
        </div>
        <div v-if="topic?.description" class="text-desc">
            <div v-for="(item, index) in topic?.description.split('\n')" :key="index.toString()">
                {{ item }}
            </div>
        </div>
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-model:error="error"
            :error-text="errorText">

            <van-row :gutter="20" class="list">
                <template v-for="(_item, index) in dataList" :key="index.toString()">
                    <van-col span="12" v-if="_item.type == 'plan' ? _item.plan : _item.contract">
                        <AutoItem :type="_item.type" :item="_item.type == 'plan' ? _item.plan : _item.contract" />
                    </van-col>
                </template>

            </van-row>
        </van-list>
    </van-pull-refresh>
</template>
<style lang="less" scoped>
.favor {
    margin: var(--padding);
    color: var(--theme-deep-gold);

    span {
        margin-left: 10px;
    }
}

.background {
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 750px;
    height: 421.875px;

    .favor {
        position: absolute;
        bottom: var(--padding);
        left: var(--padding);
    }

}

.list {
    margin: var(--margin-outer);
}

.text-desc {
    padding: 10px;
    font-size: 28px;
    text-indent: 2em;
}
</style>
