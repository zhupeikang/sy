<script setup lang="ts">
import { ContractType, TopicType } from '@/types';
import { ref, watch } from 'vue';
import { getUserContractListApi, getUserTopicListApi } from '@/api/user';
import { useRouter } from 'vue-router';

const props = defineProps({
    uid: {
        type: Number,
        required: true
    }
})

const router = useRouter()

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const errorText = ref('')
const list = ref<ContractType[]>([])
const topicList = ref<TopicType[]>([])
const topicNo = ref('')

const limit = 18
const getList = () => {
    return new Promise((reslove, reject) => {
        getUserContractListApi({
            topic_no:topicNo.value,
            uid: props.uid,
            skip: list.value.length,
            limit,
            showError: true
        })
            .then(res => {
                if (res.code != 200) {
                    error.value = true
                    errorText.value = res.msg
                    reject(false)
                    return
                }
                if (res.data.list.length < limit) {
                    finished.value = true
                }
                if (res.data.list.length > 0) {
                    list.value = list.value.concat(res.data.list)
                }
                reslove(true)
            })
            .catch(err => {
                reject(false)
                error.value = true
                errorText.value = err.message
            })
            .finally(() => {
                refreshing.value = false
            })
    })
}

const onInit = async () => {
    //重置
    list.value = []
    topicList.value = []
    topicNo.value = ''
    finished.value = false;
    error.value = false
    errorText.value = ''
    refreshing.value = false
    loading.value = true
    const res = await Promise.all([
        getUserTopicListApi({
            uid: props.uid
        }),
        getList()
    ])
    if (res[0]) {
        topicList.value = res[0].data.list
    }
    loading.value = false
}
watch(() => props.uid, async (newValue) => {
    if (!newValue) return
    onInit();

}, {
    immediate: true
})


const onLoad = () => {
    if (loading.value) return

    loading.value = true
    getList()
        .finally(() => {
            loading.value = false
        })
}
const onRefresh = () => {
    onInit();
}

const chooseTopic = (no: string) => {
    if (no == topicNo.value) return;
    topicNo.value = no
    list.value = []
    finished.value = false
    loading.value = false
    error.value = false
    errorText.value = ''
    onLoad()

}
</script>
<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height:750px">
        <div class="flex margin">
            <van-tag size="large" :class="'margin-right ' + (topicNo == '' ? 'tag-active' : 'tag-unactive')"
                @click="chooseTopic('')">全部</van-tag>
            <van-tag v-for="(item, index) in topicList" :key="index.toString()" size="large"
                :class="'margin-right ' + (topicNo == item.topic_no ? 'tag-active' : 'tag-unactive')"
                @click="chooseTopic(item.topic_no)">{{ item.name }}</van-tag>
        </div>
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
            :error-text="errorText" :immediate-check="false">

            <div class="list">
                <div class="item shadow-gold clickable" v-for="(item, index) in list" :key="index.toString()"
                    @click="router.push('/contract/' + item.contract_no)">
                    <div class="cover" :style="{
                            backgroundImage: `url(${item.cover_url})`
                        }">
                        <!-- <div class="lock" v-if="item.lock_flag && item.lock_flag != 'no'"></div> -->
                    </div>
                    <div class="info">
                        <div class="van-ellipsis">{{ item.name }}</div>
                        <div class="no">{{ item.contract_no }}</div>
                    </div>
                </div>
            </div>
        </van-list>
    </van-pull-refresh>
</template>

<style scoped lang="less">
.list {
    margin: var(--block);
    background-repeat: no-repeat;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 20px;

    min-height: 300px;
    .item {
        background-image: url(@/assets/imgs/bg.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: top center;
        width: calc(33.33% - 14px);
        box-sizing: border-box;
        font-size: 24px;

        .cover {
            margin: 0 auto;
            width: 96%;
            padding-top: 96%;
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            position: relative;

            .lock {
                position: absolute;
                right: 10px;
                bottom: 10px;
                width: 27px;
                height: 34.5px;
                background-image: url(@/assets/imgs/lock.png);
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }
        }

        .info {
            box-sizing: border-box;
            padding: 0 10px;

            .no {
                color: #ffffff;
            }
        }
    }
}
</style>
