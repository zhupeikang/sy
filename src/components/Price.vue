<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    value: 0,
  },
  isOriginal: {
    type: Boolean,
    default: false,
  },
});

const integer = ref('');
const digital = ref('');
watch(
  () => props.value,
  (newData) => {
    if (!newData) {
      integer.value = '0';
      digital.value = '.00';
      return;
    }
    integer.value = Math.floor(newData).toString();
    digital.value = (newData - Math.floor(newData)).toFixed(2).toString().substring(1);
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>
<template>
  <div :class="{'van-card__origin-price':isOriginal}" class="price">
    <span class="unit">&#165;</span>
    <span class="integer">{{ integer }}</span>
    <span class="digital">{{ digital }}</span>
  </div>
</template>
<style lang="less" scoped>
.integer {
  font-size: 32px;
  color: #dbb985;
}

.digital {
  font-size: 28px;
  color: #dbb985;
}

.unit {
  font-size: 28px;
  margin-right: 6px;
  color: var(--theme-deep-gray);
}
</style>
