<script setup lang="ts">
import { ArticleType } from '@/types';
import { PropType } from 'vue';
import router from '@/router';
import { toDatetime } from '@/utils';

const props = defineProps({
    item: {
        type: Object as PropType<ArticleType>,
        required: true
    }
})
const onClick = () => {
    if (props.item.type == 'push') {
        router.push(props.item?.url || '')
    } else if (props.item.type == 'link') {
        window.open(props.item.url)
    } else if (props.item.type == 'article') {
        router.push('/article/' + props.item.article_no)
    } else if (props.item.type == 'single') {
        router.push('/article/' + props.item.article_no)
    }
}
</script>
<template>
    <div class="item shadow-gold clickable" @click="onClick" v-if="item.cover_url">
        <div class="cover" :style="{
            backgroundImage: `url(${props.item.cover_url})`
        }">
            <div class="timeline">
                {{ toDatetime(item.publish_at) }}
            </div>

            <div class="title van-ellipsis">
                {{ item.subject }}
            </div>
        </div>

        <div class="summary" v-if="item.summary">
            {{ item.summary }}
        </div>
    </div>
    <div v-else class="item shadow-gold clickable" @click="onClick">

        <div class="timeline">
            {{ toDatetime(item.publish_at) }}
        </div>
        <div class="title van-ellipsis">
            {{ item.subject }}
        </div>

        <div class="summary" v-if="item.summary">
            {{ item.summary }}
        </div>
    </div>
</template>

<style lang="less" scoped>
.item {
    margin: 0 20px 20px;
    background: #33302b;
    border-radius: 10px;
    box-sizing: border-box;
    position: relative;

    .cover {
        box-sizing: border-box;
        width: 710px;
        height: 400px;
        position: relative;
        border-radius: 10px;
        background-size: 100% 100%;
        background-repeat: no-repeat;

        .timeline {
            border-radius: 10px;
            position: absolute;
            right: 0px;
            top: 0px;
            padding: 10px 20px;
            font-size: var(--size-info);
            background-color: rgba(0, 0, 0, .5)
        }

        .title {
            border-radius: 0 0 10px 10px;
            background: rgba(0, 0, 0, .7);
            position: absolute;
            bottom: 0px;
            left: 0px;
        }
    }

    .timeline {

        border-radius: 10px 10px 0 0;
        padding: 10px 20px;
        font-size: var(--size-info);
        background-color: rgba(0, 0, 0, .5)
    }

    .title {
        width: 670px;
        padding: 0 20px;
        border-radius: 0 0 10px 10px;
        height: calc(var(--size-subject)*2);
        line-height: calc(var(--size-subject)*2);
        font-size: var(--size-subject);
        color: var(--theme-gold);
    }

    .summary {
        padding: 0 20px 10px;
        font-size: var(--size-info);
    }
}
</style>
