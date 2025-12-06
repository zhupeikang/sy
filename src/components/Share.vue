<script lang="ts" setup>
import { showFailToast, showLoadingToast, showToast } from 'vant';
import { ref, watch } from 'vue';
import useClipboard from 'vue-clipboard3';
import { useRoute } from 'vue-router';
import QrcodeVue from 'qrcode.vue';
import { inQQBrowser, inWechatBrowser, rpxToPx } from '@/utils';
import html2Canvas from 'html2canvas';
import { useConfigStore } from '@/store/Config';
import { xgwShareActivityApi } from '@/api/activity';
import { useUserStore } from '@/store/User';

const config = useConfigStore();
const userStore =useUserStore()
const route = useRoute()
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
        required: true
    },
    url: {
        type: String,
        default: '',
        required: true
    },
    name: {
        type: String,
        default: '',
        required: true
    },
    img: {
        type: String,
        default: ''
    },
    background: {
        type: String,
        default: ''
    },
    showImg: {
        type: Boolean,
        default: true
    },
    showQrcode: {
        type: Boolean,
        default: true
    },
    extends: {
        type: String
    },
    height: {
        type: Number,
        default: rpxToPx(1600)
    },
    width: {
        type: Number,
        default: rpxToPx(900)
    }
});

const emits = defineEmits(['update:show']);
const name = ref('复制链接')
if (userStore.userInfo?.invite_code){
    name.value = '邀请链接'
}
const options = [
    { name: name.value, icon: 'link' },
    // { name: '二维码', icon: 'qrcode' },
    { name: '海报', icon: 'newspaper-o', className: "ignore-share-newspaper" },
    { name: '微信', icon: 'wechat' },
    { name: 'QQ', icon: 'qq' },
    // { name: '微博', icon: 'weibo' },

];

const posterVisible = ref(false)
const { toClipboard } = useClipboard();
const qrcodeVisible = ref(false)
const tipsVisible = ref(false)
const saveTitle = ref('')
const posterRef = ref(null) as any
const posterImg = ref('')
const shared = ref(false)
const onSelect = async (option: {
    name: string
    icon: string
}) => {
  console.log(props);
    if (option.icon == 'link') {
        try {
          if (userStore.userInfo?.invite_code){
            await toClipboard(props.name + '\n' + props.url + '?i=' + userStore.userInfo.invite_code);
          }else {
            await toClipboard(props.name + '\n' + props.url);
          }
            showToast('复制成功');
        } catch (e) {
            showFailToast('复制失败');
            console.error(e);
        }

        emits('update:show', false)
        return
    }
    if (option.icon == 'qrcode') {
        saveTitle.value = ''
        showQrcode()
        return
    }
    if (option.icon == 'wechat') {
        if (inWechatBrowser()) {
            tipsVisible.value = true
            emits('update:show', false)
            return
        }
        saveTitle.value = '请使用微信扫一扫后分享'
        showQrcode()
        return
    }
    if (option.icon == 'newspaper-o') {
        posterVisible.value = true
        emits('update:show', false)
        if (props.extends?.substring(0, 4) == 'xgw:' && !shared.value) {
            shared.value = true
            xgwShareActivityApi()
        }
        return
    }
    if (option.icon == 'qq') {
        if (inQQBrowser()) {
            tipsVisible.value = true
            emits('update:show', false)
            return
        }
        window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent(props.url) + '&sharesource=qzone&title=' + props.name + '&pics=' + props.img + '&summary=' + props.name + '&desc=' + props.name)
        return
    }
};

