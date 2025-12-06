<script setup lang="ts" name="UserMessage">
import NavBar from '@/components/NavBar.vue';
import MessageList from './components/MessageList.vue';
import router from '@/router';
import { useUserStore } from '@/store/User';

const userStore = useUserStore();
</script>
<template>
  <NavBar title="消息中心" />
  <van-cell-group :border="false" inset class="margin-top">
    <van-cell title="社区消息"
              :label="userStore.isLogin&&userStore.userInfo?.msgs.forum||0>0 ? '您有'+userStore.userInfo?.msgs.forum+'条待读消息' : '没有新消息'"
              class="align-center bg-gradual-cell shadow-gold margin-bottom" is-link
              @click="router.push('/message/forum')" :border="false">
      <template #icon>
        <div class="round round-forum"></div>
      </template>
    </van-cell>
    <van-cell title="官方公告"
              :label="userStore.isLogin&&userStore.userInfo?.msgs.announce||0>0 ? '您有'+userStore.userInfo?.msgs.announce+'条待读消息' : '没有新消息'"
              class="align-center bg-gradual-cell shadow-gold margin-bottom" is-link
              @click="router.push('/message/announce')" :border="false">
      <template #icon>
        <div class="round round-article"></div>
      </template>
    </van-cell>
  </van-cell-group>
  <div class="text-left padding">系统通知</div>


  <MessageList cate="system" />
</template>
<style scoped lang="less">
.round {
  width: 96px;
  height: 96px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 20px;

}

.round-forum {
  background-image: url(@/assets/imgs/round_forum.png)
}

.round-article {
  background-image: url(@/assets/imgs/round_article.png)
}
</style>
