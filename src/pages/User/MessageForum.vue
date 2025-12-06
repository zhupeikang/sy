<script setup lang="ts" name="UserMessageForum">
import NavBar from '@/components/NavBar.vue';
import MessageList from './components/MessageList.vue';
</script>
<template>
    <NavBar title="社区消息" />
    <MessageList cate="forum" class="margin-top"/>
</template>