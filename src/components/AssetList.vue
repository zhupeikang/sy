<script setup lang="ts">
import { AssetType } from '@/types';
import { onActivated, ref, watch } from 'vue';
import { getUserAssetListApiV2 } from '@/api/user';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/User';
import { useRefreshStore } from '@/store/Refresh';
import AssetsDetail from '@/components/AssetsDetail.vue';
import Tag from '@/components/Tag.vue';

const userStore = useUserStore();
const refreshStore = useRefreshStore();

const props = defineProps({
  uid: {
    type: Number,
    required: true,
  },
});
const searchValue=ref(null);

const router = useRouter();
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const error = ref(false);
const errorText = ref('');
const list = ref<AssetType[]>([]);
const limit = 18;
onActivated(() => {
  onLoad();
});
const currentPage = ref(1);
const onLoad = () => {
  if (loading.value) return;
  loading.value = true;
  getUserAssetListApiV2({
    uid: props.uid,
    page: currentPage.value,
    size:limit,
    showError: true,
    search_value:searchValue.value
  })
    .then(res => {
      if (res.code != 200) {
        error.value = true;
        errorText.value = res.msg;
        return;
      }
      if (res.data.current_page>=res.data.last_page) {
        finished.value = true;
      }
      if (res.data.data.length > 0) {
        list.value = list.value.concat(res.data.data);
        currentPage.value += 1;
      }
    })
    .catch(err => {
      error.value = true;
      errorText.value = err.message;
    })
    .finally(() => {
      loading.value = false;
      refreshing.value = false;
    });
};
const onRefresh = () => {
  finished.value = false;
  currentPage.value = 1;
  error.value = false;
  errorText.value = '';
  // 重新加载数据
  list.value = [];
  onLoad();
};
const toSearch=()=>{
  onRefresh();
}
onLoad();
const showDetail = ref(false);
const showItem = ref({});
const lookDetail = (item: {}) => {
  showDetail.value = true;
  showItem.value = item;
};
watch(() => refreshStore.asset, (newData) => {
  if (newData && userStore.userInfo?.uid == props.uid) {
    if (list.value.length > 0 || finished.value) {
      refreshStore.asset = false;
      setTimeout(() => {
        if (!refreshStore.asset) {
          onRefresh();
        }
      }, 500);
    }
  }
});
</script>
<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
              :error-text="errorText">
      <van-search class="search ignore-search" v-model="searchValue" placeholder="搜索"  @search="toSearch" />
      <div class="list">
        <div class="item shadow-gold clickable" v-for="(item, index) in list" :key="index"
             @click="lookDetail(item)">
          <div class="cover" :style="{backgroundImage: `url(${item.contract.cover_url})`}">
            <div class="lock" v-if="item.lock_flag && item.lock_flag != 'no'"></div>
            <!--            <div style="position: absolute;top:0;right: 0">-->
            <!--              <Tag show-unit title="数量" :value="item.count"></Tag>-->
            <!--            </div>-->

          </div>
          <div class="info">
            <div class="van-ellipsis">{{ item.contract.name }}</div>
            <!--                        <div class="no">{{ item.asset_no }}</div>-->
          </div>

          <div class="info flex justify-between">
            <div>
              <Tag show-unit title="数量" :value="item.count"></Tag>

            </div>
            <div @click.stop="lookDetail(item)">
              查看
            </div>
            <!--                        <div class="no">{{ item.asset_no }}</div>-->
          </div>

        </div>
      </div>
    </van-list>
  </van-pull-refresh>
  <AssetsDetail v-if="showDetail" :uid="props.uid" :item="showItem" v-model:show="showDetail"></AssetsDetail>
</template>

<style scoped lang="less">
.list {
  margin: var(--block);
  background-repeat: no-repeat;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  min-height: 300px;

  .item {
    background-image: url(@/assets/imgs/bg.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: top center;
    width: calc(33.33% - 14px);
    box-sizing: border-box;
    font-size: 24px;

    .cover {
      margin: 0 auto;
      width: 100%;
      padding-top: 102%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      box-sizing: border-box;

      position: relative;

      .lock {
        position: absolute;
        right: 10px;
        bottom: 10px;
        width: 27px;
        height: 34.5px;
        background-image: url(@/assets/imgs/lock.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }

    .info {
      box-sizing: border-box;
      padding: 0 10px;

      .no {
        color: #ffffff;
      }
    }
  }
}
</style>
