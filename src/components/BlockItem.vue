<template>
    <div class="item van-hairline--surround" :style="{ flexBasis: props.size + 'px', }">
        <div class="cover" :style="{
            backgroundImage: `url(${props.image})`,
            width: props.size + 'px',
            height: props.size + 'px',
        }">

        </div>
        <div class="info">
            <div class="van-ellipsis subject" :style="`text-align:${props.textAlign}`">{{ props.name }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps({
    name: {
        type: String,
        required: true,
    }, image: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: () => 330
    },
    textAlign: {
        type: String,
        default: 'left'
    }
})

</script>
<style lang="less" scoped>
.item {
    background: #fff;
    cursor: pointer;

    .cover {
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        position: relative;
    }

    .info {
        padding: var(--padding-box);

        .subject {
            font-size: var(--size-info);
        }

    }
}
</style>