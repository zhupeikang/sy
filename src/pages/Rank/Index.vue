<script setup lang="ts" name="Rank">
import { reactive, ref, watch } from 'vue';
import Back from '@/components/Back.vue';
import Rank from './Rank.vue';

const tab = ref('user')
const actives = reactive({
    user: false,
    publisher: false
})
watch(() => tab.value as 'user' | 'publisher', (newValue) => {
    actives[newValue] = true
}, {
    immediate: true
})
</script>
<template>
    <Back />
    <van-tabs v-model:active="tab" sticky class="ignore-tabs">
        <van-tab title="收藏家财富榜" name="user">
            <Rank type="user" v-if="actives.user" />
        </van-tab>
        <van-tab title="品牌发行榜" name="publisher">
            <Rank type="publisher" v-if="actives.publisher" />
        </van-tab>
    </van-tabs>
</template>
<style scoped lang="less">
:deep(.van-tabs__nav) {
    padding-left: 50px;
    padding-right: 50px;
}
</style>
