<script setup lang="ts">
import { getForumThreadListApi, likeForumThreadApi } from '@/api/forum';
import Thread from '@/components/Thread.vue';
import { useRefreshStore } from '@/store/Refresh';
import { ThreadType } from '@/types';
import { track } from '@/utils';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const refreshStore = useRefreshStore()
const router = useRouter()
const props = defineProps({
    type: {
        type: String,
        required: true
    }
})


const list = ref<ThreadType[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const error = ref(false)
const errorText = ref('')

const limit = 10
watch(() => refreshStore.thread[props.type as 'recommend' | 'new' | 'official'], newValue => {
    if (list.value.length > 0 || finished.value) {
        if (newValue.length > 0) {
            const actions = [...newValue]
            actions.forEach(item => {
                if (item.action == 'add') {
                    getForumThreadListApi({
                        type: props.type,
                        skip: 0,
                        limit:1,
                        showError: true,
                        thread_no: item.id
                    })
                        .then(res => {
                            if (res.code == 200) {
                                list.value.unshift(res.data.list[0])
                            }
                        })
                } else if (item.action == 'update') {
                    const index = list.value.findIndex(i => i.thread_no == item.id)
                    if (index != -1) {
                        list.value[index][item.path as 'likes'] = item.value
                    }
                } else if (item.action == 'delete') {
                    const index = list.value.findIndex(i => i.thread_no == item.id)
                    if (index != -1) {
                        list.value.splice(index, 1)
                    }
                }
            })

            refreshStore.thread[props.type as 'recommend' | 'new' | 'official'].splice(0)
        }

    }
}, {
    deep: true
})
const onLoad = () => {
    refreshStore.thread[props.type as 'recommend' | 'new' | 'official'].splice(0)
    if (loading.value) return
    loading.value = true
    getForumThreadListApi({
        type: props.type,
        skip: list.value.length,
        limit,
        showError: true
    })
        .then(res => {
            if (res.code != 200) {
                error.value = true
                errorText.value = res.msg
                return
            }
            if (res.data.list.length < limit) {
                finished.value = true
            }
            if (res.data.list.length > 0) {
                list.value = list.value.concat(res.data.list)
            }
        })
        .catch(err => {
            error.value = true
            errorText.value = err.message
        })
        .finally(() => {
            loading.value = false
            refreshing.value = false
        })
};

const onRefresh = () => {
    // 清空列表数据
    finished.value = false;
    error.value = false
    errorText.value = ''
    // 重新加载数据
    list.value = []
    onLoad();
};
onLoad()
const liking = ref('')
const onLike = async (item: ThreadType) => {
    if (liking.value) {
        return
    }
    liking.value = item.thread_no
    const res = await likeForumThreadApi({
        thread_no: item.thread_no
    }).catch((err) => {
        console.error(err)
        liking.value = ''
    })
    liking.value = ''
    if (res) {

        item.liked = res.data.result
        if (res.data.result) {
            item.likes++
        } else {
            item.likes--
        }
        if(item.likes<0){
            item.likes = 0
        }
    }
}
const toThread = (item: ThreadType) => {
    track('forum', {
        action:'post'
    })
    router.push('/thread/' + item.thread_no)
}
</script>
<template>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error="error"
            :error-text="errorText">
            <Thread v-for="item in list" :key="item.thread_no" :thread="item" @like="onLike(item)"
                @click="toThread(item)" @reply="router.push('/thread/' + item.thread_no)"
                simple />
        </van-list>
    </van-pull-refresh>
</template>
