<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
// console.log(router)
const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    show: {
        type: Boolean,
        required: true,
    },
    image: {
        type: String,
        default: 'error'
    }
});
</script>

<template>
    <div v-if="props.show" class="mask">
        <van-empty :description="props.text" :image="props.image" class="empty">
            <div class="error-btn">
                <van-button round type="primary" class="bottom-button" @click="() => router.back()">返回上一页</van-button>
            </div>
            <div class="error-btn">
                <van-button round type="primary" class="bottom-button" @click="() => router.push('/home')">返回首页</van-button>
            </div>
        </van-empty>
    </div>
</template>
<style lang="less" scoped>
.mask {
    background: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;

    .empty {
        margin-top: 20vh;
    }
    .error-btn{
        margin-bottom:20px;
        text-align: center;
    }
}
</style>