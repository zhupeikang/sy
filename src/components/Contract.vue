<template>
    <div class="item" @click="onClick">
        <div class="cover" :style="{
            backgroundImage: `url(${item.cover_url})`,
        }">
            <!-- <div class="tags">
                <van-tag mark type="primary" size="medium" v-if="item.hot_flag == 'Y'">热门</van-tag>
                <van-tag mark type="primary" size="medium" v-if="item.status == 'out'">售罄</van-tag>
            </div> -->

        </div>
        <div class="info">
            <div class="van-ellipsis subject">{{ item.name }}</div>
            <div class="flex justify-between align-center ">
                <Tag title="发售" :value="`${item.total_supply}份`" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { ContractDisplayType } from '@/types';
import { PropType, ref, watch } from 'vue';
import Tag from './Tag.vue';
import router from '@/router';

const onClick = () => {
    router.push('/contract/' + props.item.contract_no)
}
const props = defineProps({
    item: {
        type: Object as PropType<ContractDisplayType>,
        default: () => []
    },
})
// 将props转换为响应式变量
const item = ref<ContractDisplayType>()
watch(
    () => props.item,
    (newData) => {
        item.value = newData
    },
    {
        deep: true,
        immediate: true
    }
)
</script>
<style lang="less" scoped>
.item {
    cursor: pointer;
    display: block;
    margin: var(--margin-outer) auto 0;
    --width: 341px;
    --height: 438px;
    height: var(--height);
    width: var(--width);
    box-sizing: border-box;
    border-radius: 10px;
    color: #fff;
    position: relative;
    background-image: url(../assets/imgs/bg.png);
    background-size: cover;
    background-repeat: no-repeat;

    .cover {
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        position: relative;
        width: var(--width);
        height: var(--width);

        .tags {
            position: absolute;
            right: 10px;
            top: 10px;

            :deep(.van-tag) {
                margin-left: 10px;
            }
        }
    }

    .info {
        box-sizing: border-box;
        width: var(--base-size);
        padding: 0 20px 10px;
        border-radius: 0 0 10px 10px;

        .subject {
            font-size: var(--size-subject);
        }

    }
}
.item:hover,.item:focus{
    box-shadow: 0 0 10px 0 var(--theme-gold);
}
</style>
