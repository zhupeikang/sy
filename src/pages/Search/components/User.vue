<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import type { UserType } from '@/types';
import { PropType, ref, watch } from 'vue';
import { showLoading } from '@/utils';
import { useUserStore } from '@/store/User';
import router from '@/router';

const props = defineProps({
    item: {
        type: Object as PropType<UserType>,
        required: true
    }
})

const data = ref<UserType>()
watch(() => props.item, (value) => {
    data.value = value
}, {
    immediate: true
})
const userStore = useUserStore()
const onFollow = () => {
    showLoading()
    userStore.followUser(data.value?.uid || 0)
        .then(res => {
            data.value!.followed = res.result
            if (res.result) {
                data.value!.fans++
            } else {
                data.value!.fans--
            }
        })
}

const toUser = ()=>{
    router.push('/u/'+data.value?.uid)
}
</script>
<template>
    <div class="item flex align-center padding clickable justify-between">
        <div class="flex align-center" @click="toUser">
            <Avatar :url="data?.avatar || ''" class="avatar" />
            <div class="info">
                <div class="nickname">{{ data?.nickname }}</div>
                <div class="id font-info">ID:{{ data?.user_code }}</div>
                <div class="fans font-info">粉丝：{{ data?.fans }}</div>
            </div>
        </div>
        <van-button class="ignore-btn action" v-if="data?.uid != userStore.userInfo?.uid && data?.followed"
            @click="onFollow">取关</van-button>
        <van-button class="ignore-theme-btn action" v-else-if="data?.uid != userStore.userInfo?.uid" @click="onFollow">{{
            data?._followed ? '回关' : '关注'
        }}</van-button>
    </div>
</template>
<style scoped lang="less">
.item {
    gap: 20px;
    color: #ffffff;
    .flex{
        gap:20px;
    }
    .font-info {
        font-size: 26px;
        color: #a1a1a1
    }
}
</style>
