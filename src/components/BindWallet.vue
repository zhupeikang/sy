<script setup lang="ts">
import { computed, ref } from 'vue';
import { userProfileBind } from '@/api/user';
import { showToast } from 'vant';
import { useUserStore } from '@/store/User';

const userStore = useUserStore()
const props = defineProps(
  {
    show: {
      type: Boolean,
      default: false,
    },
  },
);
const emits = defineEmits(
  ['update:show'],
);
const showModal = computed({
  get: () => props.show,
  set: (val) => {
    emits('update:show', val);
  },
});
const bindLoading = ref(false);
const walletAddress = ref();
const bind = () => {
  bindLoading.value = true;
  userProfileBind({
    address: walletAddress.value,
  }).then(res => {
    if (res.code === 200) {
      showToast(res.msg)
      showModal.value = false;
      userStore.updateUserInfo();
    }
  }).finally(() => {
    bindLoading.value = false;
  });
};
</script>

<template>
  <div>
    <van-popup v-model:show="showModal" closeable round position="bottom" :style="{ maxHeight: '40vh',height:'20vh'}">
      <van-nav-bar title="绑定Conflux钱包" class="popup-nav-bar">
      </van-nav-bar>
      <van-cell-group>
        <van-cell>
          <van-field v-model="walletAddress" border placeholder="复制钱包地址到此处，复制完成后点击确定">
            <template #button>
              <van-button @click="bind" :loading="bindLoading" type="primary">确定</van-button>
            </template>
          </van-field>
        </van-cell>
      </van-cell-group>
    </van-popup>
  </div>

</template>

<style scoped lang="less">

</style>
