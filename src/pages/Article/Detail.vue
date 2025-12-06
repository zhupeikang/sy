<script setup lang="ts" name="ArticleDetail">
import NavBar from '@/components/NavBar.vue';
import { ArticleType } from '@/types';
import { nextTick, ref, watch } from 'vue';
import { showLoading, toDatetime } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import { getArticleDetailApi } from '@/api/article';
import { useDictStore } from '@/store/Dict';

const item = ref<ArticleType>()
const route = useRoute()
const router = useRouter()
const dictStore = useDictStore()
watch(() => route.params.article_no, async (newValue) => {
    if (!newValue) {
        item.value = undefined
        return
    }
    console.log(newValue)
    const loading = showLoading()
    const res = await getArticleDetailApi({
        article_no: newValue
    })
    if (res) {
        loading.end()
        if (res.data.type == 'link') {
            window.location.href = res.data.url as string
        } else if (res.data.type == 'push') {
            router.push(res.data.url as string)
        } else {
            item.value = res.data
        }
    }


}, {
    immediate: true
})
watch(() => item.value?.content, async(newValue, oldValue) => {
    if (newValue) {
        await nextTick()
        const imgs = document.querySelectorAll("img[data-href]");
        console.log('imgs',imgs)
        imgs.forEach(img => {
            img.addEventListener("click", () => {
                const dataHref = img.getAttribute("data-href");
                if (dataHref) {
                    window.location.href = dataHref;
                }
            });
        });
    }
});
</script>
<template>
    <div v-if="item">
        <NavBar :title="item.type == 'single' ? item.subject : dictStore.getDictLabel('article_cate', item.type)" />
        <div class="subject" v-if="item.type != 'single'">{{ item.subject }}</div>
        <div class="time" v-if="item.type == 'article'">{{ toDatetime(item.publish_at) }}</div>
        <div :class="'main ' + item.type" v-html="item.content" class="html"></div>
    </div>
</template>
<style lang="less" scoped>
.subject {
    font-size: var(--size-subject);
    text-align: center;
    padding: 20px;
}

.time {
    font-size: var(--size-info);
    text-align: center;
    color: var(--gray);
}

.main {
    :deep(img) {
        max-width: 750px;
    }
}

.main.article {
    padding: var(--padding);
}

.html {
    :deep(img[data-href]) {
        cursor: pointer;
    }
}
</style>
