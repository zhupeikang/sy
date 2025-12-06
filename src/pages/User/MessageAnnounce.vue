<script setup lang="ts" name="UserMessageAnnounce">
import NavBar from '@/components/NavBar.vue';
import MessageList from './components/MessageList.vue';
</script>
<template>
    <NavBar title="官方公告" />
    <MessageList cate="announce" class="margin-top" />
</template>