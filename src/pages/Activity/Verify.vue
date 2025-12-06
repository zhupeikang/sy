<script setup lang="ts">
import { getVerifyActivityApi, postVerifyActivityApi } from '@/api/activity';
import NavBar from '@/components/NavBar.vue';
import { showLoading, toDatetime } from '@/utils';
import { useRoute } from 'vue-router';
import Error from '@/components/Error.vue';
import { ref } from 'vue';
import { useUserStore } from '@/store/User';
import router from '@/router';
import { showConfirmDialog } from 'vant';

const userStore = useUserStore()
const route = useRoute()
const error = ref(false)
const errorText = ref('')

const config = ref<{
    begin_at: number
    end_at: number
    plan: {
        plan_no: string,
        subject: number,
        cover_url: string
    }
}>()

const onLoad = async () => {
    const loading = showLoading()
    const res = await getVerifyActivityApi({
        ...route.query,
        showError: true
    })
    loading.end()
    if (!res) {
        error.value = true
        errorText.value = '活动不存在'
    } else {
        if (res.code != 200) {
            error.value = true
            errorText.value = res.msg
        } else {
            config.value = res.data
        }
    }
}
onLoad()

const toLogin = () => {
    router.push('/login?referer=' + encodeURIComponent(route.fullPath))
}

const showVerify = () => {
    userStore.showVerify()
}

const getAsset = async () => {
    const loading = showLoading()
    const res = await postVerifyActivityApi({
        ...route.query,
    })

    if (res) {
        loading.end()
        showConfirmDialog({
            title: '领取成功',
            message: res.msg,
            confirmButtonText:'查看订单'
        })
            .then(() => {
                router.push('/order/'+res.data.order_no)
            })
    }
}
console.log(route)
</script>
<template>
    <NavBar title="实名认证领好礼" />
    <div v-if="config" class="main text-df">
        <div class="time">{{ toDatetime(config.begin_at) }} 至 {{ toDatetime(config.end_at) }}</div>
        <div>实名认证就送</div>
        <div class="cover" :style="{ backgroundImage: `url(${config.plan.cover_url})` }"
            @click="router.push('/plan/' + config.plan.plan_no)"></div>
        <div class="subject" @click="router.push('/plan/' + config.plan.plan_no)">{{ config.plan.subject }}</div>

        <van-button class="theme-btn" type="primary" @click="toLogin" v-if="!userStore.isLogin">立即登录</van-button>
        <van-button class="theme-btn" type="primary" @click="showVerify"
            v-else-if="userStore.userInfo?.verified_flag != 'Y'">立即认证</van-button>
        <van-button class="theme-btn" type="primary" @click="getAsset" v-else>立即领取</van-button>

    </div>
    <Error :show="error" :text="errorText" />
</template>
<style scoped lang="less">
.main {
    margin-top: 20px;
    text-align: center;

    .subject {
        margin-bottom: 20px;
        color: #ffffff;
    }

    .cover {
        margin: 0 auto 20px;
        width: 500px;
        height: 500px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
}
</style>
