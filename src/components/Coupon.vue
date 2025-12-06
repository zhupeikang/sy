<script lang="ts" setup>
import { ref } from 'vue';
import { exchangeCoupon } from '@/api/ticket';
import { showToast } from 'vant';

const emit = defineEmits(['finish']);
const isLoading = ref(false);
// 去兑换优惠券
const exchange = () => {
  if (isLoading.value) return;
  if (!couponCode.value) {
    showToast({
      message: '请输入优惠码',
    });
    return;
  }
  isLoading.value = true;
  exchangeCoupon({
    no: couponCode.value,
  }).then(res => {
    if (res.code === 200) {
      showToast({
        message: '兑换成功',
      });
      setTimeout(() => {
        emit('finish');
      }, 500);
    }
  }).finally(() => {
    isLoading.value = false;
  });
};
const couponCode = ref('');
</script>

<template>
  <div class="p-y-100px">
    <van-cell-group inset>
      <van-cell>
        <van-field v-model="couponCode" class="field" input-align="center" placeholder="请输入优惠码">
          <template #button>
            <!--            <div class="bg linear w-200px text-center p-y-10px">-->
            <!--              兑换-->
            <!--            </div>-->
            <van-button :loading="isLoading" class="linear" size="small" @click="exchange">兑换</van-button>
          </template>
        </van-field>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<style lang="less" scoped>
.field {
  border: 1px solid var(--theme-gold);
  border-radius: 10px;
}
</style>
