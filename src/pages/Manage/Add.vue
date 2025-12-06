<script setup lang="ts" name="ManageAdd">
import { getArtworkDetailApi, saveArtworkApi, uploadManageImageApi } from '@/api/manage';
import NavBar from '@/components/NavBar.vue';
import { showLoading } from '@/utils';
import { showDialog, showToast } from 'vant';
import { reactive, ref } from 'vue';
import router from '@/router';
import { useRoute } from 'vue-router';

const item = reactive<{
    [key:string]:any
}>({
    cover_url:[],
    main_url:[],
    desc_type:'img',
    desc_img:[],
    status:'pending',
    total_supply:100,
    amount:10,
    name:'',
    author:'',
    artwork_id:0
})
const onOversize = (name: string, size: number) => {
    showToast(`${name}不得超过${size}M`)
}
const showTips = (title: string, content: string) => {
    showDialog({
        title,
        message: content,
    })
}


const onSubmit = async (values: any) => {
    if(!agree.value){
        return showToast('请先同意《用户协议》和《隐私政策》')
    }
    let fileFields: any = {
        cover_url: '封面图',
        main_url: '主图',
    }
    console.log('submit', values)
    if (values.desc_type == 'img') {
        fileFields.desc_img = '详情图'
    } else if (values.desc_type == 'html') {
        if (values.desc_html.length <= 10) {
            showToast('详情内容不得少于10个字符')
            return
        }
    }
    for (let key in fileFields) {

        const files = values[key]
        if (files.length == 0) {
            showToast(`请上传${fileFields[key]}`)
            return
        }
        const file = files[0]
        //判断是否上传成功
        if (file.status != 'done') {
            //开始上传
            if (!file.file) return
            file.message = '上传中...'
            showLoading(fileFields[key] + '上传中')
            const formData = new FormData()
            formData.append('file', file.file as File)

            const res = await uploadManageImageApi(formData)
            if (res) {
                if (res.code == 200) {
                    file.status = 'done'
                    file.message = '上传成功'
                    file.url = res.data.url
                    file.content = ''
                } else {
                    file.status = 'failed'
                    file.message = res.msg
                    showToast(fileFields[key] + '上传失败')
                }
            } else {
                showToast(fileFields[key] + '上传失败')
                file.status = 'failed'
                file.message = '上传失败'
                return
            }
        }
    }
    showLoading('保存中')
    if(item.artwork_id){
        values.artwork_id = item.artwork_id
    }
    const res = await saveArtworkApi(values)
    if (res) {
        showToast(res.msg)
        router.back()
    }
};
const toAgree = () => {
    router.push('/article/agree')
}
const toPrivacy = () => {
    router.push('/article/privacy')
}
const agree = ref(true)
const route = useRoute()
const onInit = async()=>{
    if(route.query.artwork_id){
        const loading = showLoading()
        const res = await getArtworkDetailApi({
            artwork_id:route.query.artwork_id
        })
        if(res){
            loading.end()
            Object.assign(item,{
                ...res.data,
                amount:res.data.amount/100,
                cover_url:[{
                    status:'done',
                    url:res.data.cover_url
                }],
                main_url:[{
                    status:'done',
                    url:res.data.main_url
                }],
                desc_img:[{
                    status:'done',
                    url:res.data.desc_img
                }],
            })
        }else{
            router.back()
        }
    }

}
onInit()
</script>
<template>
    <van-form @submit="onSubmit">
        <NavBar title="发行中心">
            <template #right>
                <van-button type="primary" size="small" class="ignore-theme-btn" native-type="submit">保存</van-button>
            </template>
        </NavBar>
        <van-notice-bar text="您的艺术品已审核通过，修改后需要重新审核" v-if="item.status=='success'" />

        <van-cell-group class="margin-bottom" :border="false">
            <van-field v-model="item.name" name="name" label="艺术品名称" placeholder="请填写艺术品名称" maxlength="16"
                :rules="[{ required: true, message: '请填写艺术品名称' }]" />
            <van-field v-model="item.author" name="author" label="作者" placeholder="请填写作者" maxlength="16"
                :rules="[{ required: true, message: '请填写作者' }]" />
            <van-field name="total_supply" label="发行总数" :rules="[{ required: true, message: '请填写总发行数' }]">
                <template #input>
                    <van-stepper v-model="item.total_supply" integer />
                </template>
            </van-field>
            <van-field name="amount" label="价格（元）" :rules="[{ required: true, message: '请填写价格' }]">
                <template #input>
                    <van-stepper v-model="item.amount" />
                </template>
            </van-field>
            <van-field name="cover_url">
                <template #label>
                    <div @click="showTips('封面图', '不超过2M，512px*512px最佳，通常为静态图')">
                        <span class="margin-right">封面图</span>
                        <van-icon name="warning-o" />
                    </div>
                </template>
                <template #input>
                    <van-uploader v-model="item.cover_url" :max-count="1" :max-size="1024 * 1024 * 2"
                        @oversize="onOversize('封面图', 2)" accept=".jpg,.jpeg,.gif,.png,.bmp" />
                </template>
            </van-field>
            <van-field name="main_url">
                <template #label>
                    <div @click="showTips('主图', '不超过5M，1024px*1024px最佳，通常为高清图或动图')">
                        <span class="margin-right">主图</span>
                        <van-icon name="warning-o" />
                    </div>
                </template>
                <template #input>
                    <van-uploader v-model="item.main_url" :max-count="1" :max-size="1024 * 1024 * 5"
                        @oversize="onOversize('主图', 5)" accept=".jpg,.jpeg,.gif,.png,.bmp" />
                </template>
            </van-field>
            <van-field name="desc_type" label="详情展示">
                <template #input>
                    <van-radio-group v-model="item.desc_type" direction="horizontal">
                        <van-radio name="img">图片</van-radio>
                        <van-radio name="html">文字</van-radio>
                    </van-radio-group>
                </template>
            </van-field>
            <van-field name="desc_img" v-show="item.desc_type == 'img'">
                <template #label>
                    <div @click="showTips('详情图', '不超过5M，宽度1024px最佳')">
                        <span class="margin-right">详情图</span>
                        <van-icon name="warning-o" />
                    </div>
                </template>
                <template #input>
                    <van-uploader v-model="item.desc_img" :max-count="1" :max-size="1024 * 1024 * 5"
                        @oversize="onOversize('详情图', 5)" accept=".jpg,.jpeg,.gif,.png,.bmp" />
                </template>
            </van-field>
            <van-field v-model="item.desc_html" rows="5" autosize label="详情介绍" type="textarea" placeholder="请输入详情介绍"
                show-word-limit :maxlength="500" v-show="item.desc_type == 'html'" />
            <van-field>
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
</template>
