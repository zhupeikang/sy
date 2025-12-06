<script setup lang="ts">
import { MsgType } from '@/types';
import { ref } from 'vue';
import { deleteUserMessage, getUserMsgListApi, readAllUserMessage, readUserMessage } from '@/api/user';
import { useRouter } from 'vue-router';
import { fuzzyTime, showLoading, toDatetime } from '@/utils';
import Avatar from '@/components/Avatar.vue';
import { useUserStore } from '@/store/User';
import { OnLongPress } from '@vueuse/components';
import { showConfirmDialog } from 'vant';

const props = defineProps({
  cate: {
    type: String,
    required: true,
  },
});
const router = useRouter();
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const error = ref(false);
const errorText = ref('');
const list = ref<MsgType[]>([]);
const limit = 20;
const userStore = useUserStore();
const status = ref('N');
const onLoad = () => {
  if (loading.value) return;

  loading.value = true;

  getUserMsgListApi({
    cate: props.cate,
    skip: list.value.length,
    limit,
    showError: true,
    status: status.value,
  })
    .then(res => {
      if (res.code != 200) {
        error.value = true;
        errorText.value = res.msg;
        return;
      }
      if (res.data.list.length < limit) {
        finished.value = true;
      }
      if (res.data.list.length > 0) {
        list.value = list.value.concat(res.data.list);
      }
      // userStore.updateUserInfo();

    })
    .catch(err => {
      error.value = true;
      errorText.value = err.message;
    })
    .finally(() => {
      loading.value = false;
      refreshing.value = false;
    });
};
const onRefresh = () => {
  finished.value = false;

  error.value = false;
  errorText.value = '';
  // 重新加载数据
  list.value = [];
  onLoad();
};
//获取Transfer组件的ref
const clickItem = async (item: MsgType) => {
  item.status = 'Y';
  readUserMessage({ msg_id: item.msg_id }).then(() => {
    userStore.updateUserInfo();
  });
  if (item.scene == 'transfer') {
    router.push(item.url);
  } else if (item.url) {
    // 判断url中是否存在http字符
    if (item.url.indexOf('http://') === 0 || item.url.indexOf('https://') === 0) {
      window.location.href = item.url;
    } else {
      router.push(item.url);
    }
  }
};
onLoad();
const onLongPressCallbackHook = (item: MsgType) => {
  showConfirmDialog({
    message:
      '确定删除此消息?',
  })
    .then(() => {
      const index = list.value.findIndex(i => item.msg_id === item.msg_id);
      list.value.splice(index, 1);
      deleteUserMessage({ msg_id: item.msg_id }).then(() => {
        if (item.status === 'N') {
          userStore.updateUserInfo();
        }
        onRefresh();
      });
    })
    .catch(() => {
      // on cancel
    });
};

const changeStatus = (type: string) => {
  if (type === status.value) {
    return;
  }
  status.value = type;
  onRefresh();
};

const readAll = () => {
  // 如果未读数量为0，不弹出确认框
  if (userStore.userInfo?.msgs[props.cate] === 0) {
    return;
  }
  showConfirmDialog({
    message:
      '确定全部标记为已读?',
  }).then(async () => {
      const loading = showLoading('加载中');
      const callback = async () => {
        list.value.forEach(item => {
          item.status = 'Y';
        });
        readAllUserMessage({ cate: props.cate }).then(() => {
          userStore.updateUserInfo();
          onRefresh();
        }).catch(() => {
          // on cancel
        });
      };
      await callback();
      loading.end();
    })
    .catch(() => {
      // on cancel
    });
};

</script>
<template>
  <div class="text-left padding">
    <div class="flex justify-between">
      <div>
        <van-badge :show-zero="false" :content="userStore.userInfo?.msgs[props.cate]">
          <van-tag @click="changeStatus('N')" :plain="status==='N'" type="primary" size="large">未读</van-tag>
        </van-badge>
        <van-tag @click="changeStatus('Y')" style="margin-left: 10px" size="large" type="primary" :plain="status==='Y'">
          已读
        </van-tag>
      </div>
      <div>
        <van-tag @click="readAll"   type="primary" size="large">一键已读</van-tag>
      </div>
    </div>


  </div>

  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
              :error-text="errorText" style="min-height: 50vh" :immediate-check="false">
      <div class="list">
        <template v-for="(item, index) in list" :key="index.toString()">
          <OnLongPress
            class="ml-2 button small"
            @trigger="onLongPressCallbackHook(item)"
          >
            <van-cell v-if="item.scene == 'follow'"
                      :title="`${item.user?.nickname}关注了您！`"
                      :label="fuzzyTime(item.created_at)" @click="router.push('/u/'+item.scene_id)" clickable
                      :class="(item.status == 'N' ? ' unread' : '')+' item'" :border="false">
              <template #icon>
                <Avatar :url="item.user?.avatar||''" class="margin-right" />
              </template>
            </van-cell>
            <div :class="`item` + (item.status == 'N' ? ' unread' : '')" v-else @click="clickItem(item)">
              <div>
                <van-icon name="warning" />
                {{ toDatetime(item.created_at) }}
              </div>
              <div v-if="item.scene == 'transfer' || item.scene == 'text' ||item.scene=='reply'">
                <div style="word-break: break-all" v-for="(row, index) in item.content.split('\n')"
                     :key="index.toString()">{{ row }}
                </div>
              </div>
            </div>
          </OnLongPress>

        </template>

      </div>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped lang="less">
.list {
  box-sizing: border-box;

  .item {
    width: auto;
    box-sizing: border-box;
    padding: var(--padding);
    font-size: var(--size-info);
    background-color: #171717;
    color: #cccccc;
    margin: 0 var(--block) var(--block);
    border-radius: 10px;
    word-break: break-all;
  }

  .unread {
    background-color: #cccccc;
    color: #171717;
  }


}
</style>
