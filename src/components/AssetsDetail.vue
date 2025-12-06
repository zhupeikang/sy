<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AssetType } from '@/types';
import { getUserAssetGroup } from '@/api/user';
import { toDatetime } from '@/utils';
import Avatar from '@/components/Avatar.vue';

const router = useRouter()
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const errorText = ref('')
const list = ref<AssetType[]>([])
const limit = 18
const props=defineProps(
  {
    item: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    uid:{
      type: Number,
      required: true
    }
  }
)
const emits=defineEmits(
  ['update:show']
)
const showModal = computed({
  get: () => props.show,
  set: (val) => {
    emits('update:show', val)
  }
})
const currentPage = ref(1)
const onLoad = () => {
  if (loading.value) return
  loading.value = true
  getUserAssetGroup({
    // getUserAssetListApi({
    uid: props.uid,
    page:currentPage.value,
    size:20,
    contract_id: props.item.contract_id,
    limit,
    showError: true
  })
    .then(res => {
      if (res.code != 200) {
        error.value = true
        errorText.value = res.msg
        return
      }
      if (res.data.current_page>=res.data.last_page) {
        finished.value = true
      }
      if (res.data.data.length > 0) {
        list.value = list.value.concat(res.data.data)
        currentPage.value += 1
      }
    })
    .catch(err => {
      error.value = true
      errorText.value = err.message
    })
    .finally(() => {
      loading.value = false
      refreshing.value = false
    })
}
const onRefresh = () => {
  finished.value = false;
  currentPage.value = 1;
  error.value = false
  errorText.value = ''
  // 重新加载数据
  list.value = []
  onLoad();
}
onLoad()


</script>

<template>
  <van-popup v-model:show="showModal" closeable round position="bottom"  :style="{ maxHeight: '80vh',height:'80vh'}">
    <van-nav-bar  title="资产合集"  class="popup-nav-bar">
<!--      <template #left>-->
<!--        <van-button size="small" @click="showModal = false">取消</van-button>-->
<!--      </template>-->
    </van-nav-bar>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
                :error-text="errorText">
        <div class="list">
          <div v-for="(item, index) in list" :key="index">
            <div class="flex justify-between align-center padding" style="border-bottom: 1px solid">
              <div class="flex justify-between align-center">
                <div class="flex align-center">
                  <Avatar :lock="item.lock_flag!='no'"  :url="item.contract.cover_url" />
                  <div class=" padding-left relative" >
                    <div style="font-size: 16px">
                      {{ item.contract.name }}
                    </div>
                    <div style="color: gray;font-size: 12px">{{ item.asset_no }}</div>

                  </div>
                </div>
              </div>
              <div class="flex flex-direction align-end">
                <div style="cursor: pointer"   @click="router.push('/asset/' + item.asset_no)" >
                  查看
                </div>
                <div style="font-size: 12px;color: gainsboro">
                  {{ toDatetime(item.owned_at) }}
                </div>
              </div>

            </div>

          </div>
        </div>
      </van-list>
    </van-pull-refresh>

  </van-popup>
</template>

<style scoped lang="less">

</style>
