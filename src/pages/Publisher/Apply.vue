<script setup lang="ts" name="PublisherApply">
import { uploadForumImageApi } from '@/api/forum';
import NavBar from '@/components/NavBar.vue';
import { showLoading } from '@/utils';
import { showToast, UploaderFileListItem } from 'vant';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Captcha from '@/components/Captcha.vue';
import { useUserStore } from '@/store/User';
import { sendPublisherSmsApi } from '@/api/sms';
import { getUserPublisherApi, saveUserPublisherApi } from '@/api/user';

const userStore = useUserStore()

const router = useRouter()

const onSubmit = async (values: any) => {
    console.log('submit', values);
    if (!values.code || values.code.length == 0) {
        showToast('请输入验证码')
        return
    }
    if (!values.idcard_front_url || values.idcard_front_url.length == 0 || values.idcard_front_url[0].status != 'done') {
        showToast('请上传身份证正面照')
        return
    }
    if (!values.idcard_back_url || values.idcard_back_url.length == 0 || values.idcard_back_url[0].status != 'done') {
        showToast('请上传身份证反面照')
        return
    }

    const res = await saveUserPublisherApi({
        code: values.code,
        idcard_front_url: values.idcard_front_url[0].url,
        idcard_back_url: values.idcard_back_url[0].url,
    })
    if (res) {
        showToast(res.msg)
        if (res.code == 200) {
            onInit()
        }
    }
};

const countdown = ref(0)
const formData = ref<{
    [key: string]: any
}>({})
const captchaRef = ref<InstanceType<typeof Captcha>>()

const showCaptcha = () => {
    //调用captcha组件的init
    captchaRef.value?.init('publisher')
}
const captchaSuccess = async (token: string) => {

    //调用接口发送验证码
    showLoading('发送中')
    const res = await sendPublisherSmsApi({
        token,
    })

    if (res) {
        if (res.data.code) {
            formData.value.code = res.data.code
        }
        showToast(res.msg)
        countdown.value = res.data.interval
        countdownTimer()
    }
}

const countdownTimer = () => {
    if (countdown.value > 0) {
        setTimeout(() => {
            countdown.value--
            countdownTimer()
        }, 1000)
    }
}
const showVerify = () => {
    userStore.showVerify()
}

