<script setup lang="ts" name="UserMobile">
import NavBar from '@/components/NavBar.vue';
import { useUserStore } from '@/store/User';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Step0 from './components/MobileStep0.vue';
import Step1 from './components/MobileStep1.vue';
import Step2 from './components/MobileStep2.vue';

const userStore = useUserStore()

const step = ref(0)
const router = useRouter()
const onBack = ()=>{
    if(step.value==0){
        router.back()
    }else{
        step.value--
    }
}
const step2Token = ref('')
const onStep1Success = (token:string)=>{
    step.value = 2
    step2Token.value = token
}

const onStep2Success = ()=>{
    step.value = 0
    userStore.updateUserInfo()
}
</script>
<template>
    <NavBar title="手机绑定" :routerBack="false" @back="onBack"/>
    <Step0 v-if="step == 0" :mobile="userStore?.userInfo?.mobile" @bind="step = 1"/>
    <Step1 v-else-if="step == 1" :mobile="userStore?.userInfo?.mobile" @success="onStep1Success"/>
    <Step2 v-else-if="step == 2" @success="onStep2Success" :mobile="userStore?.userInfo?.mobile" :token="step2Token"/>
</template>
