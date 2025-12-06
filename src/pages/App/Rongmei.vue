<script setup lang="ts" name="AppAuthor">
import { rongmeiAuthorAppApi } from '@/api/app';
import { showLoading } from '@/utils';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import Avatar from '@/components/Avatar.vue';
import { useConfigStore } from '@/store/Config';
import Login from '@/components/Login.vue';
import { showDialog } from 'vant';
import { useDictStore } from '@/store/Dict';

const dictStore = useDictStore()

const rongmei = ref()
const showLogin = ref(false)
watch(() => dictStore.getDict('platform'), (newValue) => {
    if (newValue) {
        //@ts-ignore
        rongmei.value = newValue.find((item) => item.name == 'rongmei')
        console.log(rongmei.value)
        showLogin.value = true
    }
}, {
    immediate: true
})
const route = useRoute()

const configStore = useConfigStore()
const error = ref('')


const onLogin = async () => {
    //关联绑定帐号
    console.log('登录成功')
    showLogin.value = false
    const loading = showLoading('授权中...')
    //增加授权记录
    const res = await rongmeiAuthorAppApi({

    })

    if (res) {
        loading.end()
        if (res.data.success) {
            console.log(route.query)
            let url = decodeURIComponent(route.query.redirectUrl as string)
            const encrypt = encodeURIComponent(res.data.encrypt)
            url += (url.indexOf('?') == -1 ? '?' : '&') + `encrypt=${encrypt}&clientId=${res.data.clientId}`;
            console.log(url)
            location.replace(url)
        } else {
            showDialog({
                title: '授权失败',
                message: res.msg,
                showCancelButton: false,
                confirmButtonText: '重新登录',
            }).then(() => {
                showLogin.value = true
            })

        }

    } else {
        showLogin.value = true
    }

}
</script>
<template>
    <van-empty :description="error" class="empty" v-if="error.length > 0">
        <van-button round type="primary" class="bottom-button" @click="() => router.push('/home')">返回首页</van-button>
    </van-empty>
    <div v-else>
        <div v-if="rongmei" class="app">
            <div class="flex justify-center align-center">
                <Avatar :size="160" :url="rongmei?.logo" />
                <van-icon name="link-o" size="24px" />
                <Avatar :size="160" :url="configStore.getConfig('logo-light')" />
            </div>
            <div class="text-center text-default name text-white">

                <span class="link">{{ rongmei?.text }}</span>
                申请获取
                <span class="link">拾元立方</span>
                用户授权
            </div>
        </div>
    </div>

    <Login @success="onLogin" :logo="false" v-if="showLogin" />
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
