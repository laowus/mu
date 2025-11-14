<script setup>
import {
  onActivated,
  onDeactivated,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { QQ } from "./vendor/qq.js";
import PlaylistCategoryBar from "./components/PlaylistCategoryBar.vue";
import EventBus from "./common/EventBus.js";

//全部分类
const categories = reactive([]);
const isLoadingCategories = ref(true);

const setLoadingCategories = (value) => {
  isLoadingCategories.value = value;
};

const loadCategories = async () => {
  setLoadingCategories(true);
  categories.length = 0;
  try {
    const result = await QQ.categories();
    console.log("QQ categories:", result);
    if (!result) return;
    categories.push(result.data);
    setLoadingCategories(false);
    EventBus.emit("playlistCategory-update");
  } catch (err) {
    console.error("Error invoking Tauri command:", err);
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
    <PlaylistCategoryBar
      :data="categories"
      :loading="isLoadingCategories"
    ></PlaylistCategoryBar>
  </div>
</template>
<style scoped>
.playlist-square-view {
  padding: 25px 33px 15px 33px;
  overflow: scroll;
}
</style>
