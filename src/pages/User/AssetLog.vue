<script lang="ts" name="UserAssetlog" setup>
import NavBar from '@/components/NavBar.vue';
import { useDictStore } from '@/store/Dict';
import { ref, watch } from 'vue';
import router from '@/router';
import { toDatetime } from '@/utils';
import { AssetLogType } from '@/types';
import { getAssetLogListApi } from '@/api/asset';
import Avatar from '@/components/Avatar.vue';

const checked = ref(['transfer_in', 'transfer_out', 'mint', 'compose', 'destory']);

const dictStore = useDictStore();

const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const error = ref(false);
const errorText = ref('');
const list = ref<AssetLogType[]>([]);
const limit = 20;
const currentPage = ref(1);
const onLoad = () => {
  if (loading.value) return;

  loading.value = true;

  getAssetLogListApi({
    status: checked.value.includes('all') ? [] : [...checked.value],
    page: currentPage.value,
    size: limit,
    showError: true,
  })
    .then(res => {
      loading.value = false;
      if (res.code != 200) {
        error.value = true;
        errorText.value = res.msg;
        return;
      }
      if (res.data.current_page >= res.data.last_page) {
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
const statusList = ref<{
  label: string
  value: string
}[]>([]);
watch(() => dictStore.getDict('asset_log_status'), (newValue) => {
  statusList.value = newValue;
}, {
  immediate: true,
});
const chooseStatus = (val: string) => {
  if (checked.value.includes(val)) {
    checked.value = checked.value.filter(item => item != val);
  } else {
    checked.value.push(val);
  }
  onRefresh();
};
const cancelAll = () => {
  checked.value = [];
  onRefresh();
};
const checkAll = () => {
  checked.value = statusList.value.map(item => item.value);
  onRefresh();
};
</script>
<template>
  <van-pull-refresh v-model="refreshing" style="min-height:100vh" @refresh="onRefresh">

    <NavBar title="资产记录" />
    <div class="flex margin">
      <van-tag v-if="checked.length==statusList.length" class="margin-right tag-active" size="large"
               @click="cancelAll()">全选
      </van-tag>
      <van-tag v-else class="margin-right tag-unactive" size="large" @click="checkAll()">全选</van-tag>
      <van-tag v-for="(item, index) in statusList"
               :key="index.toString()" :class="'margin-right '+(!checked.includes(item.value) ? 'tag-unactive' : 'tag-active')"
               size="large"
               @click="chooseStatus(item.value)">{{ item.label
        }}
      </van-tag>
    </div>
    <!-- <van-search v-model="value" placeholder="请输入搜索关键词" /> -->
    <van-list :error="error" :error-text="errorText" :finished="finished" :loading="loading" finished-text="没有更多了"
              @load="onLoad">
      <div v-for="(item, index) in list"
           :key="index.toString()" class="margin-lr padding align-center flex cell justify-between margin-bottom clickable shadow-gold" @click="router.push('/user/assetlog/'+item.asset.asset_no)">
        <div class="flex align-center left">
          <Avatar :url="item.asset.contract.cover_url" />
          <div>
            <div class="text-deep-gold">{{ item.asset.name }}</div>
            <div>{{ item.asset.asset_no }}</div>
          </div>
        </div>
        <div class="flex align-center right">
          <div class="text-right">
            <div>
              <van-tag type="primary">{{ dictStore.getAssetLogStatusLabel(item) }}</van-tag>
            </div>
            <div class="text-gray">
              {{ toDatetime(item.created_at) }}
            </div>
          </div>
          <van-icon name="arrow" />
        </div>
      </div>

    </van-list>
  </van-pull-refresh>
</template>
<style lang="less" scoped>
.cell {
  background: var(--theme-gradual-cell);
  box-sizing: border-box;
  font-size: 28px;
  color: #ffffff;

  .left,
  .right {
    gap: 20px;
  }
}
</style>