const showQrcode = () => {
    qrcodeVisible.value = true
    emits('update:show', false)
}
const onSave = () => {
    const canvas = document.querySelector('.qrcode') as HTMLCanvasElement
    if (canvas) {
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = '二维码.png'
        a.click()
    }
}
watch(() => posterVisible.value, (val) => {
    if (val) {

        let i = 1;
        const getPoster = () => {
            if (posterImg.value) return;
            if (!posterVisible.value) {
                return false
            }
            let dom = posterRef?.value
            console.log('getPoster', i, dom)
            if (!dom) {
                setTimeout(() => {
                    i++
                    if (i > 5) {
                        console.log('获取海报失败')
                        return false
                    }
                    getPoster()
                }, 500)
                return false
            }
            showLoadingToast({
                message: '生成中',
                forbidClick: true,
                duration: 1500
            })
            html2Canvas(dom, {
                backgroundColor: null,
                width: dom.clientWidth,
                height: dom.clientHeight,
                logging: false,
                scrollY: 0,
                scrollX: 0,
                useCORS: true,
                scale: 4, // 处理模糊问题
            }).then((res: any) => {
                posterImg.value = res.toDataURL()
            })
        }
        getPoster()

    }
})
const getQrcode = (url: string) => {
    if (userStore.userInfo?.invite_code){
      return url + '?i=' + userStore.userInfo.invite_code
    }else {
      return url
    }
}
</script>
<template>
    <van-share-sheet :show="props.show" @cancel="emits('update:show', false)" title="立即分享给好友" :options="options"
        @select="onSelect" @click="emits('update:show', false)" />
    <van-overlay :show="tipsVisible" @click="tipsVisible = false" z-index="200">
        <div class="share-tips"></div>
    </van-overlay>
    <van-popup v-model:show="qrcodeVisible" :style="{ padding: '48px 0 20px', width: '80vw' }" round closeable>

        <div class="text-center">
            <qrcode-vue :value="props.url" :size="rpxToPx(500)" level="H" class="qrcode" />
            <van-button type="primary" round class="ignore-theme-btn save" @click="onSave"
                v-if="saveTitle.length == 0">保存二维码</van-button>
            <div class="title" v-else>{{ saveTitle }}</div>
        </div>
    </van-popup>
    <van-overlay :show="posterVisible" @click="posterVisible = false" :z-index="999">
        <div class="wrapper" @click.stop>
            <div class="text-center posterArea">
                <div ref="posterRef" class="posterBox" :style="{
                    backgroundImage: 'url(' + (props.background || config.getConfig('share_background')) + ')',
                    width: props.width + 'px',
                    height: props.height + 'px'
                }">
                    <div class="main-img" :style="{
                        backgroundImage: 'url(' + props.img + ')',
                    }" v-show="props.showImg"></div>
                    <div class="qrcode" v-show="props.showQrcode">
                        <qrcode-vue :value="getQrcode(props.url)" :size="rpxToPx(140)" level="H" />
                    </div>
                    <div class="content">
                        <slot name="content" />
                    </div>
                </div>
                <img :src="posterImg" v-if="posterImg" className="posterImg">
                <div class="title">长按图片保存并分享</div>
            </div>
        </div>
    </van-overlay>
</template>
<style scoped lang="less">
.title {
    height: 96px;
    line-height: 96px;
    font-size: 32px;
    text-align: center;
}

.save {
    margin: 0 auto;
}

.wrapper {
    position: fixed;
    width: 550px;
    top: 100px;
    left: 100px;
}

.share-tips {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center top;
    background-image: url(@/assets/imgs/share_tips.png);
    width: 750px;
    height: 750px;
}

.posterArea {
    position: relative;

    .title {
        font-size: 24px;
    }
}

.posterBox {
    width: 900px;
    height: 1600px;
    margin: 0 auto;
    background-position: center;
    background-size: 100%;
    background-repeat: no-repeat;
    position: absolute;
    top: -1000000px;

    .qrcode {
        position: absolute;
        right: 56px;
        bottom: 60px;
        width: 172px;
        height: 172px;
        padding-top: 16px;
        box-sizing: border-box;
        background-color: #ffffff;
    }

    .main-img {
        position: absolute;
        left: 220px;
        top: 300px;
        width: 460px;
        height: 460px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
    }

    .content {
        position: absolute;
        top: 950px;
        font-family: AlimamaShuHeiTi-Bold;
        text-align: left;
        color: #ffffff;
        font-size: 40px;
        left: 180px;
    }
}

.posterImg {
    width: 550px;
}
</style>
<style lang="less">
.ignore-share-newspaper {
    font-size: 24px;

    .van-share-sheet__icon {

        background-color: var(--theme-deep-gold);
        color: white;
    }
}</style>
