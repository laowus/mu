import { defineStore } from "pinia";

export const usePlaylistSquareStore = defineStore("playlistSquare", {
  state: () => ({
    //保存当前选中的分类项
    categoriesMap: new Map(),
    currentCategoryItem: {
      data: { key: "默认", value: "" },
      row: 0,
      col: 0,
    },
    ordersMap: new Map(),
    currentOrder: {
      key: null,
      value: null,
      index: 0,
    },
  }),
  getters: {
    currentPlatformCode(state) {
      return "qq";
    },
    //获取当前平台的分类项
    currentCategoryCode(state) {
      return state.currentCategoryItem.data.value;
    },
  },
  actions: {
    putCategories(key, value) {
      this.categoriesMap.set(key, value);
    },
    putCurrentPlatformCategories(value) {
      this.putCategory("qq", value);
    },
    getCategories(key) {
      return this.categoriesMap.get(key);
    },
    currentPlatformCategories() {
      return this.getCategories("qq");
    },
    updateCurrentCategoryItem(data, row, col) {
      this.currentCategoryItem.data = data;
      this.currentCategoryItem.row = row;
      this.currentCategoryItem.col = col;
    },
  },
});
