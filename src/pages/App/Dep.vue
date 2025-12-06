<script setup lang="ts" name="AppAuthor">
import { depAuthorAppApi } from '@/api/app';
import { getAssetURL, showLoading } from '@/utils';
import { ref } from 'vue';
import router from '@/router';
import Avatar from '@/components/Avatar.vue';
import { useConfigStore } from '@/store/Config';
import Login from '@/components/Login.vue';
import { showDialog } from 'vant';

const showLogin = ref(true)



const configStore = useConfigStore()


const onLogin = async () => {
    //关联绑定帐号
    console.log('登录成功')
    showLogin.value = false
    const loading = showLoading('授权中...')
    //增加授权记录
    const res = await depAuthorAppApi({

    })

    if (res) {
        loading.end()
        if (res.data.success) {
            console.log(res.data);

            let redirect_uri = router.currentRoute.value.query.redirect_uri as string
            const params = ['state='+router.currentRoute.value.query.state, 'code='+res.data.code]
            if(redirect_uri.indexOf('?')>=0){
                redirect_uri += '&'+params.join('&')
            }else{
                redirect_uri += '?'+params.join('&')
            }

            if (window.top) {
                window.top.location.href = redirect_uri
            } else {
                window.location.href = redirect_uri
            }
            // showDialog({
            //     title: '授权成功',
            //     message: 'code:' + res.data.code,
            // })

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
    <div class="app">
        <div class="flex justify-center align-center">
            <Avatar :size="160" :url="getAssetURL(`assets/imgs/dep.jpg`)" />
            <van-icon name="link-o" size="24px" />
            <Avatar :size="160" :url="configStore.getConfig('logo-light')" />
        </div>
        <div class="text-center text-default name text-white">

            <span class="link">上海数据交易所</span>
            申请获取
            <span class="link">拾元立方</span>
            用户授权
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
