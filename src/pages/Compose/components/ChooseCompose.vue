<script setup lang="ts">
import { getPlanComposeListApi } from '@/api/plan';
import { PlanComposeType } from '@/types';
import { ref, useAttrs } from 'vue';

const inited = ref(false);
const visible = ref(false);

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const error = ref(false);
const errorText = ref('');
const list = ref<PlanComposeType[]>([]);
// 取出attrs
const attrs = useAttrs();


defineExpose({
  show() {
    visible.value = true;
    inited.value = true;
  },
});
const onRefresh = async () => {
  finished.value = false;
  list.value = [];
  await onLoad();
};

/**
 * 加载数据
 */
const onLoad = async () => {
  loading.value = true;
  const res = await getPlanComposeListApi({
    limit: 10,
    skip: list.value.length,
    showError: true,
  });
  loading.value = false;
  refreshing.value = false;
  if (res) {
    if (res.code == 200) {
      if (res.data.list.length < 10) {
        finished.value = true;
      }
      // 取出selected


      list.value = list.value.concat(res.data.list);
    } else {
      error.value = true;
      errorText.value = res.msg;
    }
  } else {
    error.value = true;
    errorText.value = '加载失败';
  }
};
const emits = defineEmits(['choose']);
</script>
<template>
  <van-popup v-model:show="visible" :style="{ minHeight: '30vh' }" position="bottom">
    <van-nav-bar title="合成列表" :border="false" class="popup-nav-bar">
      <template #left>
        <van-button size="small" @click="visible = false">取消</van-button>
      </template>
    </van-nav-bar>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多合成了" @load="onLoad"
                v-if="inited"
                :error="error" :error-text="errorText" :style="{ overflowX: 'scroll' }" class="list">
        <div v-for="(item, index) in  list " :key="index.toString()" class="compose-item"
             @click="emits('choose', item); visible = false">
          <div class="main item">
            <div class="cover" :style="{
                                backgroundImage: 'url(' + item.plan.cover_url + ')'
                            }
                            "></div>
            <div class="name">{{ item.plan.subject }}</div>
          </div>

          <van-icon name="arrow-left" />

          <div class="item" v-for="( child, i ) in  item.children " :key="i + '_' + index">
            <div class="cover" :style="{
                                backgroundImage: 'url(' + child.contract.cover_url + ')'
                            }
                            "></div>
            <div class="name">{{ child.contract.name }}</div>
          </div>
        </div>

      </van-list>
    </van-pull-refresh>
  </van-popup>
</template>
<style scoped lang="less">
.list {
  background-color: var(--theme-bg);
  padding: 20px;

  .compose-item {
    width: max-content;

    box-sizing: border-box;
    //从左往右排序，超出部分滚动显示
    overflow-x: scroll;

    .item {
      box-sizing: border-box;
      border-radius: 10px;
      display: inline-block;
      vertical-align: middle;
      background-image: url(../../../assets/imgs/bg.png);
      background-size: 100% 100%;
      background-position: center;
      width: 200px;
      height: 270px;
      background-repeat: no-repeat;

      .name {
        font-size: var(--size-info);
        padding: 0 15px;
        //超出一行隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        height: 70px;
        line-height: 70px;
      }

      .cover {
        box-sizing: border-box;
        width: 200px;
        margin: 0 auto;
        padding-top: 100%;
        background-size: contain;
        background-position: center;
      }
    }

    .item.main {
      width: 230px;

      height: 305px;

      .cover {
        width: 230px;
        height: 230px;
      }

      .name {

        height: 75px;
        line-height: 75px;
      }
    }

    .item + .item {
      margin-left: 10px;
    }
  }
}</style>
