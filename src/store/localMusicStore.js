import { defineStore } from "pinia";
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
    async addFolders() {},
    async addFiles() {},
    removeItem(index) {},
    resetAll() {
      this.localDirs.length = 0;
      this.localTracks.length = 0;
    },
  },
});
