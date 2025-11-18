<script setup>
import EventBus from "./common/EventBus";
import { QQ } from "./vendor/qq.js";
import { Track } from "./common/Track";
import { usePlayStore } from "./store/playStore";
import { storeToRefs } from "pinia";
import { Lyric } from "./common/Lyric";

const { currentTrack, queueTracksSize } = storeToRefs(usePlayStore());
const { setAutoPlaying, playTrackDirectly, isCurrentTrack } = usePlayStore();

//处理无法播放的歌曲
const handleUnplayableTrack = (track) => {
  console.log("无法播放的歌曲:", track);
  // 可以在这里添加处理逻辑，比如显示提示信息
};

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

//获取和设置歌曲播放信息
const bootstrapTrack = (track) => {
  return new Promise(async (resolve, reject) => {
    if (!track) {
      reject();
      return;
    }
    const { id, platform, artistNotCompleted } = track;
    //播放相关数据
    const result = await QQ.playDetail(id, track);
    const { lyric, cover, artist, url } = result;
    //覆盖设置url，音乐平台可能有失效机制，即url只在允许的时间内有效，而非永久性url
    if (Track.hasUrl(result)) Object.assign(track, { url });

    setAutoPlaying(false);

    resolve(track);
  });
};

//歌单
EventBus.on("playlist-play", ({ playlist, text, traceId }) => tryPlayPlaylist(playlist, text, traceId));

//普通歌曲
// 加载歌曲
EventBus.on("track-changed", (track) => {
  bootstrapTrack(track).then(
    (track) => {
      if (isCurrentTrack(track)) playTrackDirectly(track);
    },
    (reason) => {
      if (reason == "noUrl") handleUnplayableTrack(track);
    },
  );
});
</script>
<template>
  <audio class="audio-node" crossOrigin="anonymous"></audio>
  <slot></slot>
</template>
<style>
.radio-holder {
  visibility: hidden;
}
</style>
