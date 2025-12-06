<script lang="ts" setup>
import router from '@/router';
import { useKeepAliverStore } from '@/store/KeepAliver';
import { ref, useAttrs } from 'vue';
import { useRoute } from 'vue-router';

const emits = defineEmits(['back', 'backBefore']);

const KeepAliverStore = useKeepAliverStore();
const route = useRoute();
const props = defineProps({
  asyncAction: Function, // 父组件传入的异步方法
  title: {
    type: String,
  },
  fixed: {
    type: Boolean,
    default: true,
  },
  leftArrow: {
    type: Boolean,
    default: true,
  },
  search: {
    type: String,
    default: '',
  },
  routerBack: {
    type: Boolean,
    default: true,
  },
  navbox: {
    type: Boolean,
    default: true,
  },
});

const onBack = async () => {
  // 1. 执行传入的异步操作，如果有的话
  if (props.asyncAction) {
    try {
      // 等待异步操作完成
      await props.asyncAction.call(null);
    } catch (error) {
      console.error('Error executing asyncAction:', error);
      return; // 如果异步操作失败，停止后续的操作
    }
  }

  // 2. 如果传递了 routerBack，执行路由操作
  if (props.routerBack) {
    // 清除缓存或相关数据
    KeepAliverStore.remove(route.name as string);

    // 根据浏览器历史记录的长度判断跳转方式
    if (history.length == 1) {
      router.replace('/home');  // 如果历史记录中只剩下一个条目，跳转到首页
    } else {
      router.back();  // 否则返回上一页
    }
    return;  // 如果有 routerBack 操作，则结束函数执行，不再触发 'back' 事件
  }

  // 3. 如果没有传递 routerBack，触发 back 事件
  emits('back');
};

const attrs = useAttrs();
const bar = ref(null);
// 获取组件距离顶部的高度
const getBarHeight = () => {
  return bar.value.$el.getBoundingClientRect().height;
};
defineExpose({
  getBarHeight,
});
// 整个实例暴露出去

</script>
<template>
  <van-nav-bar ref="bar" :border="false" :fixed="props.fixed" :left-arrow="props.leftArrow" :title="props.title"
               class="top-nav"
               v-bind="attrs" @click-left="onBack">
    <template #right>
      <van-icon v-if="props.search" name="search" size="18" @click="router.push('/search?type=' + props.search)" />
      <slot v-else name="right"></slot>
    </template>
  </van-nav-bar>
  <div v-if="props.fixed && props.navbox" class="ignore-navbox"></div>
</template>
<style scoped>
.ignore-navbox {
  height: var(--van-nav-bar-height);
}

.top-nav {
  --van-nav-bar-title-text-color: #ffffff;
  --van-nav-bar-background: var(--theme-bar);
}
</style>
