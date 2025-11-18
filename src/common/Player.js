import { Howl, Howler } from "howler";
import { PLAY_STATE } from "../common/Constants";
import EventBus from "../common/EventBus";
import { Track } from "./Track";
import { WebAudioApi } from "./WebAudioApi";
import { fetch } from "@tauri-apps/plugin-http";
import { readFile, writeFile, mkdir } from "@tauri-apps/plugin-fs";
import { appCacheDir, join } from "@tauri-apps/api/path";

let singleton = null;

//追求简洁、组合式API、单一责任
export class Player {
  constructor(track) {
    this.currentTrack = track;
    this.sound = null;
    this.retry = 0;
    this.webAudioApi = null;
  }

  static get() {
    if (!singleton) singleton = new Player();
    return singleton;
  }

  /* 初始化并配置播放器 */
  static initAndSetup() {
    const player = Player.get();
    return player
      .on("track-play", (track) => player.playTrack(track))
      .on("suspend", () => player.pause())
      .on("track-restore", (track) => player.restore(track))
      .on("track-changed", () => {
        console.log("Player.js=> track-changed");
        player.setCurrent(null);
      })
      .on("track-togglePlay", () => player.togglePlay())
      .on("track-seek", (percent) => player.seek(percent))
      .on("volume-set", (volume) => player.volume(volume))
      .on("radio-play", () => player.setCurrent(null))
      .on("playbackQueue-empty", () => player.setCurrent(null))
      .on("track-updateEQ", (values) => player.updateEQ(values));
  }

  async loadAndPlayAudio() {
    try {
      // 创建缓存目录
      const cacheDir = await join(await appCacheDir(), "audio_cache");
      try {
        await mkdir(cacheDir, { recursive: true });
      } catch (e) {
        // 目录可能已存在，忽略错误
        console.log("Directory might already exist or error creating:", e);
      }

      // 生成缓存文件名
      const filename = `${this.currentTrack.id}.mp3`;
      const filePath = await join(cacheDir, filename);

      let audioData;
      try {
        // 尝试读取缓存文件
        audioData = await readFile(filePath);
      } catch (e) {
        // 缓存不存在，下载文件
        console.log("Cache miss, downloading:", this.currentTrack.url);
        const response = await fetch(this.currentTrack.url);
        const arrayBuffer = await response.arrayBuffer();
        audioData = new Uint8Array(arrayBuffer);

        // 写入缓存文件
        await writeFile(filePath, audioData);
      }

      // 创建Blob URL
      const blob = new Blob([audioData], { type: "audio/mpeg" });
      const blobUrl = URL.createObjectURL(blob);

      // 定义self变量以在事件处理函数中使用
      let self = this;

      // 创建Howl实例
      this.sound = new Howl({
        src: [blobUrl],
        html5: true,
        autoplay: false,
        preload: false,
        crossOrigin: "anonymous",
        onplay: function () {
          self.retry = 0;
          requestAnimationFrame(self.__step.bind(self));
          self.notifyStateChanged(PLAY_STATE.PLAYING);
        },
        onpause: function () {
          self.notifyStateChanged(PLAY_STATE.PAUSE);
        },
        onend: function () {
          self.notifyStateChanged(PLAY_STATE.END);
        },
        onseek: function () {
          requestAnimationFrame(self.__step.bind(self));
        },
        onloaderror: function () {
          self.retryPlay(1);
        },
        onplayerror: function () {
          self.retryPlay(1);
        },
      });
      this.tryUnlockHowlAudios();
    } catch (error) {
      console.error("Failed to load audio:", error);
      this.retryPlay(1);
    }
  }

  // 修改createSound方法以使用新的加载方式
  createSound() {
    if (!Track.hasUrl(this.currentTrack)) return null;
    let self = this;
    //释放资源
    if (this.sound) this.sound.unload();

    this.loadAndPlayAudio();
    return null;
  }

  getSound() {
    return Track.hasUrl(this.currentTrack) ? this.sound : null;
  }

  // 修改play方法以适应异步加载
  play() {
    // 如果sound还未加载完成，等待加载
    if (!this.sound) {
      setTimeout(() => this.play(), 100);
      return;
    }
    this.sound.play();
  }

  //暂停
  pause() {
    const sound = this.getSound();
    if (sound) sound.pause();
  }

  togglePlay() {
    const sound = this.getSound();
    if (!sound) {
      this.retryPlay(1);
      return;
    }
    if (sound.playing()) {
      sound.pause();
    } else {
      sound.play();
    }
  }

  //暂停
  stop() {
    const sound = this.getSound();
    if (sound) sound.stop();
  }

  setCurrent(track) {
    console.log("setCurrent", track);
    this.stop();
    this.currentTrack = track;
    this.createSound();
  }

  playTrack(track) {
    console.log("playTrack", track);
    this.setCurrent(track);
    this.play();
  }

  restore(track) {
    this.setCurrent(track);
    //this.createSound()
  }

  volume(value) {
    Howler.volume(value);
  }

  seek(percent) {
    const sound = this.getSound();
    if (!sound || !sound.playing()) return;
    sound.seek(sound.duration() * percent);
  }

  __step() {
    const sound = this.getSound();
    if (!sound) return;
    if (!sound.playing()) return;
    const seek = sound.seek() || 0;
    EventBus.emit("track-pos", seek);
    try {
      this.resolveSound();
    } catch (error) {
      console.log(error);
      this.retryPlay(1);
    }
    requestAnimationFrame(this.__step.bind(this));
  }

  on(event, handler) {
    EventBus.on(event, handler);
    return this;
  }

  notifyStateChanged(state) {
    EventBus.emit("track-state", state);
  }

  notifyError(isRetry) {
    EventBus.emit("track-error", isRetry ? this.currentTrack : null);
  }

  retryPlay(times) {
    this.notifyError(this.retry < times);
    ++this.retry;
  }

  createWebAudioApi() {
    if (this.webAudioApi) return;
    const audioCtx = Howler.ctx;
    if (!audioCtx) return;
    const audioNode = this.sound._sounds[0]._node;
    if (!audioNode) return;
    this.webAudioApi = WebAudioApi.create(audioCtx, audioNode);
  }

  resolveSound() {
    this.createWebAudioApi();
    if (!this.webAudioApi) return;
    const analyser = this.webAudioApi.getAnalyser();
    const freqData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqData);
    EventBus.emit("track-freqUnit8Data", freqData);
  }

  tryUnlockHowlAudios() {
    try {
      const audios = Howler._html5AudioPool;
      if (Array.isArray(audios)) {
        audios.forEach((audio) => {
          if (audio) audio.crossOrigin = "anonymous";
        });
      }
    } catch (error) {
      console.warn("Failed to unlock Howl audios:", error);
    }
  }

  updateEQ(values) {
    if (this.webAudioApi) this.webAudioApi.updateEQ(values);
  }
}
