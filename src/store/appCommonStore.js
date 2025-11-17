import { defineStore } from "pinia";
import EventBus from "../common/EventBus";

export const useAppCommonStore = defineStore("appCommon", {
  state: () => ({
    coverMaskShow: false,
  }),
  getters: {},
  actions: {
    toggleCoverMask() {
      this.coverMaskShow = !this.coverMaskShow;
    },
  },
});
