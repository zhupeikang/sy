<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { inviteBuild, inviteList } from '@/api/user';
import { computed, onMounted, ref } from 'vue';
import { showFailToast, showToast } from 'vant';
import useClipboard from 'vue-clipboard3';
import { useUserStore } from '@/store/User';
import Avatar from '@/components/Avatar.vue';
import { toDatetime } from '@/utils';
import router from '@/router';

const inviteUrl = computed(() => window.location.origin + '/?i=' + userStore.userInfo.invite_code);
const userStore = useUserStore();
const getInviteCode = () => {
  inviteBuild().then(res => {
    userStore.updateUserInfo();
  });
};
const { toClipboard } = useClipboard();

const onCopy = async (text: string) => {
  try {
    await toClipboard(window.location.origin + '/?i=' + text);
    showToast('复制成功');
  } catch (e) {
    showFailToast('复制失败');
    console.error(e);
  }
};
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
  inviteList({
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
  return zero(Math.ceil(total / (24 * 60 * 60)));
};

const list = () => {
  router.push('/user/invite/rank');
};

const goUser = (item: any) => {
  console.log(item);
  router.push({
    path: '/u/'+item.uid,
  });
};

</script>

<template>
  <NavBar title="我的邀请"></NavBar>
  <div class="text-center margin">
    <div class="margin-top">
      我的邀请链接
    </div>
    <div class="" v-if="userStore.userInfo.invite_code">
      <van-field class="field" readonly disabled input-align="center" v-model="inviteUrl">
        <template #input>
          <div>
            {{ inviteUrl }}
          </div>
          <div class="margin-left">
            <van-icon size="16" name="file-copy" class="right-icon" class-prefix="sylf-icon"
                      @click="onCopy(userStore.userInfo.invite_code)" />
          </div>

        </template>

      </van-field>


      <div class="margin-top">
        该邀请码永久有效
      </div>
    </div>
    <div v-else>
      <div class="margin-top">
        首次邀请，需要点击生成专属邀请码
      </div>
      <div class="margin-top">
        <van-button size="small" @click="getInviteCode()" type="primary">生成</van-button>
      </div>
    </div>

  </div>
  <div class="margin">
    <van-divider></van-divider>
    <div>
      <div class="flex justify-between" style="font-size: 16px">
        <div>
          被邀请者:{{ totalCount }}
        </div>
        <div @click="list">
          邀请排行榜
          <van-icon name="arrow" />
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
              <Avatar @click="goUser(item)" :url="item.avatar" />
              <div class="padding-left">{{ item.nickname }}</div>
            </div>
            <div >
              <div style="color: grey;font-size: 12px">已加入{{ getDays(toDatetime(item.created_at)) }}天</div>
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

:deep(.field) {
  input {
    //border: 1px solid var(--van-cell-border-color);
  }
}
.margin-top{
}
</style>
