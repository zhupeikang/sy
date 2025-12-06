<template>
    <van-form @submit="onSubmit" ref="formRef" v-if="params">
        <van-cell-group :border="false" class="login">
            <van-field :border="false" v-if="props.logo">
                <template #input>
                    <div class="logo" :style="{ backgroundImage: `url(${configStore.getConfig('logo-light')})` }"></div>
                </template>
            </van-field>
            <van-field :model-value="user?.nickname" is-link readonly label="帐号" placeholder="请选择需要登录的帐号"
                @click="showAccountPicker = true" />

            <van-field :model-value="user?.real_name" v-if="user?.verified_flag == 'Y' && user?.real_name" readonly
                label="姓名" disabled/>
            <van-field :model-value="user?.identity_card" v-if="user?.verified_flag == 'Y' && user?.identity_card"
                label="身份证号" readonly disabled/>
            <van-field name="identity_card_last" v-model="identity_card_last" v-if="user?.verified_flag == 'Y' && user?.identity_card"
                label="验证身份证" placeholder="请填写身份证后六位" required @focus="onFocus" @blur="onBlur"/>
            <van-field :border="false" v-if="uid">
                <template #input>
                    <van-button block type="primary" native-type="submit">
                        登录
                    </van-button>
                    <van-button block @click="onRegister" v-if="showRegister">
                        注册新帐号
                    </van-button>
                </template>
            </van-field>
            <van-field :border="false">
                <template #input>
                    <van-button block type="danger" @click="emits('last')" class="login-input">
                        上一步
                    </van-button>
                </template>
            </van-field>
        </van-cell-group>

        <van-popup v-model:show="showAccountPicker" round position="bottom" closeable class="padding-top" >
            <van-nav-bar title="请选择需要登录的帐号" class="popup-nav-bar"/>
            <van-cell-group>
                <van-cell :title="item.nickname" :value="toDatetime(item.created_at)" @click="uid = item.uid;showAccountPicker=false" is-link
                    clickable v-for="(item, index) in params.list" :key="index.toString()" />
            </van-cell-group>
        </van-popup>
    </van-form>

    <Captcha ref="captchaRef" @success="captchaSuccess" />
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { FormInstance, showToast } from 'vant';
import { useConfigStore } from '@/store/Config';
import Captcha from './Captcha.vue';
import { showLoading, toDatetime } from '@/utils';
import { LoginAccountType, UserAccountType } from '@/types';
import { loginVerifyProfileUserApi, userProfileRegisterApi } from '@/api/user';
import { useRoute } from 'vue-router';

const props = defineProps({
    logo: {
        type: Boolean,
        default: false
    },
})
const route = useRoute()
const showAccountPicker = ref(false)
const uid = ref(0)
const user = ref<UserAccountType>()
const params = ref<LoginAccountType>()
const mobile = ref<string>()
const identity_card_last = ref<string>('')
const emits = defineEmits(['success','last'])
const showRegister = ref(false)
const onRegister = async() => {
    showLoading('注册中')
    const res = await userProfileRegisterApi({
        code:params.value?.code,
        identity_card_last:identity_card_last.value,
    })
    if(res){
        showToast(res.msg)
        emits('success',mobile.value,res.data.result=='success' ? res.data?.token : '')
    }
}
defineExpose({
    init: (m: string, data: LoginAccountType) => {
        console.log('init account',m,data)
        mobile.value = m
        params.value = data
        if (data.list.length == 1) {
            uid.value = data.list[0].uid
        }
        showRegister.value = data.list.findIndex(item=>item.verified_flag == 'N') == -1
    }
})

watch(()=>uid.value,newValue=>{
    user.value = params.value?.list.find(item=>item.uid == newValue)
})


const configStore = useConfigStore()
const captchaRef = ref<InstanceType<typeof Captcha>>()

const showCaptcha = () => {
    //调用captcha组件的init
    captchaRef.value?.init('verify')
}
const captchaSuccess = async (token: string) => {

    //调用接口发送验证码
    showLoading('登录中')
    const res = await loginVerifyProfileUserApi({
        ctoken:token,
        uid:uid.value,
        code: params.value?.code,
        identity_card_last:identity_card_last.value,
        ...route.query
    })

    if (res) {
        showToast(res.msg)
        emits('success',mobile.value,res.data.result=='success' ? res.data?.token : '')
    }
}
const formRef = ref<FormInstance>();

const onSubmit = async () => {
    if(!identity_card_last.value&&user.value?.verified_flag=='Y'&&user.value.identity_card){
        showToast('请填写身份证后六位')
        return
    }
    showCaptcha()
}
const onFocus = ()=>{
    //将id为app-tabbar的元素的style的display样式设置为none
    document.getElementById('app-tabbar')?.setAttribute('style','display:none')
}

const onBlur = ()=>{
    //将id为app-tabbar的元素的style的display样式设置为block
    document.getElementById('app-tabbar')?.setAttribute('style','display:block')
}
</script>
<style scoped lang="less">
.login {
    width: 700px;
    margin: 0 auto;
}

.logo {
    margin: 0 auto;
    width: 300px;
    height: 300px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.login-input{
    margin-top:50px;
}
</style>
