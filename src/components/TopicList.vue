<template>
    <Topic :item="item" v-for="(item, index) in dataList" :key="index.toString()" />
</template>
<script setup lang="ts">
import type { TopicDisplayType } from '@/types';
import { PropType, ref, watch } from 'vue';
import Topic from './TopicBox.vue';

const props = defineProps({
    dataList: {
        type: Array as PropType<TopicDisplayType[]>,
        default: () => []
    },
    gutter: {
        type: Number,
        default: 20,
    },
})

// 将props转换为响应式变量
const dataList = ref<TopicDisplayType[]>([])
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
