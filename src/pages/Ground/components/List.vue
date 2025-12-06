<template>
    <div class="box shadow-gold margin">
        <van-cell :title="props.title" is-link @click="toUrl()" :border="false"/>
        <div v-if="dataList.length > 0" class="list">
            <Item :item="_item" v-for="(_item, index) in dataList" :key="index.toString()" @click="emits('click-item',_item)" :text-align="props.textAlign"/>
        </div>
    </div>
</template>
<script setup lang="ts">
import { track } from '@/utils';
import { PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Item from './Item.vue';

export type DisplayType = {
    name:string
    logo:string
}
const emits = defineEmits(['click-item'])
const router = useRouter()
const toUrl = ()=>{
    track('ground', {
        action: props.url.split('-')[1]
    })
    router.push(props.url)
}
const props = defineProps({
    dataList: {
        type: Array as PropType<DisplayType[]>,
        default: () => []
    },
    title:{
        type:String,
    },
    url:{
        type:String,
        required:true
    },

    textAlign:{
        type:String,
        default:'left'
    }

})
// 将props转换为响应式变量
const dataList = ref<DisplayType[]>()
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
.box {
    --van-cell-background:transparent;
    --van-cell-text-color:var(--theme-deep-gold);
    .list {
        white-space:nowrap;
        overflow-y: scroll;
        padding: 0 20px 10px;
    }

    .list::-webkit-scrollbar {
        display: none;
    }
}
</style>
