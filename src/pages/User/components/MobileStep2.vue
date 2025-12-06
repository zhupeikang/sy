<script setup lang="ts">
import { ref } from 'vue';
import { FormInstance, showToast } from 'vant';
import Captcha from '@/components/Captcha.vue';
import { checkMobile, showLoading } from '@/utils';
import { sendBindSmsApi } from '@/api/sms';
import { saveUserMobileApi } from '@/api/user';

const props = defineProps({
    token: {
        type: String,
    },
    mobile:{
        type:String
    }
})

const formRef = ref<FormInstance>();

const countdown = ref(0)
const mobile = ref('')
const code = ref('')

const emits = defineEmits(['success'])
const onSubmit = async () => {
    if (mobile.value.length == 0) {
        return showToast('请输入手机号')
    }
    //验证手机号格式是否正确
    if (!checkMobile(mobile.value)) {
        return showToast('手机号格式不正确')
    }
    if(mobile.value==props.mobile){
        return showToast('新手机号不能与旧手机号相同')
    }
    if (code.value.length == 0) {
        return showToast('请输入验证码')
    }
    showLoading('绑定中')
    const res = await saveUserMobileApi({
        code: code.value,
        mobile:mobile.value,
        token:props.token
    })
    if (res) {
        showToast(res.msg)
        emits('success')
    }
}
const captchaRef = ref<InstanceType<typeof Captcha> | null>(null)
    const showCaptcha = () => {
    if (mobile.value.length == 0) {
        return showToast('请输入手机号')
    }
    //验证手机号格式是否正确
    if (!checkMobile(mobile.value)) {
        return showToast('手机号格式不正确')
    }
    if(mobile.value==props.mobile){
        return showToast('新手机号不能与旧手机号相同')
    }
    //调用captcha组件的init
    captchaRef.value?.init('bind_update')
}
const captchaSuccess = async (token: string) => {
    //调用接口发送验证码
    showLoading('发送中')
    const res = await sendBindSmsApi({
        token,
        mobile:mobile.value
    })

    if (res) {
        showToast(res.msg)
        countdown.value = res.data.interval
        countdownTimer()
    }
}

const onConfirm = ()=>{
    formRef.value?.submit()
}
const countdownTimer = () => {
    if (countdown.value > 0) {
        setTimeout(() => {
            countdown.value--
            countdownTimer()
        }, 1000)
    }
}
</script>
<template>
    <Captcha ref="captchaRef" @success="captchaSuccess" @refresh="showCaptcha" />
    <div >
        <van-form @submit="onSubmit" ref="formRef">
            <van-cell-group :border="false" title="绑定新手机号">
                <van-field label="手机号" type="tel" v-model="mobile" label-align="top" placeholder="请输入新手机号" maxlength="11"/>
                <van-field v-model="code" center clearable label="短信验证码" label-align="top" placeholder="请输入验证码" maxlength="6">
                    <template #button>
                        <van-button class="ignore-btn action" size="small" @click="showCaptcha" :disabled="countdown > 0">{{ countdown > 0 ?
                            `${countdown}秒` : '发送' }}</van-button>
                    </template>
                </van-field>
                <van-field>
                    <template #input>
                        <van-button type="primary" round block class="ignore-theme-btn" @click="onConfirm">提交</van-button>
                    </template>
                </van-field>
            </van-cell-group>
        </van-form>
    </div>
</template>
