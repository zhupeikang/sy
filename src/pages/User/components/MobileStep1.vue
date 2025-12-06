<script setup lang="ts">
import { ref } from 'vue';
import { FormInstance, showToast } from 'vant';
import Captcha from '@/components/Captcha.vue';
import { showLoading } from '@/utils';
import { sendCheckSmsApi } from '@/api/sms';
import { checkUserMobileApi } from '@/api/user';

const formRef = ref<FormInstance>();
const props = defineProps({
    mobile: {
        type: String
    }
})

const code = ref('')
const countdown = ref(0)
const emits = defineEmits(['success'])
const onSubmit = async () => {
    if (code.value.length == 0) {
        return showToast('请输入验证码')
    }
    //调用接口校验
    showLoading('验证中')
    const res = await checkUserMobileApi({
        code: code.value
    })
    if (res) {
        showToast(res.msg)
        emits('success',res.data.token)
    }
}
const captchaRef = ref<InstanceType<typeof Captcha> | null>(null)
const showCaptcha = async () => {
    captchaRef.value?.init('bind_check')
}
const captchaSuccess = async (token: string) => {
    //调用接口发送验证码
    showLoading('发送中')
    const res = await sendCheckSmsApi({
        token,
    })

    if (res) {
        showToast(res.msg)
        countdown.value = res.data.interval
        countdownTimer()
    }
}

const onConfirm = () => {
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
    <div>
        <van-form @submit="onSubmit" ref="formRef">
            <van-cell-group :border="false" title="验证当前手机号">
                <van-field label-align="top" label="手机号">
                    <template #input>
                        {{ props.mobile }}
                    </template>
                </van-field>
                <van-field label-align="top" v-model="code" center clearable label="短信验证码" placeholder="请输入验证码"
                    maxlength="6">
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
