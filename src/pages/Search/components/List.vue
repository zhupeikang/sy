<script setup lang="ts">
import { gerSearchListApi } from '@/api/search';
import { SearchType } from '@/types';
import { ref } from 'vue';
import User from './User.vue';
import Topic from '@/components/Topic.vue';
import Plan from '@/components/Plan.vue';
import Contract from '@/components/Contract.vue';
import Article from '@/components/Article.vue';

const keyword = ref('')
const list = ref<SearchType[]>([]);
const loading = ref(false);
const finished = ref(false);
const error = ref(false)
const errorText = ref('')

defineExpose({
    search: (value: string, force: boolean) => {
        console.log('search', value)

        if (keyword.value != value || force) {
            keyword.value = value
            list.value = []
            loading.value = false
            finished.value = false
            error.value = false
            errorText.value = ''
            if (value.length > 0) {
                onLoad()
            }
        }
    },
    clear: () => {
        console.log('clear')

    }
})
const props = defineProps({
    type: {
        type: String,
        default: 'all'
    }
})
const limit = 20
const onLoad = () => {
    if (keyword.value.length == 0) return
    if (loading.value) return
    loading.value = true
    gerSearchListApi(props.type, {
        keyword: keyword.value,
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
        })
};

</script>
<template>
    <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
        :error-text="errorText" :immediate-check="false">

        <div :class="`list-${props.type}`">
            <template v-for="(item, index) in list" :key="index.toString()">
                <!-- {{ item }} -->
                <User v-if="item.searchType == 'user' || item.searchType == 'publisher'" :item="item" />
                <Topic v-else-if="item.searchType == 'series' || item.searchType == 'brand'|| item.searchType == 'album'" :item="item" />
                <Plan v-else-if="item.searchType == 'plan'" :item="item" class="plan" />
                <Contract v-else-if="item.searchType == 'contract'" :item="item" class="contract" />
                <Article v-else-if="item.searchType == 'article'" :item="item" />
            </template>
        </div>

    </van-list>
</template>
<style scoped lang="less">
.plan,
.contract {
    margin: var(--margin-outer) var(--margin-outer) 0 !important;
    display: inline-block !important;
}

.plan:nth-child(2n),
.contract:nth-child(2n) {
    margin-left: 0px !important;
}
.list-series,.list-brand {
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0;
    gap: 20px;
}
</style>
