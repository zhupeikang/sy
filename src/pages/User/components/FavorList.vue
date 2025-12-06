<script setup lang="ts">
import type { FavorType } from '@/types';
import { ref, watch } from 'vue';
import { useDictStore } from '@/store/Dict';
import { cancelFavorApi, getFavorListApi } from '@/api/favor';
import { getPlanStatus, showLoading, toDatetime, toFixed } from '@/utils';
import { useRouter } from 'vue-router';
import Tag from '@/components/Tag.vue';
import Topic from '@/components/Topic.vue';
import { useRefreshStore } from '@/store/Refresh';

const router = useRouter()
const dictStore = useDictStore()
const list = ref<FavorType[]>([]);
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

const refreshStore = useRefreshStore()
watch(() => refreshStore.favor[props.type as 'plan' | 'remind' | 'topic'], newValue => {
    if(newValue){
        onRefresh()
    }
})
const limit = 10

const onLoad = () => {
    if (loading.value) return
    loading.value = true
    getFavorListApi({
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
            refreshStore.favor[props.type as 'plan' | 'remind' | 'topic'] = false
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
const onBeforeClose: (item: FavorType) => Promise<boolean> = (item: FavorType) => {
    return new Promise(async (resolve) => {
        const loading = showLoading()
        const res = await cancelFavorApi({
            favor_id: item.favor_id
        })
        if (res) {
            loading.end()
            list.value = list.value.filter((i) => i.favor_id != item.favor_id)

        }
        resolve(true)
    });
}

onLoad()
</script>
<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height:calc(100vh - 36px)">
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
            :error-text="errorText">
            <div :class="`${props.type}_list`">
                <template v-for="(item, index) in list" :key="index.toString()">
                    <van-swipe-cell :before-close="() => onBeforeClose(item)"
                        v-if="item.type == 'plan' || item.type == 'remind'" style="margin-bottom:10px">
                        <van-card :title="item.plan.subject" :thumb="item.plan.cover_url"
                            :tag="dictStore.getDictLabel('plan_status', getPlanStatus(item.plan))"
                            @click="router.push('/plan/' + item.plan.plan_no)" class="card"
                            :price="toFixed(item.plan.price / 100)">
                            <template #tags>
                                <div>
                                    {{ toDatetime(item.plan.begin_at) }} 发售
                                </div>
                            </template>
                            <template #desc>
                                <Tag title="限量" :value="item.plan.total_supply + '份'" />
                            </template>
                        </van-card>

                        <template #right>
                            <van-button square text="取消" type="danger" class="delete-button" />
                        </template>
                    </van-swipe-cell>
                    <Topic :item="item.topic" v-else-if="item.type == 'topic'">
                        <template #extend>
                            <van-icon name="cross" class="close" @click.stop="() => onBeforeClose(item)" />
                        </template>
                    </Topic>
                </template>

                <!-- <van-icon name="cross" class="close" @click.stop="() => onBeforeClose(item)"/> -->

            </div>
        </van-list>
    </van-pull-refresh>
</template>
<style scoped lang="less">
.card {
    color: #ffffff;
    font-size: 28px;
    --van-card-price-color: var(--theme-gold);
}

.delete-button {
    height: 100%;
}

.topic_list {
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0;
    gap: 20px;

    .close {
        position: absolute;
        top: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, .7);
        border-radius: 50%;
        padding: 10px;
    }
}</style>
