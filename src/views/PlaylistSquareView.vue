<script setup>
// 导入Vue相关的响应式API和生命周期钩子
import { onMounted, reactive, ref } from "vue";
// 导入播放列表分类栏组件
import PlaylistCategoryBar from "../components/PlaylistCategoryBar.vue";
// 导入QQ音乐API模块
import { QQ } from "../vendor/qq.js";
// 导入事件总线，用于组件间通信
import EventBus from "../common/EventBus.js";
// 导入播放列表广场的状态管理store
import { usePlaylistSquareStore } from "../store/playlistSquareStore";

// 从store中解构出获取当前平台分类和存储分类的方法
const { currentPlatformCategories, putCategories } = usePlaylistSquareStore();

// 响应式数组，用于存储全部分类数据
const categories = reactive([]);
// 响应式引用，用于控制分类加载状态
const isLoadingCategories = ref(true);

/**
 * 设置分类加载状态
 * @param {boolean} value - 加载状态值
 */
const setLoadingCategories = (value) => {
  // 更新加载状态
  isLoadingCategories.value = value;
};

/**
 * 加载分类数据
 * 优先从缓存获取，如果缓存不存在则从网络获取并缓存
 */
const loadCategories = async () => {
  // 设置为加载中状态
  setLoadingCategories(true);
  // 清空现有分类数据
  categories.length = 0;

  // 尝试从store获取缓存的分类数据
  let cachedCates = currentPlatformCategories();

  // 如果缓存不存在，则从网络获取数据，并缓存到本地
  if (!cachedCates) {
    // 异步调用QQ音乐API获取分类数据
    const result = await QQ.categories();

    // 数据不存在则直接返回
    if (!result) return;

    // 提取返回结果中的数据部分
    cachedCates = result.data;
    console.log("cachedCates:", cachedCates);

    // 数据部分不存在则直接返回
    if (!cachedCates) return;

    // 将获取到的分类数据缓存到store中
    putCategories("qq", result.data);
  }

  // 将分类数据添加到响应式数组中
  categories.push(...cachedCates);

  // 触发分类更新事件，通知子组件数据已更新
  EventBus.emit("playlistCategory-update");

  // 设置为加载完成状态
  setLoadingCategories(false);
};

// 组件挂载完成后加载分类数据
onMounted(() => {
  loadCategories();
});

/**
 * 刷新内容的方法
 * 当收到刷新事件时执行
 */
const refreshData = () => {
  console.log("loadContent");
};

// 监听播放列表刷新事件
EventBus.on("playlistSquare-refresh", refreshData);
</script>

<template>
  <!-- 播放列表广场视图容器 -->
  <div class="playlist-square-view">
    <!-- 播放列表分类栏组件 -->
    <!-- 传递分类数据和加载状态给子组件 -->
    <PlaylistCategoryBar :data="categories" :loading="isLoadingCategories"></PlaylistCategoryBar>
  </div>
</template>

<style>
/* 播放列表广场视图样式 */
.playlist-square-view {
  padding: 25px 33px 15px 33px; /* 上下左右内边距 */
  overflow: auto; /* 内容溢出时显示滚动条 */
}
</style>
