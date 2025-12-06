<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import type { UserType } from '@/types';
import { ref } from 'vue';
import { rpxToPx, showLoading } from '@/utils';
import { getFollowListApi } from '@/api/user';
import { useUserStore } from '@/store/User';
import router from '@/router';

const userStore = useUserStore()
const list = ref<{
    uid: number
    follow_uid: number
    followed: boolean
    _followed: boolean,
    user?: UserType,
    follow?: UserType
}[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const error = ref(false)
const errorText = ref('')

const props = defineProps({
    type: {
        type: String
    }
})

const limit = 20

const onLoad = () => {
    if (loading.value) return
    loading.value = true
    getFollowListApi({
        type: props.type,
        skip: list.value.length,
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
                list.value = list.value.concat(res.data.list)
            }
        })
        .catch(err => {
            error.value = true
            errorText.value = err.message
        })
        .finally(() => {
            loading.value = false
            refreshing.value = false
        })
};

const onRefresh = () => {
    // 清空列表数据
    finished.value = false;

    error.value = false
    errorText.value = ''
    // 重新加载数据
    list.value = []
    onLoad();
};
onLoad()

const onFollow = (item: any) => {
    showLoading()
    userStore.followUser(props.type == 'friend' ? item.follow_uid : (item.follow ? item.follow.uid : item.user.uid))
        .then(res => {
            item.followed = res.result
            if (res.result) {
                if (item.follow) {
                    item.follow.fans++
                } else {
                    item.user.fans++
                }
            } else {
                if (item.follow) {
                    item.follow.fans--
                } else {
                    item.user.fans--
                }
            }
        })
}
</script>
<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height:calc(100vh - 46px)">
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
            :error-text="errorText">
            <div class="list">
                <div class="item flex align-center padding clickable justify-between" v-for="(item, index) in list"
                    :key="index.toString()" @click="router.push('/u/' + (item.user?.uid || item.follow?.uid))">
                    <div class="flex align-center">

                        <Avatar :url="item.user?.avatar || item.follow?.avatar ||''" :size="rpxToPx(300)" />
                        <div class="info">
                            <div class="nickname">{{ item.user?.nickname || item.follow?.nickname }}</div>
                            <div class="id font-info">ID:{{ item.user?.user_code || item.follow?.user_code }}</div>
                            <div class="fans font-info">粉丝：{{ item.user ? item.user.fans : item.follow?.fans }}</div>
                        </div>
                    </div>

                    <van-button class="ignore-btn action" v-if="item.followed" @click.stop="onFollow(item)">取关</van-button>
                    <van-button class="ignore-theme-btn action" v-else @click.stop="onFollow(item)">{{ item._followed ? '回关'
                        : '关注'
                    }}</van-button>
                </div>
            </div>
        </van-list>
    </van-pull-refresh>
</template>
<style scoped lang="less">
.list {
    .flex{
        gap:20px;
    }
    .item {
        gap: 20px;
        color: #ffffff;

        .font-info {
            font-size: 26px;
            color: #a1a1a1
        }
    }
}</style>
