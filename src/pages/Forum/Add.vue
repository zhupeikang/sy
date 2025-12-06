<script setup lang="ts" name="ForumAdd">
import { createForumThreadApi, uploadForumImageApi } from '@/api/forum';
import NavBar from '@/components/NavBar.vue';
import { useRefreshStore } from '@/store/Refresh';
import { showLoading } from '@/utils';
import { showDialog, showToast, UploaderFileListItem, UploaderInstance } from 'vant';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ChooseAsset from './components/ChooseAsset.vue';

const content = ref('')
const images = ref<{
    url: string,
    attach_id: number
}[]>([])
const fileList = ref<UploaderFileListItem[]>([])
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
            images.value.push({
                url: res.data.url,
                attach_id: res.data.attach_id
            })
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
const onDelete = (e: UploaderFileListItem) => {
    images.value = images.value.filter(item => item.url != e.url)
}
const uploaderRef = ref<UploaderInstance>();
/**
 * 选中的NFT
 */
type AssetChooseType = {
    asset_no: string
    name: string
    contract: {
        cover_url: string
    }
}
const asset = ref<AssetChooseType>()

const chooseImage = () => {
    if (asset.value) {

        showToast('不能同时发布资产和图片')
        return
    }
    uploaderRef.value?.chooseFile();
}
const assetRef = ref<InstanceType<typeof ChooseAsset>>()
const chooseAsset = () => {
    if (images.value.length > 0||fileList.value.length>0) {
        showToast('不能同时发布资产和图片')
        return
    }
    assetRef.value?.show()

}

const onChooseAsset = (value: AssetChooseType | null) => {
    if (value) {
        asset.value = value
    } else {
        asset.value = undefined
    }
}

const router = useRouter()

const refreshStore = useRefreshStore()
const onSave = async () => {
    if (content.value.length < 8) {
        showToast('至少需要输入8个字')
        return
    }
    const data = {
        content: content.value,
        images: images.value.map(item => item.attach_id).join(','),
        asset_no: asset.value?.asset_no,
        showError: true
    }
    const loading = showLoading('发布中')
    const res = await createForumThreadApi(data)
    const onInit = () => {
        content.value = ''
        images.value = []
        asset.value = undefined
        fileList.value = []
    }
    if (res) {
        if (res.code == 200) {
            showToast(res.msg)
            onInit()
            router.replace('/thread/' + res.data.thread_no)
            refreshStore.addThread({
                id: res.data.thread_no,
                action: 'add'
            }, 'new')
        } else {
            loading.end()
            if (res.data.thread_no) {
                showDialog({
                    message: res.msg
                })
                    .then(() => {

                        onInit()
                        router.replace('/thread/' + res.data.thread_no)
                    })
            } else {
                showToast(res.msg)
            }
        }
    }
}
</script>
<template>
    <div class="height-100">
        <NavBar title="动态">
            <template #right>
                <van-button @click="onSave" size="small" type="primary" :disabled="content.length == 0"
                    class="ignore-theme-btn btn">发布</van-button>
            </template>
        </NavBar>
        <van-field v-model="content" rows="15" type="textarea" class="content" placeholder="请输入内容" maxlength="1000"
            show-word-limit />

            <div class="bottom-nav flex justify-between">
            <div class="left">
                <van-badge :content="images.length" :show-zero="false">
                    <div class="images" @click="chooseImage"></div>
                </van-badge>
                <div class="asset" @click="chooseAsset"></div>
            </div>
            <div class="flex align-center">
                <div class="public"></div>
                公开
            </div>
        </div>
        <van-uploader v-model="fileList" :after-read="afterRead" :max-count="9" multiple :show-upload="false"
            @delete="onDelete" ref="uploaderRef" preview-size="30vw" class="uploader" />
        <van-cell v-if="asset" :title="asset.name" :label="'资产编号：' + asset.asset_no" :border="false" class="asset-cell">
            <template #icon>
                <van-image width="46px" height="46px" fit="contain" :src="asset.contract.cover_url" />
            </template>
            <template #right-icon>
                <van-icon name="delete-o" @click="asset = undefined" size="24px" color="#ffffff" />
            </template>
        </van-cell>
    </div>
    <ChooseAsset ref="assetRef" @confirm="onChooseAsset" />
</template>
<style scoped lang="less">
.uploader {
    padding: 1.8vw;
}

.btn {
    height: 64px;
    line-height: 64px;
    padding: 0 40px;
}

.content {
    background: transparent;
    --van-field-input-text-color: #ffffff;
}

.content::after {
    border-bottom-width: 0px;
}

.bottom-nav {
    background: var(--theme-bg);
    align-items: center;
    height: var(--van-nav-bar-height);
    // position: fixed;
    // bottom: 0px;
    // left: 0px;
    padding:0 10px;

    .images {
        display: inline-block;
        height: 50px;
        width: 50px;
        background-image: url(@/assets/imgs/icon_image.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;

    }

    .asset {
        display: inline-block;
        height: 50px;
        width: 50px;
        background-image: url(@/assets/imgs/icon_asset.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
    }

    .public {
        display: inline-block;
        height: 50px;
        width: 50px;
        background-image: url(@/assets/imgs/icon_public.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
        margin-right: 20px;
    }

    .left {
        >* {
            margin-left: var(--margin-outer);
        }
    }
}

.asset-cell {
    --van-cell-background: #1f1f1f;
    --van-cell-text-color: #666666;
    --van-cell-label-color: #ffffff;
}
</style>
