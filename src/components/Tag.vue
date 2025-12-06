<script setup lang="ts">
import { useSlots } from 'vue';

const props = defineProps({
  title: {
    type: String,
  },
  value: {
    type: [String, Number]
  },
  showValue: {
    type: Boolean,
    default: true,
  },
  unit: {
    type: String,
    default: '份',
  },
  showUnit: {
    type: Boolean,
    default: false,
  },
});
const slots = useSlots();
</script>
<template>
  <div class="tag">
    <div class="title" :class="{radius:!showValue}">
      <slot name="title" v-if="slots.title" />
      <span>{{ props.title }}</span>
    </div>
    <div v-if="showValue" class="value">
      <slot name="value" v-if="slots.value" />
      <span>{{ props.value }}{{ showUnit ? ' ' + unit : '' }}</span>
    </div>
  </div>
</template>
<style scoped lang="less">
.tag {
  display: inline-block;
  font-size: 20px;

  .title {
    border-radius: 5px 0 0 5px;
    display: inline-block;
    background: var(--theme-gradual-gold);
    padding: 0 10px;
    color: var(--black);
  }
  .radius{
    border-radius: 5px

  }

  .value {
    border-radius: 0 5px 5px 0;
    display: inline-block;
    background: #000000;
    padding: 0 10px;
    color: var(--theme-gold);
  }
}
</style>
