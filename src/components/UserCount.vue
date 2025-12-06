<script setup lang="ts">
import { UserType } from '@/types';
import { PropType } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    user: {
        type: Object as PropType<UserType>,
        required: true
    },
    clickable: {
        type: Boolean,
        default: false
    }
});
const router = useRouter()
const toThreads = () => {
    if (props.clickable) {
        router.push('/user/thread')
    }
}
const toFriends = () => {
    if (props.clickable) {
        router.push('/user/friend/friend')
    }
}
const toFollows = () => {
    if (props.clickable) {
        router.push('/user/friend/follow')
    }
}
const toFans = () => {
    if (props.clickable) {
        router.push('/user/friend/fan')
    }
}
</script>
<template>
    <van-row class="countrow">
        <van-col span="6" @click="toThreads">
            <div class="nums">{{ props.user?.threads }}</div>
            <div class="text">动态</div>
        </van-col>
        <van-col span="6" @click="toFriends">
            <div class="nums">{{ props.user?.friends }}</div>
            <div class="text">朋友</div>
        </van-col>
        <van-col span="6" @click="toFollows">
            <div class="nums">{{ props.user?.follows }}</div>
            <div class="text">关注</div>
        </van-col>
        <van-col span="6" @click="toFans">
            <div class="nums">{{ props.user?.fans }}</div>
            <div class="text">粉丝</div>
        </van-col>
    </van-row>
</template>
<style scoped lang="less">
.countrow {
    padding: var(--padding-box)
}
.nums,.text{
    text-align: center;
}
.nums{
    color:#ffffff;
    font-size: 26px;
}
.text{
    color:#666666;
    font-size: 24px;
}
</style>
