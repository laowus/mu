<script setup>
import EventBus from "../common/EventBus";

/* 播放歌单 */
const tryPlayPlaylist = async (playlist, text, traceId) => {
  try {
    //playPlaylist(playlist, text, traceId);
  } catch (error) {
    console.log(error);
    // if (traceId && !isCurrentTraceId(traceId)) return;
    // showFailToast("网络异常！请稍候重试");
    return;
  }
};

//歌单
EventBus.on("playlist-play", ({ playlist, text, traceId }) => tryPlayPlaylist(playlist, text, traceId));
</script>
<template>
  <slot></slot>
</template>
<style>
.radio-holder {
  visibility: hidden;
}
</style>
