<template>
  <div id="app-tabbar">
    <div class="ignore-tabbar-box"></div>
    <van-tabbar v-model="active" inactive-color="#777777" active-color="#baa586" :border="false">
      <van-tabbar-item v-for="(item, index) in tabbars" :key="index" :to="(item.path)"
                       :badge="index == 4 ? msgs == 0 ? '' : (msgs>99 ? '99+' : msgs) : ''"
                       :icon="index != 2 ? active == item.name ? getAssetURL(`assets/imgs/tabbar/${item.active}`) : getAssetURL(`assets/imgs/tabbar/${item.normal}`) : ''"
                       :name="item.name" replace
                       :class="index!=2 ? '' : 'ignore-center-action'"
      >
        <span v-if="index != 2">{{ item.title }}</span>
        <div v-else class="text-center">
          <img class="ignore-logo"
               :src="getAssetURL(`assets/imgs/tabbar/${active == item.name ? item.active:item.normal}`)" alt="">
          <span>创意中心</span>
        </div>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import tabbars from '@/config/tabbar';
import { getAssetURL } from '@/utils';
import { useUserStore } from '@/store/User';

const userStore = useUserStore();
const active = ref('');
const msgs = ref(0);
const router = useRouter();
// 监听当前路由
watch(
  () => router.currentRoute.value,
  (newValue: any) => {
    active.value = newValue.name;
  },
  { immediate: true },
);
watch(() => userStore.userInfo?.msgs, (newValue) => {
  if (newValue) {
    msgs.value = Object.values(userStore.userInfo?.msgs || {}).reduce((a, b) => a + b, 0);
  } else {
    msgs.value = 0;
  }
},{
  immediate: true,
});
</script>
<style lang="less" scoped>
:deep(.van-tabbar-item__icon) {
  margin-bottom: var(--van-padding-xs);
}

</style>
<style scoped>
#app-tabbar {
  position: relative;
}

.ignore-tabbar-box {
  height: calc(var(--van-tabbar-height) + 30px + constant(safe-area-inset-bottom));
  height: calc(var(--van-tabbar-height) + 30px + env(safe-area-inset-bottom));
}

.ignore-logo {
  display: block;
  width: 50px;
  height: 50px;
  margin-top: -35px;
  margin-bottom: 5px;
}

.ignore-center-action {

  position: relative;
}

.ignore-center-action::before {
  content: " ";
  position: absolute;
  width: 66px;
  height: 66px;
  bottom: 17px;
  left: 0;
  right: 0;
  margin: auto;
  background-color: var(--van-tabbar-background);
  z-index: -1;
  margin-top: auto;
  margin-right: auto;
  margin-bottom: auto;
  margin-left: auto;
  border-radius: 50%;
}
</style>



