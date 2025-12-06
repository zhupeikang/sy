<script setup lang="ts" name="ThreadDetail">
import { nextTick, Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getForumReplyListApi, getForumThreadApi, likeForumThreadApi, replyForumThreadApi } from '@/api/forum';
import Loading from '@/components/Loading.vue';
import type { ThreadType } from '@/types';
import Error from '@/components/Error.vue';
import NavBar from '@/components/NavBar.vue';
import ThreadItem from '../../components/Thread.vue';
import { showToast } from 'vant';
import { useRefreshStore } from '@/store/Refresh';

const threadNo = ref('')
const loading = ref(false)
const route = useRoute()
const thread = ref<ThreadType>()
const errorText = ref('')
const errorShow = ref(false)
const replies = ref<ThreadType[]>([])
const refreshing = ref(false)
const onRefresh = async () => {
    loading.value = true
    errorText.value = ''
    errorShow.value = false
    replies.value = []
    const res = await getForumThreadApi({
        thread_no: threadNo.value,
        showError: true,
    }).catch((err) => {
        console.error(err)
        errorText.value = err.message
        errorShow.value = true
        loading.value = false
        refreshing.value = false
    })
    refreshing.value = false
    loading.value = false
    if (res) {
        if (res.code == 200) {
            thread.value = res.data.thread
            loadReply()
        } else {
            errorText.value = res.msg
            errorShow.value = true
        }
    } else {
        errorText.value = '加载失败'
        errorShow.value = true
    }
}

const replyFinished = ref(false)
const replyLoading = ref(false)
const replyError = ref(false)
const replyText = ref('')
const loadReply = async () => {
    const res = await getForumReplyListApi({
        thread_no: threadNo.value,
        skip: replies.value.length,
        limit: 10,
        showError: true,
    }).catch((err) => {
        console.error(err)
        replyError.value = true
        replyText.value = err.message
        replyLoading.value = false
    })
    replyLoading.value = false
    if (res) {
        if (res.code == 200) {
            if (res.data.list.length == 0) {
                replyFinished.value = true
            } else {
                replies.value.push(...res.data.list)
            }
        } else {
            replyError.value = true
            replyText.value = res.msg
        }
    } else {
        replyError.value = true
        replyText.value = '加载失败'
    }
}
const scrollToElement: Ref<HTMLElement | null> = ref(null);
const content = ref('')
const replyDisabled = ref(false)
const onReply = async () => {
    replyDisabled.value = true
    const res = await replyForumThreadApi({
        thread_no: threadNo.value,
        content: content.value,
    }).catch((err) => {
        console.error(err)
        replyDisabled.value = false
    })
    replyDisabled.value = false
    if (res) {
        showToast(res.msg)
        content.value = '';
        if (res.data.status == 'success') {

            replies.value.unshift(res.data)
            thread.value!.replies++
            refreshStore.addThread({
                action: 'update',
                id: threadNo.value,
                path: 'replies',
                value: thread.value?.replies
            })
            await nextTick();
            if (scrollToElement.value) {
                window.scrollTo({
                    top: scrollToElement.value.offsetTop - 100,
                    behavior: "smooth"
                });
            }
        }
    }


}
const refreshStore = useRefreshStore()
const liking = ref(false)
const onLike = async () => {
    if (liking.value) {
        return
    }
    liking.value = true
    const res = await likeForumThreadApi({
        thread_no: threadNo.value,
    }).catch((err) => {
        console.error(err)
        liking.value = false
    })
    liking.value = false
    if (res) {

        thread.value!.liked = res.data.result
        if (res.data.result) {
            thread.value!.likes++
        } else {
            thread.value!.likes--
        }
        if(thread.value!.likes<0){
            thread.value!.likes = 0
        }
        refreshStore.addThread({
            action: 'update',
            id: threadNo.value,
            path: 'likes',
            value: thread.value?.likes
        })
        refreshStore.addThread({
            action: 'update',
            id: threadNo.value,
            path: 'liked',
            value: thread.value!.liked
        })
    }
}

watch(() => route.params.thread_no as string, newValue => {
    if (newValue && newValue != threadNo.value) {
        threadNo.value = newValue
        onRefresh()
        //滚动到顶部
        window.scrollTo({
            top: 0,
        });

    }
}, {
    immediate: true
})
</script>

<template>
    <Error :text="errorText" :show="errorShow" />

    <Loading v-if="loading" mask />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height: 100vh" v-else-if="!errorShow">
        <NavBar title="详情" />
        <van-notice-bar text="该动态正在审核中，审核通过后他人方可查看" v-if="thread?.status == 'pending'" />
        <van-notice-bar text="该动态已被封禁，他人无法查看" v-else-if="thread?.status == 'ban'" />
        <van-notice-bar text="该动态审核失败，他人无法查看" v-else-if="thread?.status == 'fail'" />

        <ThreadItem :thread="thread" @like="onLike" />

        <div ref="scrollToElement"></div>
        <van-list :loading="replyLoading" :finished="replyFinished" finished-text="没有更多回复了" @load="loadReply"
            :error="replyError" :error-text="replyText" :immediate-check="false">
            <ThreadItem v-for="item in replies" :key="item.thread_no" :thread="item" />
        </van-list>
        <div class="ignore-nav-box"></div>
        <div class="nav-bar">
            <van-field v-model="content" center clearable placeholder="说点什么..." :disabled="replyDisabled" maxlength="200">
                <template #button>
                    <van-button size="small" type="primary" class="ignore-theme-btn action" @click="onReply"
                        :disabled="content.length == 0" :loading="replyDisabled">发送</van-button>
                </template>
            </van-field>
        </div>

    </van-pull-refresh>
</template>
<style scoped lang="less">
.nav-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    width: 730px;
    padding: 0 10px;
    box-shadow: 0 -1px 5px 0 rgba(0, 0, 0, 0.1);
    background-color: var(--theme-bar);
}

.ignore-nav-box {
    height: calc(var(--van-cell-vertical-padding) * 2 + 50px)
}
</style>
