<script setup lang="ts">
import { drawUserRightsApi } from '@/api/user';
import { AssetRightsType, UserAddressType } from '@/types';
import { showLoading } from '@/utils';
import { showConfirmDialog, showDialog, showToast } from 'vant';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useClipboard from 'vue-clipboard3';
import AddressList from '@/components/AddressList.vue';
import { useUserStore } from '@/store/User';

const router = useRouter()
const item = ref<AssetRightsType>()
const show = ref(false)
const formData = ref<{
    [key: string]: any
}>({})
defineExpose({
    init: async (data: AssetRightsType) => {
      console.log('init');
        item.value = data
        formData.value = {}
        if (data.rights.type=='form'&& data.content?.form) {
            formData.value = data.content.form
        }

        if (data.rights.type == 'address') {
            if(data.content?.address){
                addressId.value = data.content.address.address_id
            }else{
                addressId.value = userStore.userInfo?.address_id || 0
            }

        }
        //判断是否有详情页
        if (data.rights.content_flag == 'Y') {
            //需要展示详情页
            show.value = true
        }else{
            if(data.rights.type=='address'||data.rights.type=='form'){
                show.value = true
            }else{
              if (data.rights.type==='api'){
                const {api}=data.rights.config
                if (!api){
                  return false
                }
                window.location.href=api
              }
                return onDraw()
            }
        }
        if((data.rights.type=='html'||data.rights.type=='use')&&data.status=='pending'){
            onDraw()
        }
    }
})
const emits = defineEmits(['success'])
const { toClipboard } = useClipboard();
const onDraw = async (content?: {
    [key: string]: any
}) => {
    const draw = async () => {
        const loading = showLoading('领取中')
        content = content  || {}
        content.uid = userStore.userInfo?.uid
        const res = await drawUserRightsApi({
            asset_rights_id: item.value?.asset_rights_id,
            content
        })
        if (res) {
            emits('success', {
                asset_rights_id:item.value?.asset_rights_id,
                content:{
                    ...content,
                    ...res.data.content
                }
            })
            if(item.value?.rights.type=='html'||item.value?.rights.type=='use'){
                if(item.value?.rights.type=='use'){
                    //调用浏览器下载res.data.url中的图片到本地
                    const a = document.createElement('a')
                    a.href = res.data.url
                    a.download = '图片'
                    a.click()
                }
                loading.end()
                return
            }
            // show.value = false
            const successCallback = async () => {
                if (res.data.router) {
                    if (res.data.router.type == 'replace') {
                        router.replace(res.data.router.path)
                    } else {
                        router.push(res.data.router.path)
                    }
                } else if (res.data.link) {
                    window.location.href = res.data.link
                } else if (res.data.copy) {
                    try {
                        await toClipboard(res.data.copy);
                        showToast('复制成功');
                    } catch (e) {
                        showToast('复制失败');
                        console.error(e);
                    }
                }
            }
            if (res.data.type == 'confirmDialog') {

                loading.close()
                showConfirmDialog({
                    title: res.data.title,
                    message: res.data.message,
                    confirmButtonText: res.data.confirm || '确定',
                    cancelButtonText: res.data.cancel || '取消',
                })
                    .then(successCallback)
            } else if (res.data.type == 'dialog') {

                loading.close()
                showDialog({
                    title: res.data.title,
                    message: res.data.message,
                    confirmButtonText: res.data.confirm || '确定',
                }).then(successCallback)
            } else if (res.msg) {
                showToast({
                    message: res.msg,
                    onClose: successCallback
                })
            }
        }
    }
    if (['form', 'address', 'url', 'cdkey'].includes(item.value?.rights?.type || '')&&item.value?.status == 'pending') {
        return showConfirmDialog({
            title: '操作确认',
            message: '进行该操作后，该权益状态将变为已领取，是否继续？',
            confirmButtonText: '继续',
            cancelButtonText: '取消'
        })
            .then(draw)
    } else {
        draw()
    }

}

const toUrl = () => {
    if (item.value?.status == 'pending') {
        if (item.value?.rights.type==='api'){
          const {api}=item.value?.rights.config
          if (!api){
            return false
          }
          window.location.href=api
          return
        }
        onDraw()
    } else {
        window.location.href = item.value?.content.url
    }
}

const onSubmit = () => {
    onDraw(formData.value)
}
const makeRules = (field: {
    key: string,
    type: string
    label: string
    remark: string
    required: string
}) => {
    const rules = []
    if (field.required) {
        rules.push({
            required: true,
            message: `请输入${field.label}`
        })
    }
    if (field.type == 'idcard') {
        rules.push({
            pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            message: '请输入正确的身份证号'
        })
    } else if (field.type == 'mobile') {
        rules.push({
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号'
        })
    }
    return rules
}
const copy = async (text: string) => {
    try {
        await toClipboard(text);
        showToast('复制成功');
    } catch (e) {
        showToast('复制失败');
        console.error(e);
    }
}
const userStore = useUserStore()
const addressVisible = ref(false)
console.log(addressVisible,'addressVisible');
const addressId = ref(userStore.userInfo?.address_id || 0)
console.log(addressId,'addressId');
const address = ref<UserAddressType>()
const showAddress = async () => {
    if (item.value?.status == 'pending') {
        addressVisible.value = true
        if (!addressId.value) addressId.value = userStore.userInfo?.address_id || 0
    }
}


