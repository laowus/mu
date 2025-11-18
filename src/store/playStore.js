import { defineStore } from "pinia";
import { PLAY_MODE } from "../common/Constants";
import EventBus from "../common/EventBus";
import { Track } from "../common/Track";
import { toMmss } from "../common/Times";

const NO_TRACK = new Track("0", "", "听你想听，爱你所爱", [{ id: "0", name: "不枉青春" }], { id: "0", name: "山川湖海，日月星辰" }, 0, "default_cover.png");

export const usePlayStore = defineStore("play", {
  state: () => ({
    //是否正在播放
    playing: false,
    //当前播放的歌曲索引
    playingIndex: -1,
    //当前播放模式
    playMode: PLAY_MODE.REPEAT_ALL,
    //播放队列
    queueTracks: [],
    //单位: ms
    currentTime: 0,
    //0.0 - 1.0
    progress: 0.0,
    //0.0 - 1.0
    volume: 0.5,
    //是否正在自动下一曲
    isAutoPlaying: false,
  }),
  getters: {
    currentTrack(state) {
      if (this.playingIndex < 0) return NO_TRACK;
      return this.track(this.playingIndex);
    },
    //获取播放队列中的歌曲
    track(state) {
      return (index) => {
        return state.queueTracks[index];
      };
    },
    noTrack() {
      return NO_TRACK;
    },
    mmssCurrentTime() {
      return toMmss(this.currentTime);
    },
    queueTracksSize(state) {
      return state.queueTracks.length;
    },
    hasLyric(state) {
      const track = state.currentTrack;
      if (!track) return false;
      const lyric = track.lyric;
      if (!lyric) return false;
      return lyric.data.size > 0;
    },
  },
  actions: {
    findIndex(track) {
      return this.queueTracks.findIndex((item, index) => Track.isEquals(track, item));
    },
    isCurrentTrack(track) {
      return Track.isEquals(this.currentTrack, track);
    },
    isPlaying() {
      return this.playing;
    },
    setPlaying(value) {
      this.playing = value;
    },
    //添加歌曲到播放队列
    addTrack(track) {
      const index = this.findIndex(track);
      if (index == -1) this.queueTracks.push(track);
    },
    addTracks(tracks) {
      if (tracks.length < 1) return;
      tracks.forEach((item) => this.addTrack(item));
    },
    __resetPlayState() {
      this.playing = false;
      this.currentTime = 0;
      this.progress = 0.0;
    },
    //直接播放，其他状态一概不管
    playTrackDirectly(track) {
      console.log("playTrackDirectly", track);
      this.__resetPlayState();
      let playEventName = "track-play";
      if (!Track.hasUrl(track)) {
        playEventName = "track-changed";
      }
      EventBus.emit(playEventName, track);
    },
    playTrack(track) {
      console.log("playTrack", track);
      //去列表中查找是否存在列表中
      let index = this.findIndex(track);
      // 没有找到, 则添加到播放队列中
      if (index == -1) {
        //当前播放的下一首
        index = this.playingIndex + 1;
        // 从index 插入track
        this.queueTracks.splice(index, 0, track);
      }
      this.playingIndex = index;
      this.playTrackDirectly(track);
    },

    updateVolume(value) {
      value = parseFloat(value);
      value = value > 0 ? value : 0;
      value = value < 1 ? value : 1;
      this.volume = value;
      EventBus.emit("volume-set", value);
    },
    updateVolumeByOffset(value) {
      value = parseFloat(value);
      this.updateVolume(this.volume + value);
    },

    setAutoPlaying(value) {
      this.isAutoPlaying = value;
    },
  },
});
