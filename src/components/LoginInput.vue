<template>
    <van-form @submit="onSubmit" ref="formRef" >
        <van-cell-group :border="false" class="login">
            <van-field :border="false" v-if="props.logo">
                <template #input>
                    <div class="logo" :style="{ backgroundImage: `url(${configStore.getConfig('logo-light')})` }"></div>
                </template>
            </van-field>
            <van-field v-model="mobile" type="tel" label="手机号" label-align="top" placeholder="若您的手机号未注册过将自动注册"
                maxlength="11" v-if="props.defaultMobile.length==0" @focus="onFocus" @blur="onBlur"/>
            <van-field :model-value="hideMobile(props.defaultMobile)" type="tel" label="手机号" label-align="top" placeholder="若您的手机号未注册过将自动注册"
                maxlength="11" v-else disabled/>
            <van-field v-model="code" center clearable label="短信验证码" label-align="top" placeholder="请输入验证码" maxlength="6"  @focus="onFocus" @blur="onBlur">
                <template #button>
                    <van-button size="small" style="width: 100px" @click="showCaptcha" :disabled="countdown > 0">{{ countdown > 0 ?
                        `${countdown}秒` : '发送' }}</van-button>
                </template>
            </van-field>
            <van-field :border="false">
                <template #input>
                    <van-button block type="primary" native-type="submit">
                        登录/注册
                    </van-button>
                </template>
            </van-field>
            <van-field :border="false">
                <template #input>
                    <van-checkbox v-model="agree">
                        <div class="font-info">
                            <span>我已阅读并同意</span>
                            <span class="link" @click.stop="toAgree">《用户协议》</span>
                            <span>与</span>
                            <span class="link" @click.stop="toPrivacy">《隐私政策》</span>
                        </div>
                    </van-checkbox>
                </template>
            </van-field>
        </van-cell-group>
    </van-form>
    <Captcha ref="captchaRef" @success="captchaSuccess" />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance, showConfirmDialog, showToast } from 'vant';
import { useRoute, useRouter } from 'vue-router';
import { useConfigStore } from '@/store/Config';
import Captcha from './Captcha.vue';
import { sendLoginSmsApi } from '@/api/sms';
import { userProfileLoginApi } from '@/api/user';
import { checkMobile, hideMobile, showLoading } from '@/utils';


const props = defineProps({
    logo:{
        type:Boolean,
        default:true
    },
    defaultMobile:{
        type:String,
        default:''
    }
})
const getMobile = ()=>{
    if(props.defaultMobile){
        return props.defaultMobile
    }
    return mobile.value
}
const configStore = useConfigStore()
const captchaRef = ref<InstanceType<typeof Captcha>>()

const showCaptcha = () => {
    if (getMobile().length == 0) {
        return showToast('请输入手机号')
    }
    //验证手机号格式是否正确
    if (!checkMobile(getMobile())) {
        return showToast('手机号格式不正确')
    }
    //调用captcha组件的init
    captchaRef.value?.init('login')
}
const captchaSuccess = async (token: string) => {

    //调用接口发送验证码
    showLoading('发送中')
    const res = await sendLoginSmsApi({
        token,
        mobile: getMobile()
    })

    if (res) {
        if(res.data.code){
            code.value = res.data.code
        }
        showToast(res.msg)
        countdown.value = res.data.interval
        countdownTimer()
    }
}
const router = useRouter()
const emits = defineEmits(['success'])
const localStorageData = window.localStorage.getItem('mobile')
const mobile = ref(localStorageData ? localStorageData : '')
// const mobile = ref('11202303271')
const code = ref('')
const agree = ref(false)
const formRef = ref<FormInstance>();
const countdown = ref(0)
const route = useRoute()

const onSubmit = async () => {
    if (!agree.value) {
        return showConfirmDialog({
            title: '提示',
            message: '您是否同意用户协议与隐私政策',
            confirmButtonText:'同意',
            cancelButtonText:"不同意"
        })
        .then(()=>{
            agree.value = true
            onSubmit()
        })
    }
    if (getMobile().length == 0) {
        return showToast('请输入手机号')
    }
    if (code.value.length == 0) {
        return showToast('请输入验证码')
    }
    if (!checkMobile(getMobile())) {
        return showToast('手机号格式不正确')
    }
    //调用接口登录
   const instance= showLoading('登录中')
  let inviteCode = '';
    if (localStorage.getItem('invite_code')){
        const r = JSON.parse(localStorage.getItem('invite_code') as string);
        inviteCode = r.v;
    }
  if (localStorage.getItem('invite_code')){

  }
    const res = await userProfileLoginApi({
        mobile: getMobile(),
        code: code.value,
        ...route.query,
        invite_code:inviteCode
    })
    if (res) {
        emits('success', {
            mobile:getMobile(),
            data:res.data
        })
      localStorage.removeItem('invite_code')
      instance.close()
    }
}
const toAgree = () => {
    router.push('/article/agree')
}
const toPrivacy = () => {
    router.push('/article/privacy')
}

const countdownTimer = () => {
    if (countdown.value > 0) {
        setTimeout(() => {
            countdown.value--
            countdownTimer()
        }, 1000)
    }
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
.login{
    margin:0 auto;
}
.logo {
    margin: 0 auto;
    width: 300px;
    height: 300px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
