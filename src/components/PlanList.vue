<template>
    <van-row class="list">
        <van-col span="12" v-for="(item, index) in dataList" :key="index.toString()">
            <Plan :item="item"/>
        </van-col>
    </van-row>
</template>
<script setup lang="ts">
import type { PlanDisplayType } from '@/types';
import { PropType, ref, watch } from 'vue';
import Plan from './Plan.vue';

const props = defineProps({
    dataList: {
        type: Array as PropType<PlanDisplayType[]>,
        default: () => []
    },
    gutter: {
        type: Number,
        default: 20,
    },
})

// 将props转换为响应式变量
const dataList = ref<PlanDisplayType[]>([])
watch(
    () => props.dataList,
    (newData) => {
        dataList.value = newData
    },
    {
        deep: true,
        immediate: true
    }
)
</script>
<style lang="less" scoped>
.list {
    margin: var(--margin-outer);
}
</style>
