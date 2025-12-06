<script setup lang="ts" name="Game">
import { GameType } from '@/types';
import { ref } from 'vue';
import { getGameListApi } from '@/api/game';
import { useDictStore } from '@/store/Dict';
import router from '@/router';

const dataList = ref<GameType[]>([])
const limit = 20
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const errorText = ref('')
const dictStore = useDictStore()
const onClick = (item: GameType) => {
    router.push('/game/'+item.game_id)
}
const onLoad = () => {
    if (loading.value) {
        return;
    }
    loading.value = true
    getGameListApi({
        skip: dataList.value.length,
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
                dataList.value = dataList.value.concat(res.data.list)
            }
        })
        .finally(() => loading.value = false)
    console.log('onload')
}
</script>
<template>
    <div class="navbar">
        <div class="title">游戏中心</div>
<!--        <span class="desc">玩游戏可获得精美资产</span>-->
    </div>
    <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-model:error="error"
        :error-text="errorText">
        <div v-for="(item, index) in dataList" :key="index.toString()">
            <div class="item shadow-gold clickable " @click="onClick(item)">
                <div class="cover" :style="{
                    backgroundImage: `url(${item.cover_url})`
                }">


                </div>
                <div class="info">
                    <div class="flex">

                        <div class="title van-ellipsis">{{ item.name }}</div>
                        <van-tag type="primary" class="cate">{{ dictStore.getDictLabel('game_type', item.type) }}</van-tag>
                    </div>
                    <!-- <div class="desc">{{ item.desc }}</div> -->
                </div>
            </div>
        </div>
    </van-list>
</template>
<style lang="less" scoped>
.navbar {
    padding: 20px;
    font-size: 32px;

    .title {
        display: inline-block;
        position: relative;
    }

    .title:after {
        content: ' ';
        background: var(--theme-gradual-gold);
        height: 5px;
        width: 100%;
        position: absolute;
        bottom: -10px;
        left: 0px;
    }

    .desc {
        font-size: 28px;
        margin-left: 20px;
        ;
        color: var(--gray)
    }
}

.item {
    margin: 20px 20px 0;
    background: #fff;

    border-radius: 10px;

    .cover {
        width: 710px;
        height: 400px;
        position: relative;
        border-radius: 10px 10px 0 0;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
    }

    .info {
        background: #312e2a;
        padding: var(--padding-box);

        .title {
            color: var(--theme-gold);
            max-width: 550px;
        }

        .cate {
            margin-left: 10px;
            background-color: #000000;
            color: var(--theme-gold);
            border-radius: 10px;
        }

        .desc {
            font-size: var(--size-info);
            color: var(--gray);
            //超出一行隐藏
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
            word-break: break-all;
        }
    }

}
</style>