const uploadfile = async (file: UploaderFileListItem) => {
    console.log('uploadfile', file)
    if (!file.file) return
    file.status = 'uploading'
    //当图片超过2MB时，自动压缩图片，时图片尺寸尽可能接近2MB但是不超过2MB
    if (file.file.size > 2 * 1024 * 1024) {
        console.log('压缩图片')
        file.message = '压缩中...'
        await comporess(file)
    }
    //上传图片
    file.message = '上传中...'
    const formData = new FormData()
    formData.append('file', file.file as File)

    const res = await uploadForumImageApi(formData)
    if (res) {
        if (res.code == 200) {
            file.status = 'done'
            file.message = '上传成功'
            file.url = res.data.url
            file.content = ''
        } else {
            file.status = 'failed'
            file.message = res.msg
        }
    } else {
        file.status = 'failed'
        file.message = '上传失败'
    }

}
const comporess = async (fileObj: UploaderFileListItem) => {
    const file = fileObj.file as File
    const compressedFile = await new Promise<File>((resolve) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            canvas.toBlob((blob) => {
                const compressedFile = new File([blob!], file.name, {
                    type: file.type,
                });
                resolve(compressedFile);
            }, file.type, 2 * 1000 * 1000 / file.size);
        };
    });
    fileObj.file = compressedFile;
}
const afterRead = (file: UploaderFileListItem | UploaderFileListItem[]) => {
    //如果file是一个数组，则分别上传每个文件
    if (Array.isArray(file)) {
        file.forEach((item) => {
            uploadfile(item)
        });
        return;
    }
    uploadfile(file)
};
const onInit = async () => {
    console.log('onInit')

    await getUserPublisherApi({})
        .then(res => {
            if (res) {

                if (res.code == 200) {
                    if (res.data) {

                        formData.value = {
                            ...res.data,
                            agree: res.data.status ? true : false,
                            idcard_front_url: res.data.idcard_front_url ? [{
                                url: res.data.idcard_front_url,
                                status: 'done',
                                message: '上传成功',
                            }] : [],
                            idcard_back_url: res.data.idcard_back_url ? [{
                                url: res.data.idcard_back_url,
                                status: 'done',
                                message: '上传成功',
                            }] : [],
                        }
                    }
                }
            }
        })

}
(async () => {
    const loading = showLoading()
    await onInit()
    loading.end()
})()
</script>
<template>
    <NavBar title="发行商申请" />
    <van-steps :active="formData.status=='pending' ? 1 : formData.status=='success' ? 2 : 0">
        <van-step>提交资料</van-step>
        <van-step>平台审核</van-step>
        <van-step>审核通过</van-step>
    </van-steps>
    <van-form @submit="onSubmit" v-if="userStore.userInfo" :disabled="formData.status == 'success'">
        <van-cell-group :border="false">
            <van-field v-model="userStore.userInfo.real_name" name="real_name" label="姓名" placeholder="实名认证后自动获取" readonly
                @click="showVerify" />
            <van-field v-model="userStore.userInfo.identity_card" name="identity_card" label="身份证号" placeholder="实名认证后自动获取"
                readonly @click="showVerify" />
            <van-row>
                <van-col span="12">
                    <van-field name="idcard_front_url" label="身份证正面" label-align="top">
                        <template #input>
                            <van-uploader v-model="formData.idcard_front_url" :preview-size="[150, 90]" :max-count="1"
                                :after-read="afterRead" :deletable="formData.status != 'success'"
                                :disabled="formData.status == 'status'" :class="formData.idcard_front_url ? '' : 'idcard front'" />
                        </template>
                    </van-field>
                </van-col>
                <van-col span="12">
                    <van-field name="idcard_back_url" label="身份证背面" label-align="top">
                        <template #input>
                            <van-uploader v-model="formData.idcard_back_url" :preview-size="[150, 90]" :max-count="1"
                                :after-read="afterRead" :deletable="formData.status != 'success'"
                                :disabled="formData.status == 'status'" :class="formData.idcard_back_url ? '' : 'idcard back'"/>
                        </template>
                    </van-field>
                </van-col>
            </van-row>


            <van-field v-model="userStore.userInfo.mobile" name="mobile" label="手机号" placeholder="用户信息中自动读取" readonly
                @click="router.push('/user/mobile')" />
            <van-field name="code" v-model="formData.code" center clearable label="短信验证码" placeholder="请输入验证码" maxlength="6"
                v-if="formData.status != 'success'">
                <template #button>
                    <van-button size="small" @click="showCaptcha" :disabled="countdown > 0">{{ countdown > 0 ?
                        `${countdown}秒` : '发送' }}</van-button>
                </template>
            </van-field>
            <!-- <van-field>
                <template #input>
                    <van-checkbox v-model="formData.agree" name="agree" :disabled="formData.status == 'success'">
                        <div class="font-info">
                            <span>我已阅读并同意</span>
                            <span class="link" @click.stop="router.push('/article/join')">《入驻协议》</span>
                        </div>
                    </van-checkbox>
                </template>
            </van-field> -->
        </van-cell-group>
        <div style="margin: 16px;" v-if="formData.status != 'success'">
            <van-button round block type="primary" native-type="submit">
                提交
            </van-button>
        </div>
    </van-form>

    <Captcha ref="captchaRef" @success="captchaSuccess" />
</template>
<style scoped lang="less">
.idcard{
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    --van-uploader-upload-background:transparent;
    --van-uploader-upload-active-color:transparent;
    &.front{
        background-image: url(@/assets/imgs/idcard_front.png);
    }
    &.back{
        background-image: url(@/assets/imgs/idcard_back.png);
    }
}
</style>