<script setup lang="ts">
import { ref } from 'vue';
import { showLoading } from '@/utils';
import { createCaptchaApi, verifyCaptchaApi } from '@/api/captcha';
import { showFailToast } from 'vant';

const visible = ref(false)
const emits = defineEmits(['refresh', 'success'])

const url = ref('')//图片URL
const text = ref('')//提示文案
const scene = ref('')  //场景
const token = ref('')//token

const slider = ref(0)

const init = async (s: string) => {
    scene.value = s
    //调用API生成验证码
    const loading = showLoading()
    const res = await createCaptchaApi({
        scene: s
    })
    loading.end()
    if (res) {
        url.value = res.data.url
        token.value = res.data.token
        text.value = res.data.text
        slider.value = 0
        visible.value = true
    }
}
const changeSlider = async (value: number) => {
    console.log('changeSlider', value)
    //调用API校验
    const loading = showLoading()
    const res = await verifyCaptchaApi({
        token: token.value,
        scene: scene.value,
        deg: slider.value,
    })
    // loading.close()
    if (res) {
        if (res.data.success) {
            //校验正常
            visible.value = false
            emits('success', res.data.token);
        } else {
            showFailToast(res.msg)
            //刷新验证码
            if (res.data.refresh) {
               init(scene.value)
            } else {
                slider.value = 0
            }
        }
    }
}

defineExpose({
    init,
})
</script>
<template>
    <van-dialog v-model:show="visible" title="请拖动滑块使图片为正" show-cancel-button :show-confirm-button="false">
        <div class="captcha" :style="{
            backgroundImage: `url(${url})`,
            transform: `rotate(${slider}deg)`
        }"></div>
        <div class="slider">
            <van-slider v-model="slider" :max="359" @change="changeSlider" />
        </div>
        <div class="tips" v-if="text">{{ text }}</div>
    </van-dialog>
</template>
<style scoped lang="less">
.captcha {
    width: 200px;
    height: 200px;
    margin: 30px auto 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    border: 5px solid var(--van-border-color)
}

.slider {
    padding: 50px 50px 30px;
}

.tips {
    padding: var(--padding-box);
    text-align: center;
}
</style>
