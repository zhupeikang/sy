<script setup lang="ts" name="Login">
import Login from '@/components/Login.vue';
import Back from '@/components/Back.vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/User';
import { watch } from 'vue';
import { showToast } from 'vant';

const router = useRouter()
const userStore = useUserStore()
const route = useRoute()
watch(()=>route.query.clear,(newValue)=>{
    if(newValue){
        userStore.logout()
    }
},{
    immediate:true
})

const onLogin = () => {
    console.log('登录成功')

    showToast('登录成功')
    if('referer' in route.query){
        router.replace(route.query.referer as string)
    }else{
        router.replace('/home')
    }
}

if(route.query.token){
    userStore.login(route.query.token as unknown as string,onLogin)
    onLogin()
}
</script>
<template>
    <Back />
    <Login logo @success="onLogin"/>
</template>
