<script setup lang="ts">
import { inviteRank } from '@/api/user';
import { onMounted, ref } from 'vue';
import useClipboard from 'vue-clipboard3';
import { useUserStore } from '@/store/User';
import Avatar from '@/components/Avatar.vue';
import { getAssetURL, toDatetime } from '@/utils';
import NavBar from '@/components/NavBar.vue';

const userStore = useUserStore();
const { toClipboard } = useClipboard();

const dataList = ref<[]>([]);
const limit = 10;
const totalCount = ref(0);
const onLoad = async () => {
  if (!userStore.userInfo.invite_code) {
    return;
  }
  if (loading.value) {
    return;
  }
  loading.value = true;
  inviteRank({
    skip: dataList.value.length,
    limit,
    showError: true,
  })
    .then(res => {
      if (res.code != 200) {
        error.value = true;
        errorText.value = res.msg;
        return;
      }
      totalCount.value = res.data.count;
      rank.value = res.data.rank;
      if (res.data.list.length < limit) {
        finished.value = true;
      }
      if (res.data.list.length > 0) {
        dataList.value = dataList.value.concat(res.data.list);
      }
    })
    .finally(() => loading.value = false);


};
const loading = ref(false);
const finished = ref(false);
const error = ref(false);
const errorText = ref('');
const rank = ref(0);

onMounted(() => {
  onLoad();
});
// 计算距离今天的天数
const getDays = (date: string) => {
  const date1 = new Date(date);
  const date2 = new Date();
  const s1 = date1.getTime(), s2 = date2.getTime();
  const total = (s2 - s1) / 1000;
  // 补0
  const zero = (n: number) => {
    return n < 10 ? '0' + n : n;
  };
  return zero(Math.floor(total / (24 * 60 * 60)));
};

const list = () => {

};

const ranSrc = (index: any) => {
  // 获取资源路径
  // const ranSrc = require(`@/assets/images/rank_${index}.svg`)
  return getAssetURL(`assets/imgs/rank_${index}.svg`);
  // return new URL(`@/assets/images/rank_${index}.svg`, import.meta.url).href
};
const NavBarRef = ref<InstanceType<typeof NavBar>>();
const container = ref(null);
const offSetTop = ref(0);
onMounted(() => {
  offSetTop.value = NavBarRef.value?.getBarHeight()-10 || 0;
});

</script>

<template>
  <NavBar ref="NavBarRef" title="邀请排行榜"></NavBar>
    <div class="text-center bg ">
      <div class="margin-top">
        您当前的排名
      </div>
      <div class="" v-if="userStore.userInfo.invite_code">
        <div class="margin-top" v-if="rank===0">
          未上榜
        </div>
        <div class="margin-top" v-else>
          {{ rank }}
        </div>
        <div class="margin-top">
          （当前榜单仅记录邀约前200名的用户）
        </div>
        <div class="margin-top">
          累计邀约用户：{{ totalCount }} 名
        </div>
      </div>
    </div>
  <div class="margin">
    <van-divider></van-divider>
    <div>
      <div class="flex justify-between" style="font-size: 16px">
        <div>
          邀请排行榜
        </div>
      </div>

    </div>
    <div>
      <van-list v-if="userStore.userInfo.invite_code" :loading="loading" :finished="finished" finished-text="没有更多了"
                @load="onLoad" v-model:error="error"
                :error-text="errorText">
        <div v-for="(item, index) in dataList" :key="index">
          <div class="flex justify-between align-center padding-bottom padding-top" style="border-bottom: 1px solid">
            <div class="flex justify-between align-center">
              <div class="flex align-center">
                <img v-if="index<=2" :src="ranSrc(index)" alt="" class="margin-right">
                <div class="margin-right" v-else>{{ index }}</div>
                <Avatar :url="item.avatar" />
                <div class=" padding-left" >
                  <div style="font-size: 16px">
                    {{ item.nickname }}
                  </div>
                  <div style="color: gray;font-size: 12px">已加入{{ getDays(toDatetime(item.created_at)) }}天</div>
                </div>

              </div>
            </div>
            <div style="font-size: 12px;color: gainsboro">
              邀请 <span style="color:  var(--theme-deep-gold);">{{ item.count }}</span> 人
            </div>
          </div>

        </div>
      </van-list>
      <van-empty v-else></van-empty>
    </div>
  </div>

</template>

<style scoped lang="less">
.avatar {
  display: inline-block;
  border-radius: 1.33333vw;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.bg {
  background: var(--theme-bg) !important;

  //z-index: 100;
}
</style>
