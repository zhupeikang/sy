<template>
    <div class="box" >
        <van-cell is-link @click="toTopic(item.topic_no)" :border="false">
            <template #title>
                <span class="ignore-title">{{ item.name }}</span>
                <span class="desc">{{ item.description.substring(0, 10) }}</span>
            </template>
        </van-cell>
        <div v-if="item.children && item.children.length > 0" class="list">
            <div class="item" :class="{itemNone:_item.type == 'plan'&&!_item.plan}" v-for="(_item, index) in  item.children " :key="index.toString()" @click="onClick(_item)">
                <template v-if="_item.type == 'plan'" >
                    <div class="cover" :style="{backgroundImage: `url(${_item.plan?.cover_url})`}">
                      <div class="tags">
                        <div class="hot" v-if="_item.plan?.hot_flag == 'Y'" />
                      </div>
                    </div>
                    <div class="info">
                      <div class="van-ellipsis subject">{{ _item.plan?.subject }}</div>
                      <div class="flex justify-between align-center ">
                        <Tag title="限量">
                          <template #value>
                            <div>
                              {{ _item.plan?.total_supply }}份
                            </div>
                          </template>
                        </Tag>
                        <div class="price">
                          <Price :value="_item.plan?.price / 100" />
                        </div>
                      </div>
                    </div>
                </template>
                <template v-else-if="_item.type == 'contract'">
                  <div class="cover" :style="{
                            backgroundImage: `url(${_item.contract?.cover_url})`,
                        }">
                  </div>
                  <div class="info">
                    <div class="van-ellipsis subject">{{ _item.contract.name }}</div>
                    <div class="flex justify-between align-center ">
                      <Tag title="限量">
                        <template #value>
                          <div>
                            {{ _item.contract.total_supply }}份
                          </div>
                        </template>
                      </Tag>
                    </div>
                  </div>
                </template>

            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { TopicDisplayType, TopicItemType } from '@/types';
import { PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Price from './Price.vue';
import Tag from './Tag.vue';

const router = useRouter()
const props = defineProps({
    item: {
        type: Object as PropType<TopicDisplayType>,
        default: () => []
    },
})
// 将props转换为响应式变量
const item = ref<TopicDisplayType>()
watch(
    () => props.item,
    (newData) => {
        item.value = newData
        console.log(newData)
    },
    {
        deep: true,
        immediate: true
    }
)
const toTopic = (topic_no: string) => {
    router.push('/topic/' + topic_no)
}

const onClick = (item: TopicItemType) => {
    if (item.type == 'plan') {
        router.push('/plan/' + item.plan?.plan_no)
    } else if (item.type == 'contract') {
        router.push('/contract/' + item.contract?.contract_no)
    }
}
</script>
<style lang="less" scoped>
.box {
    margin: 20px;
    border-radius: 10px;
    border: 1px solid #4f483d;

    background-color: #101011;
    --van-cell-background: transparent;
    --van-cell-text-color: var(--theme-gold);

    .ignore-title {
        font-size: 20px;
    }

    .desc {
        margin-left: 60px;
        color: var(--theme-deep-gray);
    }

    .list {

        --van-cell-vertical-padding: 10px;
        --van-cell-horizontal-padding: 16px;
        overflow-x: scroll;
        display: flex;
        flex-wrap: nowrap;
        gap: 20px;
        padding: 0 var(--van-cell-horizontal-padding) var(--van-cell-vertical-padding);
        --width: 324.5px;
        --height: 299.2px;

        .item {
            display: block;
            box-sizing: border-box;
            height: var(--height);
            width: var(--width);
            box-shadow: 0 0 3px 0 var(--theme-gold);
            cursor: pointer;
            border-radius: 10px;
            color: #fff;
            position: relative;
            background-image: url(../assets/imgs/bg-simple.png);
            background-size: cover;
            background-repeat: no-repeat;


            .cover {
                border-radius: 10px 10px 0 0;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                position: relative;
                width: var(--width);
                margin-top: 6px;
                height: 170px;

                .tags {
                    position: absolute;
                    right: 10px;
                    top: 4px;

                    .hot {
                        width: 102px;
                        height: 37px;
                        background-image: url(../assets/imgs/hot.png);
                        background-size: contain;
                        background-repeat: no-repeat;
                    }

                    :deep(.van-tag) {
                        margin-left: 10px;
                    }
                }
            }

            .info {
                margin-top: 15px;
                box-sizing: border-box;
                width: var(--base-size);
                padding: var(--padding-box);
                border-radius: 0 0 10px 10px;

                .subject {
                    font-size: var(--size-subject);
                }

                .extra {

                    height: calc(var(--size-subject) * 1.5);
                    font-size: var(--size-info);
                    display: flex;
                    justify-content: space-between;
                    color: var(--color-price);

                    .price {
                        margin-left: 5px;
                    }
                }
            }
        }

        .item:hover,
        .item:focus {
            box-shadow: 0 0 10px 0 var(--theme-gold);
        }
      .itemNone{
        display: none;
      }
    }

    .list::-webkit-scrollbar {
        display: none;
    }
}</style>
