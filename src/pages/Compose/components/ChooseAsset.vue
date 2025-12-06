<script setup lang="ts">
import {getPlanComposeAssetApi} from '@/api/plan';
import {PlanComposeChildType} from '@/types';
import {showLoading} from '@/utils';
import {ref} from 'vue';
import {it} from "node:test";
import {showConfirmDialog, showToast} from "vant";

const compose_id = ref(0)
const child = ref<PlanComposeChildType>()
const show = ref(false)
const selected = ref<string[]>([])
const assetList = ref<{
  asset_no: string
  lock_flag: string
}[]>([])
defineProps({
  select: {
    type: Array,
    default: () => [],
  },
})

defineExpose({
  onInit: async (id: number, item: PlanComposeChildType) => {
    console.log(item)
    const loading = showLoading()
    const res = await getPlanComposeAssetApi({
      compose_id,
      page: 1,
      size: 100,
      'status': 'success',
      'order_by': 'asset_rights_use_count',
      contract_id: item.contract_id,
      'order_asc': 'asc'
    })
    if (res) {
      loading.end()
      compose_id.value = id
      child.value = item
      selected.value = child.value.selected || []
      show.value = true
      assetList.value = res.data.data
    }
  }
})
const emits = defineEmits(['confirm'])
const onConfirm = async () => {
  if (!child.value) return
  show.value = false
  emits('confirm', selected.value)
}

const onChoose = (item: {
  asset_no: string
  lock_flag: string
}) => {
  if (!child.value || item.lock_flag != 'no') return
  if (selected.value.includes(item.asset_no)) {
    selected.value = selected.value.filter(v => v != item.asset_no)
    return;
  }
  if (selected.value.length >= child.value?.nums){
    showToast(`最多只能选择${child.value?.nums}个资产`)
    return;
  }

  // 判断权益是否用完 如果没用完则进行提示
  if (item.asset_rights_count && (item.asset_rights_use_count <= item.asset_rights_count)) {
    showConfirmDialog({
      title: '确认使用',
      message: '您选择的资产权益还未用完，确认继续选择该资产吗？',
    }).then(() => {
        selected.value.push(item.asset_no)
    }).catch(() => {
      // on cancel
    });
    return;
  }

    selected.value.push(item.asset_no)
}
</script>
<template>
  <van-popup v-model:show="show" :style="{ minHeight: '30vh' }" position="bottom" class="dialog">
    <van-nav-bar :title="`已选择${selected.length}/${child?.nums}`" :border="false" class="popup-nav-bar">
      <template #right>
        <van-button size="small" type="primary" @click="onConfirm"
                    :disabled="child?.nums != selected.length">确认
        </van-button>
      </template>
      <template #left>
        <van-button size="small" @click="show = false">取消</van-button>
      </template>
    </van-nav-bar>
    <van-checkbox-group v-model="selected" :max="child?.nums">
      <div class="grid! gap-2 grid-cols-3 p-4 max-h-[60vh] overflow-y-auto">
        <div  v-for="(item, index) in assetList" :key="index.toString()" @click="onChoose(item)" class="relative py-2 rounded-sm border-solid border-gray-500 w-full border-.5px aspect-square">
          <div class="flex flex-col gap-2 justify-center items-center">
            <img class="object-contain rounded-md w-85%" :src="child?.cover_url" />
            <div class="name text-18px!">
              {{
                item.asset_no
              }}
            </div>

            <div v-if="item.lock_flag!=='no'" class="w-full h-full flex-col gap-2 flex justify-center items-center absolute top-0 left-0 bg-black bg-opacity-70 text-xs">
            <van-icon name="lock" size="40"></van-icon>
              已锁定
            </div>
            <div v-if="selected.includes(item.asset_no)" class="w-full h-full flex gap-2 flex-col justify-center items-center absolute top-0 left-0 bg-black bg-opacity-70 text-xs px-1">
              <van-icon name="passed" size="40"></van-icon>
              已选择
            </div>
            <div class="absolute text-20px text-center py-2 top-0 right-0 bg-black/50 w-full">
              权益使用：{{item.asset_rights_use_count}}/{{item.asset_rights_count}}
            </div>
          </div>
        </div>
      </div>
<!--      <div class="assetList">-->
<!--        <div class="item" v-for="(item, index) in assetList" :key="index.toString()" @click="onChoose(item)">-->
<!--          <div class="cover" :style="{ backgroundImage: `url(${child?.cover_url})` }">-->
<!--            <van-checkbox :disabled="select.includes(item.asset_no)" :name="item.asset_no" v-if="item.lock_flag == 'no'"-->
<!--                          class="choose" @click.stop/>-->
<!--            <van-icon name="lock" class="choose" v-else/>-->
<!--          </div>-->
<!--          <div class="name">{{ item.asset_no }}</div>-->
<!--        </div>-->
<!--      </div>-->
    </van-checkbox-group>
  </van-popup>
</template>
<style scoped lang="less">


.assetList {
  background-color: #222222;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 9px;
  max-height: 60vh;
  overflow-y: scroll;
  padding: 20px;

  .item {
    margin-right: 10px;
    width: 223px;
    box-sizing: border-box;
    background-image: url(../../../assets/imgs/bg.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 10px;

    .cover {
      width: 100%;
      padding-top: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      position: relative;

      .choose {
        position: absolute;
        right: 0px;
        top: 0px;
      }
    }

    .name {
      padding: 0 20px;
      font-size: var(--size-info);
      height: 75px;
      line-height: 75px;
    }
  }

  .item:nth-child(3n) {
    margin-right: 0px;
  }
}
</style>
