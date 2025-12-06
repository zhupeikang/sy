<script setup lang="ts" name="AppAuthor">
import { preAuthorAppApi } from '@/api/app';
import { showLoading } from '@/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import Avatar from '@/components/Avatar.vue';
import { useConfigStore } from '@/store/Config';
import Login from '@/components/Login.vue';
import { showToast } from 'vant';
import { useUserStore } from '@/store/User';

const userStore = useUserStore()
const route = useRoute()
const appInfo = ref<{
    src_url: string
    name: string
    appid: number
}>()

const params = ref<{
    mobile: string
}>()
const configStore = useConfigStore()
console.log(route.query)
const error = ref('')
const onLoad = async () => {
    const loading = showLoading('登录中')
    const res = await preAuthorAppApi({
        ...route.query,
        showError: true
    })
    loading.end()
    if (res) {
        if (res.code != 200) {
            error.value = res.msg
        } else {
            if (res.data.result == 'success') {
                //登录成功
                userStore.login(res.data.token, () => {
                    showToast('登录成功')
                    if ('referer' in route.query) {
                        router.push(route.query.referer as string)
                    } else {
                        router.push('/home')
                    }
                })
            }
            appInfo.value = res.data.app
            params.value = res.data.params
            console.log('预授权成功')
        }
    } else {
        error.value = '请求失败'
    }
    console.log(res)
}

const onLogin = async () => {
    //关联绑定帐号
    console.log('登录成功')
    // showLoading('绑定中')
    // const res = await bindAuthorAppApi({
    //     ...route.query,
    // })
    // if (res) {
        showToast('登录成功')
        if ('referer' in route.query) {
            router.push(route.query.referer as string)
        } else {
            router.push('/home')
        }

    // }

}
onLoad()
</script>
<template>
    <van-empty :description="error" class="empty" v-if="error.length > 0">
        <van-button round type="primary" class="bottom-button" @click="() => router.push('/home')">返回首页</van-button>
    </van-empty>
    <div v-else>
        <div v-if="appInfo" class="app">
            <div class="flex justify-center align-center">
                <Avatar :size="160" :url="appInfo?.src_url" />
                <van-icon name="link-o" size="24px" />
                <Avatar :size="160" :url="configStore.getConfig('logo-light')" />
            </div>
            <div class="text-center text-default name text-white">
                正在通过
                <span class="link">{{ appInfo?.name }}</span>
                授权登录
                <span class="link">拾元立方</span>
            </div>
        </div>
    </div>

    <div v-if="params">
        <Login @success="onLogin" :logo="false" :defaultMobile="params.mobile" />
    </div>
</template>
<style scoped lang="less">
.app {
    padding-top: 300px;

    .flex {
        gap: 20px;
    }

    .name {
        margin-top: 20px;

    }
}
</style>
