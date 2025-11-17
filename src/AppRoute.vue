<script setup>
import { provide } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

/* 全局Router设置  */
const router = useRouter();

provide("appRoute", {
  visitPlaylist: (platform, id) => {
    router.push(`/playlist/${platform}/${id}`);
  },
  visitSearch: (keyword) => visitRoute(`/search/${keyword}`),
  backward: () => router.back(),
  forward: () => router.forward(),
  visitAlbum: ({ platform, id, callback }) => {
    visitAlbumDetail(platform, id, callback);
  },
});
</script>
<template>
  <slot></slot>
</template>

<style scoped></style>
