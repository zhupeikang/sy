<script setup lang="ts">
import Tag from './Tag.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  limit: {
    type: Number,
    default: 0,
  },
  limitText: {
    type: String,
    default: '限量',
  },
  img: {
    type: String,
    default: '',
  },
  model: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['model']);
// 判断图片类型是不是gif
const isGif = computed(() => {
  return props.img.includes('.gif');
});
</script>
<template>
  <div class="main">
    <div v-if="!isGif" class="img-box-perspective flex  align-center justify-center" style="position: relative;z-index: 99">
      <div class="img-box flex align-center justify-center">
        <div class="img-box2 flex align-center justify-center">
          <div class="img" :style="{ backgroundImage: `url(${props.img})` }"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="img" :style="{ backgroundImage: `url(${props.img})` }"></div>

    </div>
    <!--套餐内不露出-->
    <div class="model-btn" v-if="props.model" @click="emits('model')">
      <div class="eye"></div>
      <div class="text">沉浸</div>
      <div class="text">模式</div>
    </div>

    <div class="info">
      <div class="title">
        {{ props.title }}
      </div>
      <div class="subtitle">
        <Tag :title="props.limitText" :value="props.limit + '份'" />
      </div>
    </div>
    <div class="ignore-home-btn">
      <div class="ignore-home-icon">
        <van-icon name="bag" size="24px" @click="router.push('/profile')" />
      </div>
      <div>
        我的资产
      </div>
    </div>

  </div>
</template>
<style scoped lang="less">
@keyframes rotateImage {
  from {
    transform: rotateY(0deg); /* 从0度开始旋转 */
  }
  to {
    transform: rotateY(360deg); /* 旋转到180度 */
  }
}

@keyframes rotateLR {
  0% {
    transform: rotateY(0deg); /* 0%时，不旋转 */
  }
  25% {
    transform: rotateY(-45deg); /* 50%时，向左旋转45度 */
  }
  50% {
    transform: rotateY(0deg); /* 50%时，回到原点 */
  }
  75% {
    transform: rotateY(45deg); /* 50%时，向右旋转45度 */
  }
  100% {
    transform: rotateY(0deg); /* 100%时，回到原点 */
  }

}

.main {
  .ignore-home-btn,
  .ignore-miniprogram-btn {
    position: fixed;
    right: var(--van-back-top-right);
    bottom: calc(170px + constant(safe-area-inset-bottom));
    bottom: calc(170px + env(safe-area-inset-bottom));
    z-index: 20;
    text-align: center;
    font-size: 12px;
  }

  .ignore-home-btn .ignore-home-icon, .ignore-miniprogram-btn .ignore-home-icon {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--van-back-top-size);
    height: var(--van-back-top-size);
    cursor: pointer;
    color: var(--van-back-top-text-color);
    border-radius: var(--van-radius-max);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    transition: var(--van-duration-base) cubic-bezier(0.25, 0.8, 0.5, 1);
    background-color: var(--van-back-top-background);
  }

  width: 750px;
  position: relative;
  .img-box-perspective{
    perspective: 1000px;
  }
  .img-box {
    border-radius: 10px;
    height: 550px;
    width: 550px;
    border: 2px solid #fff;
    margin: 20px;
    box-shadow: 0 0 10px  #fff;
    animation: rotateLR 5s linear infinite; /* 使用关键帧动画实现无限往复旋转 */
  }
  .img-box2 {
    border-radius: 10px;
    height: 520px;
    width: 520px;
    border: 2px solid #fff;
    transition: drop-shadow 3s ease-in-out; /* 过渡动画 */

    filter: drop-shadow( 0 0 10px #fff) drop-shadow( 0 0 10px #fff) drop-shadow( 0 0 20px #fff) drop-shadow( 0 0 30px #fff);
  }

  .img {
    border-radius: 10px;
    height: 500px;
    width: 500px;
    margin: 0 auto;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

  }

  .model-btn {
    position: absolute;
    text-align: center;
    right: 20px;
    top: 20px;
    font-size: var(--size-info);
    z-index: 100;

    .eye {
      width: 52px;
      height: 32px;
      background-image: url(@/assets/imgs/eye.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;

    }

    .text {
      margin-top: 4px;
      line-height: 26px;
      scale: 0.8;
    }
  }

  .info {
    height: 165px;
    position: relative;
    background-image: url(@/assets/imgs/asset-footer.png);
    background-size: 600px 165px;
    background-repeat: no-repeat;
    background-position: center;
    text-align: center;

    .title {
      padding-top: 50px;
      color: #ffffff;
      font-size: var(--size-subject);
    }
  }


}
</style>
