import { defineStore } from "pinia";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { join, appDataDir } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";
import { Track } from "../common/Track";

export const useLocalMusicStore = defineStore("localMusic", {
  state: () => ({
    localDirs: [],
    localTracks: [],
    isLoading: false,
  }),
  getters: {
    getLocalSongs() {
      return this.localTracks;
    },
  },
  actions: {
    async addFolders() {
      console.log("添加本地文件夹");
      this.isLoading = true;
      // 打开一个文件夹选择框
      const selected = await openDialog({
        title: "选择音乐文件夹",
        multiple: false,
        directory: true,
      });

      if (!selected) {
        this.isLoading = false;
        return; // 用户取消了选择
      }

      try {
        // 检查是否已添加此文件夹
        if (!this.localDirs.includes(selected)) {
          this.localDirs.push(selected);
        }

        // 获取文件夹中的音频文件
        await this.scanAudioFiles(selected);
      } catch (error) {
        console.error("扫描音频文件失败:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getAudioMetadata(fullPath) {
      try {
        return await invoke("get_audio_metadata", { fullPath: fullPath });
      } catch (error) {
        console.error(`获取音频元数据失败: ${error}`);
        return null;
      }
    },
    async scanAudioFiles(directory) {
      try {
        const entries = await readDir(directory, { recursive: true });
        const audioExtensions = ["mp3", "wav", "flac", "aac", "m4a"];
        for (const entry of entries) {
          const fullPath = await join(directory, entry.name);
          if (entry.isDirectory) {
            // 递归处理子目录
            await this.scanAudioFiles(fullPath);
          } else if (entry.isFile) {
            const fileName = entry.name;
            const fileExt = fileName.split(".").pop()?.toLowerCase();
            if (fileExt && audioExtensions.includes(fileExt)) {
              console.log("完整文件路径:", fullPath);

              const metadata = await this.getAudioMetadata(fullPath);
              console.log("metadata", metadata);
              if (metadata) {
                // 使用元数据创建Track对象
                const track = new Track({
                  id: fullPath,
                  name: metadata.title !== "未知标题" ? metadata.title : fileName,
                  artist: metadata.artist,
                  album: metadata.album,
                  duration: metadata.duration,
                  url: fullPath,
                  source: "local",
                });

                if (!this.localTracks.some((t) => t.id === track.id)) {
                  this.localTracks.push(track);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`扫描目录 ${directory} 失败:`, error);
      }
    },
    async addFiles() {},
    removeItem(index) {},
    resetAll() {
      this.localDirs.length = 0;
      this.localTracks.length = 0;
    },
  },
});
