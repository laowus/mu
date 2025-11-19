<script setup>
import EventBus from "./common/EventBus";
import { QQ } from "./vendor/qq.js";
import { Track } from "./common/Track";
import { usePlayStore } from "./store/playStore";
import { useAppCommonStore } from "./store/appCommonStore";
import { storeToRefs } from "pinia";

const { currentTrack, queueTracksSize } = storeToRefs(usePlayStore());
const { playNextTrack, setAutoPlaying, playTrackDirectly, isCurrentTrack, removeTrack, updateCurrentTime } = usePlayStore();

const { showFailToast } = useAppCommonStore();

//处理不可播放歌曲
const AUTO_PLAY_NEXT_MSG = "当前歌曲无法播放<br>即将为您播放下一曲";
const NO_NEXT_MSG = "当前歌曲无法播放<br>且列表已无其他歌曲";
const TOO_FAST_MSG = "尝试播放次数太多<br>请手动播放其他歌曲吧";

//处理无法播放的歌曲
const handleUnplayableTrack = (track) => {
  const queueSize = queueTracksSize.value;
  console.log("无法播放的歌曲:", track);
  // 可以在这里添加处理逻辑，比如显示提示信息
  //提示并播放下一曲
  const toastAndPlayNext = () => {
    //前提条件：必须是当前歌曲
    if (isCurrentTrack(track)) {
      showFailToast(AUTO_PLAY_NEXT_MSG, () => {
        if (isCurrentTrack(track)) playNextTrack();
      });
    }
  };
  if (queueSize < 2) {
    //非电台歌曲，且没有下一曲
    showFailToast(NO_NEXT_MSG);
    return;
  }
  //普通歌曲
  //频繁切换下一曲，体验不好，对音乐平台也不友好
  if (autoSkipCnt < 9) {
    ++autoSkipCnt;
    toastAndPlayNext();
    return;
  }
  //10连跳啦，暂停一下吧
  resetAutoSkip();
  showFailToast(TOO_FAST_MSG);
};

/* 播放歌单 */
const tryPlayPlaylist = async (playlist, text, traceId) => {
  try {
    //playPlaylist(playlist, text, traceId);
  } catch (error) {
    console.log(error);
    //if (traceId && !isCurrentTraceId(traceId)) return;
    showFailToast("网络异常！请稍候重试");
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
    if (!Track.hasUrl(track)) {
      removeTrack(track);
      reject("noUrl");
      return;
    }
    setAutoPlaying(false);
    resolve(track);
  });
};

//歌单
EventBus.on("playlist-play", ({ playlist, text, traceId }) => tryPlayPlaylist(playlist, text, traceId));
//连跳计数器
let autoSkipCnt = 0;
//重置连跳计数
const resetAutoSkip = () => (autoSkipCnt = 0);

/* 记录最近播放 */
//歌曲、电台

EventBus.on("track-play", (track) => {
  resetAutoSkip();
});
//普通歌曲
// 加载歌曲
EventBus.on("track-changed", (track) => {
  bootstrapTrack(track).then(
    //获取url
    (track) => {
      if (isCurrentTrack(track)) playTrackDirectly(track);
    },
    (reason) => {
      if (reason == "noUrl") handleUnplayableTrack(track);
    },
  );
});
EventBus.on("track-pos", (secs) => {
  updateCurrentTime(secs);
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