const onChooseAddress = (item: UserAddressType) => {
    console.log(item,'选择地址');
    addressId.value = item.address_id
    addressVisible.value = false
}

const onAddress = ()=>{
  console.log(addressId.value,'onAddress');
    onDraw({
        address_id:addressId.value
    })
}

watch(()=>addressId.value,async (newValue)=>{
  console.log(newValue,'newValue');
    if(addressId.value){
        const res = await userStore.getUserAddress(newValue)
        if(res){
            address.value = res
        }else{
            address.value = undefined
        }
    }else{
        address.value = undefined
    }
    console.log('rightsShowAddress',addressId.value,address.value)
},{
    immediate:true,
    deep:true
})
</script>
<template>
    <van-popup v-model:show="show" position="bottom" :style="{ minHeight: '30vh', maxHeight: '60vh' }">
        <van-nav-bar :title="item?.rights?.name" class="popup-nav-bar">
            <template #left>
                <van-button @click="show = false" size="small">关闭</van-button>
            </template>
            <template #right>
                <van-button @click="onDraw" type="primary" size="small"
                    v-if="item?.rights.type == 'avatar' && item.status == 'pending'">领取头像</van-button>
                <van-button type="primary" size="small" v-else-if="item?.rights.type == 'avatar'" @click="router.push('/user/avatar')">查看头像</van-button>
                <van-button type="primary" size="small" v-else-if="item?.rights.type == 'url' && item.status == 'pending'" @click="toUrl">点此领取</van-button>
                <van-button type="primary" size="small" v-else-if="item?.rights.type == 'api' && item.status == 'pending'&&item.rights.config.api" @click="toUrl">跳转</van-button>
                <van-button type="primary" size="small" v-else-if="item?.rights.type == 'url'" @click="toUrl">前往查看</van-button>

                <van-button type="primary" size="small" v-else-if="item?.rights.type == 'cdkey' && item.status == 'pending'" @click="onDraw">兑换</van-button>
                <van-button type="primary" size="small" v-else-if="item?.rights.type == 'address' && item.status == 'pending'" @click="onAddress">兑换</van-button>
                <van-button type="primary" size="small" v-else-if="item?.rights.type == 'use'" @click="onDraw">下载</van-button>

            </template>
        </van-nav-bar>

        <div v-html="item?.rights?.content" v-if="item?.rights?.content" class="margin text-df text-white"></div>
        <div v-if="item?.rights.type == 'form'">
            <van-form @submit="onSubmit" :disabled="item.status != 'pending'">
                <van-cell-group>
                    <van-field v-model="formData[field.key]" :key="index.toString()"
                        v-for="(field, index) in item.rights.config.form" :name="field.key"
                        :placeholder="field.remark || ('请输入' + field.label)" :label="field.label" :rules="makeRules(field)"
                        :type="field.type == 'textarea' ? 'textarea' : 'text'" />
                </van-cell-group>
                <div style="margin: 0 16px 16px;" v-if="item.status=='pending'">
                    <van-button round block type="primary" native-type="submit">
                        提交
                    </van-button>
                </div>
            </van-form>
        </div>
        <div v-else-if="item?.rights.type == 'cdkey' && item.status != 'pending'" class="text-center ">
            <span style="vertical-align: middle">您的兑换码为：{{ item?.content?.cdkey }}</span>
            <van-button type="primary" size="small" @click="copy(item?.content?.cdkey)" style="vertical-align: middle;margin-left:5px;">复制</van-button>
        </div>
        <div v-else-if="item?.rights.type == 'address'&&item.status=='pending'">
            <van-cell :is-link="item.status == 'pending'" title="收货地址" @click="showAddress" v-if="!address" label="请选择" />
            <van-cell :is-link="item.status == 'pending'" :title="address?.name + ' ' + address?.mobile"
                @click="showAddress" v-else :label="address?.area + ' ' + address?.address"   />
        </div>
        <div v-else-if="item?.rights.type == 'address'&&item.content.address">
            <van-cell title="收件人" :label="item.content?.address?.mobile" :value="item.content?.address?.name" :border="false"/>
            <van-cell title="收货地址" :label="item.content?.address?.address" :value="item.content?.address?.area" :border="false"/>
            <van-cell v-if="item.content?.address.express_company&&item.content?.express_id" :title="item.content?.exporess_company" :value="item.content?.exporess_id"/>
        </div>
        <div v-else-if="item?.rights.type == 'address'">
            <van-cell  title="收件人" label="收件信息不可见" :border="false"/>
        </div>
    </van-popup>
    <van-popup v-model:show="addressVisible" position="bottom" :style="{ minHeight: '30vh', maxHeight: '60vh' }">

        <AddressList page="component" v-if="addressVisible" :address="addressId" @choose="onChooseAddress" />
    </van-popup>
</template>
