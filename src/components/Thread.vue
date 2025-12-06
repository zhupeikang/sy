<script setup lang="ts">
import { ThreadType } from '@/types';
import { PropType, ref, watch } from 'vue';
import Avatar from '@/components/Avatar.vue';
import { fuzzyTime } from '@/utils';
import { useRouter } from 'vue-router';
import { UploaderFileListItem } from 'vant';

const props = defineProps({
    thread: {
        type: Object as PropType<ThreadType>,
        default: '',
    },
    simple: {
        type: Boolean,
        value: false
    }
})

const router = useRouter()

const toUserHome = () => {
    router.push('/u/' + props.thread.uid)
}

const toAsset = () => {
    router.push('/asset/' + props.thread.asset.asset_no)
}

const images = ref<UploaderFileListItem[]>([])

watch(() => props.thread.images, (val) => {
    if (!val) {
        images.value = []
        return
    }
    images.value = val.map((item) => {
        return {
            url: item,
            status: 'done'
        }
    })
}, { immediate: true })

const emits = defineEmits(['like', 'click', 'reply'])
</script>
<template>
    <div class="box  shadow-gold clickable" @click="emits('click')">
        <div class="flex justify-between main">
            <Avatar :url="props.thread.user.avatar" @click.stop="toUserHome" />
            <div class="content">
                <div>
                    <div class="info flex justify-between">
                        <div class="name">{{ props.thread.user.nickname }}</div>
                        <div class="time">{{ fuzzyTime(props.thread.publish_at) }}</div>
                    </div>
                    <div :class="'text' + (simple ? ' simple' : '')">
                        <p v-for="(item, index) in props.thread.content.split('\n')" :key="index.toString">{{ item }}</p>
                    </div>
                </div>
                <div v-if="thread.parent_id == 0">
                    <div class="asset flex align-center" v-if="props.thread.asset">
                        <van-image width="100" height="100" :src="props.thread.asset.main_url" fit="contain" />
                        <div>
                            <div>{{ props.thread.asset.name }}</div>
                            <div>{{ props.thread.asset.asset_no }}</div>
                            <div @click.stop="toAsset" class="to">
                                点此查看
                                <van-icon name="arrow" />
                            </div>
                        </div>
                    </div>
                    <van-uploader :model-value="images" v-else-if="props.thread.images && props.thread.images.length > 0" :show-upload="false"
                        :deletable="false" @click.stop />


                </div>
            </div>
        </div>
        <div class="count-nav grid col-3 align-center van-hairline--top padding-top text-center"
            v-if="thread.parent_id == 0">
            <div>
                <van-icon name="share-o" size="18px" />
                {{ thread.shares }}
            </div>
            <div @click.stop="emits('like')">
                <van-icon :name="thread.liked ? 'good-job' : 'good-job-o'" size="18px" />
                {{ thread.likes }}
            </div>
            <div @click.stop="emits('reply')">
                <van-icon name="comment-o" size="18px" />
                {{ thread.replies }}
            </div>
        </div>
    </div>
</template>
<style scoped lang="less">
.box {
    margin: var(--margin-outer);
    padding: var(--padding);
    background: #1f1f1f;

    // background: var(--theme-gradual-cell);

    .main {

        gap: var(--block);

        .content {
            width: 580px;

            .info {
                font-size: var(--size-info);

                .time {
                    color: #666666;
                    font-size: 18px;
                }
            }

            .text {
                margin-top: var(--block);
                margin-bottom: var(--block);
                font-size: 26px;
                line-height: 36px;
                letter-spacing: 2px;
                p {
                    color: #d3d3d3;
                    margin: 0px;

                    min-height: 36px;
                }
            }

            .simple {
                max-height: 144px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .asset {
                font-size: var(--size-info);
                color: #ffffff;
                background: #1f1f1f;

                .to {
                    color: var(--theme-gold);

                }
            }
        }
    }


    .count-nav {
        font-size: 26px;
        >div>* {
            box-sizing: border-box;
            vertical-align: middle;
        }
    }
}</style>
