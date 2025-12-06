<template>
    <div class="item shadow-gold clickable">
        <div class="cover" :style="{
            backgroundImage: `url(${item.logo})`,
        }">

        </div>
        <div class="info">
            <div class="van-ellipsis subject" :style="`text-align:${props.textAlign}`">{{ item.name }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import type { DisplayType } from './List.vue';

const props = defineProps({
    item: {
        type: Object as PropType<DisplayType>,
        default: () => []
    },
    textAlign: {
        type: String,
        default: 'left'
    }
})
// 将props转换为响应式变量
const item = ref<DisplayType>()
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
    --width: 250px;
    display: inline-block;
    margin: var(--margin-outer) 20px 0 0;
    width: var(--width);
    // height: var(--height);
    background-image: url(@/assets/imgs/bg.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
    box-sizing: border-box;


    .cover {
        background-position: top center;
        background-size: cover;
        background-repeat: no-repeat;
        box-sizing: border-box;
        border-radius: 10px;
        position: relative;

        width: 250px;
        height: 250px;
        margin: 0 auto;
    }

    .info {
        padding: var(--padding-box);
        --height: 50px;
        height: var(--height);
        line-height: var(--height);
        //超出一行自动隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .subject {
            font-size: var(--size-info);
        }

    }
}
</style>
