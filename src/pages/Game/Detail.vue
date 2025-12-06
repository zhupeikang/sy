<script setup lang="ts">
import { getGameDetailApi } from '@/api/game';
import type { GameType } from '@/types';
import { inWechatBrowser, isIos } from '@/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Error from '@/components/Error.vue';
import Loading from '@/components/Loading.vue';
import router from '@/router';
import Back from '@/components/Back.vue';
import { showImagePreview } from 'vant';

const route = useRoute();
const game = ref<GameType>();
const loading = ref(false);
//处理错误
const errorShow = ref(false);
const errorText = ref('');
const onLoad = async () => {
  loading.value = true;
  const res = await getGameDetailApi({
    game_id: route.params.game_id,
    allowError: true,
  })
    .finally(() => loading.value = false);
  if (res) {
    if (res.code != 200) {
      errorShow.value = true;
      errorText.value = res.msg;
      return;
    }
    game.value = res.data;
  } else {
    errorShow.value = true;
    errorText.value = '加载失败';
  }
};
onLoad();
const showOutTips = ref(false);
const download = () => {

  //判断是否有IOS
  if (isIos()) {
    if (game.value?.ios_download_url) {
      if (inWechatBrowser()) {
        return showOutTips.value = true;
      }
      return window.open(game.value?.ios_download_url);
    }
  } else if (game.value?.android_download_url) {
    if (inWechatBrowser()) {
      return showOutTips.value = true;
    }
    return window.open(game.value?.android_download_url);
  }
  return window.open(game.value?.download_url);

};

const onClick = (item: any) => {
  switch (item.click_event) {
    case 'push':
      router.push(item.click_url);
      break;
    case 'link':
      window.location.href = item.click_url;
      break;
  }
};

const showImg = (index: number) => {
  showImagePreview({
    images: game.value?.imgs || [],
    startPosition: index,
  });
};
</script>
<template>
  <van-overlay :show="showOutTips" @click="showOutTips = false" z-index="200">
    <div class="share-tips"></div>
  </van-overlay>
  <Error :text="errorText" :show="errorShow" />
  <Loading mask v-if="loading" />
  <div v-if="game">
    <Back />
    <div class="cover" :style="{
            backgroundImage: `url(${game.cover_url})`
        }"></div>

    <div class="info">
      <div class="head flex justify-between">
        <div class="icon" :style="{
                    backgroundImage: `url(${game.icon_url})`
                }" v-if="game.icon_url"></div>
        <div class="params">
          <div class="name">{{ game.name }}</div>
          <van-button size="small" type="primary" @click="download">{{
              !['app'].includes(game.type) ? '跳转' : '下载'
            }}
          </van-button>
        </div>
      </div>
      <van-swipe :autoplay="3000" lazy-render v-if="game.imgs.length > 0">
        <van-swipe-item v-for="(image, index) in game.imgs" :key="index.toString()">
          <div class="desc_img_box">

            <img :src="image" class="desc_img" @click="showImg(index)" />
          </div>
        </van-swipe-item>
      </van-swipe>

      <van-text-ellipsis rows="3" :content="game.description" expand-text="展开" collapse-text="收起" class="desc" />
      <div v-if="game.children.length > 0" class="activity-list">
        <div>相关活动</div>
        <div class="item flex clickable" v-for="(item, index) in game.children" :key="index.toString()"
             @click="onClick(item)">
          <div class="thumb" :style="{
                        backgroundImage: `url(${item.cover_url})`
                    }"></div>
          <div class="summary">
            {{ item.summary }}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped lang="less">
.cover {
  width: 750px;
  height: 421.875px;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

.info {
  margin: 40px;

  .head {
    margin-bottom: 20px;

    .icon {
      width: 156px;
      height: 156px;
      border-radius: 10px;
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
    }

    .params {
      width: 480px;

      .name {
        height: 80px;
      }
    }
  }

  .desc_img_box {
    width: 710px;
    height: 400px;
    border-radius: 10px;
    overflow: hidden;
    line-height: 400px;
    //垂直居中
    display: flex;
    justify-content: center;
    align-items: center;

    .desc_img {
      max-width: 710px;
      max-height: 400px;
      border-radius: 10px;
    }
  }

  .desc {
    font-size: 28px;
    color: var(--gray);
  }

  .activity-list {
    margin-top: 20px;
    border-top: 1px solid var(--theme-deep-gold);
    padding-top: 20px;

    .item {
      margin-top: 10px;

      .thumb {
        width: 128px;
        height: 128px;
        border-radius: 10px;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
      }

      .summary {
        width: 520px;
        //自动换行
        word-break: break-all;
        word-wrap: break-word;
        margin-left: 20px;
        color: var(--gray);
        font-size: 28px;;
      }
    }
  }
}

.share-tips {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center top;
  background-image: url(@/assets/imgs/share_tips.png);
  width: 750px;
  height: 750px;
}
</style>
