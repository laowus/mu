<script setup>
import { onMounted, reactive, ref } from "vue";
import PlaylistCategoryBar from "../components/PlaylistCategoryBar.vue";
import { QQ } from "../vendor/qq.js";
import EventBus from "../common/EventBus.js";
import { usePlaylistSquareStore } from "../store/playlistSquareStore";

const { currentPlatformCategories, putCategories } = usePlaylistSquareStore();
//全部分类
const categories = reactive([]);
const isLoadingCategories = ref(true);

const setLoadingCategories = (value) => {
  isLoadingCategories.value = value;
};

const loadCategories = async () => {
  setLoadingCategories(true);
  categories.length = 0;
  let cachedCates = currentPlatformCategories();
  if (!cachedCates) {
    QQ.categories().then((result) => {
      console.log("QQ categories:", result);
      if (!result) return;
      putCategories("qq", result.data);
      categories.push(result.data);
      setLoadingCategories(false);
      EventBus.emit("playlistCategory-update");
    });
  } else {
    categories.push(...cachedCates);
    setLoadingCategories(false);
    EventBus.emit("playlistCategory-update");
  }
};

onMounted(() => {
  loadCategories();
});

const refreshData = () => {
  loadCategories();
};

EventBus.on("playlistSquare-refresh", refreshData);
</script>
<template>
  <div class="playlist-square-view">
    <PlaylistCategoryBar :data="categories" :loading="isLoadingCategories"></PlaylistCategoryBar>
  </div>
</template>

<style>
.playlist-square-view {
  padding: 25px 33px 15px 33px;
  overflow: auto;
}
</style>
