<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { showToast } from 'vant';
import NavBar from '@/components/NavBar.vue';
import { getBuyerList } from '@/api/ticket';
import router from '@/router';
import { usePurchaser } from '@/store/UsePurchaser';
import { storeToRefs } from 'pinia';

const {checkedIds} = storeToRefs(usePurchaser());
const list = ref([]);
const selected = ref({});
const isSelect = ref(false);
//判断路由地址是否为purchaser/select 进入选择模式
onMounted(() => {
  getBuyerList().then(res => {
    list.value = res.data;
  });
});
const onEdit = (item) => {
  selected.value = item;
  router.push({
    path: '/purchaser/edit',
    query: {
      id: item.id,
    },
  });
};
const onAdd = () => {
  // 最多添加9个购票人
  if (list.value.length >= 9) {
    showToast('最多添加9个购票人');
    return;
  }
  router.push({
    path: '/purchaser/edit',
  });
};
// const checkedIds = ref([]);
const onSelect = () => {
  router.back();
};
const maxSelect = ref(<any>9);
watch(() => router.currentRoute.value, (r) => {
  if (r.path === '/purchaser/select') {
    isSelect.value = true;
    const {max, selected} = r.query;
    if (max) {
      maxSelect.value = max;
    }
  }
}, {
  immediate: true,
});
</script>

<template>
  <NavBar title="购票人管理">
    <template #right>
      <van-button icon="add" size="mini" type="primary" @click="onAdd">新增</van-button>
    </template>
  </NavBar>
  <van-empty v-if="list.length == 0" description="暂时还没有购票人" />
  <van-cell-group v-else>
    <van-checkbox-group v-model="checkedIds"  >
      <van-cell
        v-for="item in list"
        :key="item.id"
        :label="item.mobile"
        :title="item.card_name"
        center
        title-class="label-class"
      >
        <template #title>
          <div class="flex items-center">
            <div>
              {{ item.card_name }}
            </div>
            <div v-if="item.is_default">
              <span class="ml-20px linear  b-rd-4px text-black p-x-20px text-20px p-y-8px">默认</span>
            </div>
          </div>

        </template>
        <template #right-icon>
          <van-icon name="edit" @click="onEdit(item)" />
        </template>
        <template v-if="isSelect" #icon>
          <van-checkbox :name="item.id" shape="square" />
        </template>
      </van-cell>
    </van-checkbox-group>
  </van-cell-group>
  <div class="bottom-placeholder">
    <div class="fixed-bottom">
      <van-button
        block
        v-if="isSelect"
        type="primary"
        round
        @click="onSelect"
        :disabled="checkedIds.length === 0"
        >确定</van-button
      >
    </div>
  </div>
</template>

<style lang="less" scoped>
.bottom-placeholder {
  height: 100px; /* 占位元素的高度与固定元素相同 */
  padding: 20px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 20px;
  box-sizing: border-box;
  font-size: 26px;
  width: 100%;
  right: 0;
  z-index: 100;
  text-align: center;
  color: #000000;
}

:deep(.label-class) {
  margin-left: 20px;
}
</style>
