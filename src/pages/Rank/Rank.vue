<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import type { RankType } from '@/types';
import { ref } from 'vue';
import { rpxToPx } from '@/utils';
import router from '@/router';
import { getRankListApi } from '@/api/utils';

const list = ref<RankType[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const error = ref(false)
const errorText = ref('')

const props = defineProps({
    type: {
        type: String
    }
})

const limit = 20

const onLoad = () => {
    if (loading.value) return
    loading.value = true
    getRankListApi({
        type: props.type,
        skip: list.value.length,
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
                list.value = list.value.concat(res.data.list)
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
};

const onRefresh = () => {
    // 清空列表数据
    finished.value = false;

    error.value = false
    errorText.value = ''
    // 重新加载数据
    list.value = []
    onLoad();
};
onLoad()

</script>
<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height:calc(100vh - 46px)">
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
            :error-text="errorText">
            <van-cell-group :border="false">
                <van-cell class="cell align-center" v-for="(item, index) in list" :key="index.toString()" :border="false" @click="router.push('/u/'+(item.uid||item.publisher_uid))">
                    <template #icon>
                        <span :class="`rank rank_${index}`">{{ index + 1 }}</span>
                    </template>
                    <template #title>
                        <div class="flex align-center margin-left">
                            <Avatar :url="item.avatar" :size="rpxToPx(160)" class="margin-right"/>
                            {{ item.nickname }}
                        </div>

                    </template>
                    <template #value>
                        {{ props.type=='user' ? '收藏数' :'热度'  }}
                        ：{{ item.cnt }}
                    </template>
                </van-cell>
            </van-cell-group>
        </van-list>
    </van-pull-refresh>
</template>
<style scoped lang="less">
.cell {
    --van-cell-background: #1f1f1f;
    --van-cell-text-color: var(--van-cell-value-color);
    padding-top:30px;
    padding-bottom:30px;
    :deep(.van-cell__title){
        flex:2;
    }
    .rank {
        display: block;
        width: 37px;
        height: 33px;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        text-align: center;
    }

    .rank_0 {
        background-image: url(@/assets/imgs/rank_1.png);
        font-size: 0px;
    }

    .rank_1 {
        background-image: url(@/assets/imgs/rank_2.png);
        font-size: 0px;
    }

    .rank_2 {
        background-image: url(@/assets/imgs/rank_3.png);
        font-size: 0px;
    }
}

.cell:nth-child(2n) {
    --van-cell-background: #111111;
}</style>
