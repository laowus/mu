<script setup>
import { storeToRefs } from "pinia";
import { watch } from "vue";
import CssReset from "./CssReset.vue";
import CssCommon from "./CssCommon.vue";
import { useSettingStore } from "./store/settingStore.js";

const { theme } = storeToRefs(useSettingStore());
const { getCurrentThemeId } = useSettingStore();

//设置主题
const setupAppTheme = (themeId) => {
  themeId = themeId || getCurrentThemeId() || "dark";
  themeId = themeId.trim();
  document.documentElement.setAttribute("theme", themeId);
};
//直接在setup()时执行，不需要等待其他生命周期
setupAppTheme(getCurrentThemeId());

watch(theme, () => setupAppTheme(), { deep: true });
</script>
<template>
  <CssReset></CssReset>
  <CssCommon></CssCommon>
  <slot></slot>
</template>

<style>
:root {
  --text-font-family: system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Helvetica, "Microsoft YaHei", 微软雅黑, Arial, sans-serif;
  --text-size: 15px;
  --text-sub-size: 14px;
  --tab-title-text-size: 17px;
  --app-bg: transparent;
  font-family: var(--text-font-family);
}

:root[theme="dark"] {
  /* 全局背景 */
  --bg-color: #313131;
  --app-bg: var(--bg-color);
  /* 文本 */
  --text-color: #eaeaea;
  --text-sub-color: #989898;
  --text-subtitle-color: #666;
  --hl-color: #28c83f;
  --hl-text-bg: linear-gradient(to top right, #28c83f, #1ca388);
  --hl-title-color: var(--hl-color);
  /* 歌词文本颜色 */
  --text-lyric-color: #ccc;
  /* 按钮 */
  --svg-color: #eaeaea;
  --svg-hover-color: var(--hl-color);
  --svg-text-color: #eaeaea;
  --svg-btn-color: #fff;
  --btn-bg: linear-gradient(to right, #1ca388, #28c83f);
  --btn-hover-bg: linear-gradient(to top right, #2edfa3, #28c83f) !important;

  --toggle-btn-bg: #989898;
  --toggle-thumb-bg: #ccc;
  --toggle-btn-border-color: #ccc;
  --toggle-btn-active-bg: var(--hl-color);
  --toggle-active-thumb-bg: #fff;
  /* 进度条 */
  --progress-track-bg: linear-gradient(to right, #464646, #666) !important;
  --progress-bg: linear-gradient(to top right, #2edfa3, #28c83f);
  --slider-thumb-bg: var(--svg-color);
  /*滚动条*/
  --scrollbar-thumb-bg: #666;
  /* 列表项 hover */
  --list-item-hover: #464646 !important;
  --list-item-active-bg: var(--btn-bg);
  /* 边框 */
  --main-left-border-color: #181818;
  --ctx-menu-bg: #464646;
  --ctx-menu-border-color: #181818;
  --border-color: #363636;
  /* 设置页，每一分类栏底部分隔线颜色 */
  --setting-bottom-border-color: #363636;
  /* 当前播放列表 左侧边框高亮颜色 */
  --pbq-hl-text-color: var(--hl-text-bg);
  --pbq-hl-border: linear-gradient(to top right, #28c83f, #1ca388) 0 0 0 2;
  --pbq-box-shadow: 0px 0px 10px #161616;

  /* 搜索框 */
  --searchbar-bg: #fff;
  --search-btn-bg: var(--btn-hover-bg);
  --search-btn-svg-color: var(--svg-btn-color);
  --searchbar-text-color: #555;
  --searchbar-border-color: transparent;

  --search-btn-hover-bg: var(--btn-bg);
  --search-btn-hover-svg-color: var(--search-btn-svg-color);
  /* 通知消息 */
  --ntf-bg: var(--ctx-menu-bg);
  --ntf-text-color: var(--text-color);
  --ntf-border-color: var(--ctx-menu-border-color);
  /* 加载等待遮盖 */
  --loading-mask-bg: linear-gradient(90deg, #414141 8%, #515151 18%, #414141 33%);
  --error-color: red;

  --checkbox-bg: #fff;
  --logo-bg: var(--btn-bg);
  --logo-text-bg: #fff;
  --logo-text-color: #1ca388;

  --category-view-border: 0.5px solid var(--main-left-border-color);
  --input-bg: #464646;
  --input-text-color: var(--text-color);
  --input-border-color: var(--main-left-border-color);
  --input-border-color: #363636;
  --input-placeholder-color: #888;

  --back2top-btn-bg: var(--btn-hover-bg);
  --back2top-btn-svg-color: #fff;
  /* 音效 */
  --aeview-bg: #363636;
  --aeview-left-bg: #414141;
  --aeview-border: 1px solid var(--main-left-border-color);
  --aeview-list-item-bg: #3e3e3e;
  --aeview-list-item-color: var(--text-color);
}

:root[theme="white"] {
  /* 全局背景 */
  --bg-color: #fff;
  --app-bg: var(--bg-color);
  /* 文本 */
  --text-color: #212121;
  --text-sub-color: #666;
  --text-subtitle-color: #a0a0a0;
  --hl-color: #28c83f;
  --hl-color: #31c27c;
  --hl-text-bg: linear-gradient(to top right, #28c83f, #1ca388);
  --hl-title-color: var(--hl-color);
  /* 歌词文本颜色 */
  --text-lyric-color: #666;
  /* 按钮 */
  --svg-color: #414141;
  --svg-hover-color: var(--hl-color);
  --svg-text-color: #fff;
  --svg-btn-color: #fff;
  --btn-bg: linear-gradient(to right, #1ca388, #28c83f);
  --btn-hover-bg: linear-gradient(to top right, #2edfa3, #28c83f) !important;

  --toggle-btn-bg: #989898;
  --toggle-thumb-bg: #ccc;
  --toggle-btn-border-color: #ccc;
  --toggle-btn-active-bg: var(--hl-color);
  --toggle-active-thumb-bg: #fff;
  /* 进度条 */
  --progress-track-bg: linear-gradient(to right, #ccc, #ccc) !important;
  --progress-bg: linear-gradient(to top right, #1ca388, #28c83f);
  --slider-thumb-bg: var(--svg-color);
  /*滚动条*/
  --scrollbar-thumb-bg: #999;
  /* 列表项 hover */
  --list-item-hover: #eee !important;
  --list-item-active-bg: var(--btn-bg);
  /* 边框 */
  --main-left-border-color: #ddd;
  --ctx-menu-bg: var(--bg-color);
  --ctx-menu-border-color: #ababab;
  --border-color: #f4f4f4;
  /* 设置页，每一分类栏底部分隔线颜色 */
  --setting-bottom-border-color: #f8f8f8;
  /* 当前播放列表 左侧边框高亮颜色 */
  --pbq-hl-text-color: var(--hl-text-bg);
  --pbq-hl-border: linear-gradient(to top right, #28c83f, #1ca388) 0 0 0 2;
  --pbq-box-shadow: 0px 0px 10px #161616;

  /* 搜索框 */
  --searchbar-bg: #fff;
  --search-btn-bg: #fff;
  --search-btn-svg-color: var(--svg-color);
  --searchbar-text-color: #313131;
  --searchbar-border-color: #313131;

  --search-btn-hover-bg: var(--search-btn-bg);
  --search-btn-hover-svg-color: var(--hl-color);

  /* 通知消息 */
  --ntf-bg: var(--ctx-menu-bg);
  --ntf-text-color: var(--text-color);
  --ntf-border-color: var(--ctx-menu-border-color);
  /* 加载中遮盖 */
  --loading-mask-bg: linear-gradient(90deg, #eee 8%, #ddd 18%, #eee 33%);
  --error-color: red;

  --checkbox-bg: #fff;
  --logo-bg: var(--btn-bg);
  --logo-text-bg: #fff;
  --logo-text-color: #1ca388;

  --category-view-border: 0.5px solid var(--main-left-border-color);
  --input-bg: var(--bg-color);
  --input-text-color: var(--text-color);
  --input-border-color: var(--main-left-border-color);
  --input-placeholder-color: #888;

  --back2top-btn-bg: var(--btn-hover-bg);
  --back2top-btn-svg-color: #fff;

  /* 音效 */
  --aeview-bg: var(--bg-color);
  --aeview-left-bg: #eee;
  --aeview-border: 1px solid #eee;
  --aeview-list-item-bg: #f3f3f3;
  --aeview-list-item-color: var(--text-color);
}

:root[theme="light"] {
  /* 全局背景 */
  --bg-color: #fff;
  --app-bg: var(--bg-color);
  --main-left-bg: linear-gradient(to bottom, #e7cddb, #e7d2d1, #e7cde3);
  --main-left-bg: #e7e1e3cb;
  --main-center-bg: var(--bg-color);
  /* 文本 */
  --text-color: #313131;
  --text-sub-color: #666;
  --text-subtitle-color: #a0a0a0;
  --hl-color: #e7e1e3;
  --hl-color: #b7b1b3;
  --hl-color: #979193;
  --hl-text-bg: #414141;
  --hl-title-color: #888;
  /* 歌词文本颜色 */
  --text-lyric-color: #666;
  /* 按钮 */
  --svg-color: #676163;
  --svg-hover-color: #888;
  --svg-text-color: #414141;
  --svg-btn-color: #414141;
  --svg-text-btn-rbtn-border: 0.1px solid #d7d1d3;
  --btn-bg: #e7e1e3cb;
  --btn-hover-bg: #d7d1d3cb !important;

  --toggle-btn-bg: #ddd;
  --toggle-thumb-bg: var(--hl-color);
  --toggle-btn-border-color: #ccc;
  --toggle-btn-active-bg: var(--hl-color);
  --toggle-active-thumb-bg: #fff;
  /* 进度条 */
  --progress-track-bg: linear-gradient(to right, #faf4f6, #faf4f6) !important;
  --progress-track-bg: linear-gradient(to right, #e7e1e3cb, #e7e1e3cb) !important;
  --progress-bg: linear-gradient(to top right, #c7c1c3, #c7c1c3) !important;
  --slider-thumb-bg: var(--svg-color);

  /*滚动条*/
  --scrollbar-thumb-bg: #878183;
  /* 列表项 hover */
  --list-item-hover: #faf4f6 !important;
  --list-item-active-bg: #c7c1c3;
  /* 边框 */
  --main-left-border-color: #ddd;
  --ctx-menu-bg: var(--bg-color);
  --ctx-menu-border-color: #ababab;
  --border-color: #faf4f6;
  /* 设置页，每一分类栏底部分隔线颜色 */
  --setting-bottom-border-color: transparent;
  /* 当前播放列表 左侧边框高亮颜色 */
  --pbq-hl-text-color: var(--hl-text-bg);
  --pbq-hl-border: linear-gradient(to right, #676163, #e7e1e3) 0 0 0 2;
  --pbq-box-shadow: 0px 0px 10px #161616;

  /* 搜索框 */
  --searchbar-bg: #e7e1e3;
  --search-btn-bg: #e7e1e3;
  --search-btn-svg-color: var(--svg-color);
  --searchbar-text-color: var(--text-color);
  --searchbar-border-color: #e8e8e8;

  --search-btn-hover-bg: var(--search-btn-bg);
  --search-btn-hover-svg-color: var(--svg-hover-color);
  /* 通知消息 */
  --ntf-bg: var(--ctx-menu-bg);
  --ntf-bg: #e7e1e3;
  --ntf-text-color: var(--text-color);
  --ntf-border-color: var(--ctx-menu-border-color);
  /* 加载中遮盖 */
  --loading-mask-bg: linear-gradient(90deg, #eee 8%, #ddd 18%, #eee 33%);
  --error-color: red;

  --checkbox-bg: #fff;
  --logo-bg: #878183;
  --logo-text-bg: #fff;
  --logo-text-color: #878183;

  --category-view-border: 0.5px solid var(--main-left-border-color);
  --input-bg: var(--bg-color);
  --input-text-color: var(--text-color);
  --input-border-color: var(--main-left-border-color);
  --input-placeholder-color: #888;

  --back2top-btn-bg: var(--btn-hover-bg);
  --back2top-btn-svg-color: var(--svg-btn-color);

  /* 音效 */
  --aeview-bg: var(--bg-color);
  --aeview-left-bg: var(--main-left-bg);
  --aeview-border: 1px solid #eee;
  --aeview-list-item-bg: #f3f3f3;
  --aeview-list-item-color: var(--text-color);
}

:root[theme="pink"] {
  /* 全局背景 */
  --bg-color: #fff;
  --app-bg: var(--bg-color);
  /* 文本 */
  --text-color: #212121;
  --text-sub-color: #666;
  --text-subtitle-color: #a0a0a0;
  --hl-color: #e667af;
  --hl-color: #fc589c;
  --hl-text-bg: linear-gradient(to top right, #e667af, #e6399b);
  --hl-title-color: var(--hl-color);
  /* 歌词文本颜色 */
  --text-lyric-color: #666;
  /* 按钮 */
  --svg-color: #414141;
  --svg-hover-color: var(--hl-color);
  --svg-text-color: #fff;
  --svg-btn-color: #fff;
  --btn-bg: linear-gradient(to top right, #e6399b, #e667af);
  --btn-hover-bg: linear-gradient(to top right, #e6399b, #992667) !important;

  --toggle-btn-bg: #989898;
  --toggle-thumb-bg: #ccc;
  --toggle-btn-border-color: #ccc;
  --toggle-btn-active-bg: var(--hl-color);
  --toggle-active-thumb-bg: #fff;
  /* 进度条 */
  --progress-track-bg: linear-gradient(to right, #999, #ccc) !important;
  --progress-track-bg: linear-gradient(to right, #ccc, #ccc) !important;
  --progress-bg: linear-gradient(to top right, #e667af, #e6399b);
  --slider-thumb-bg: var(--svg-color);
  /*滚动条*/
  --scrollbar-thumb-bg: #999;
  /* 列表项 hover */
  --list-item-hover: #eee !important;
  --list-item-active-bg: var(--btn-bg);
  /* 边框 */
  --main-left-border-color: #ddd;
  --ctx-menu-bg: var(--bg-color);
  --ctx-menu-border-color: #ababab;
  --border-color: #f4f4f4;
  /* 设置页，每一分类栏底部分隔线颜色 */
  --setting-bottom-border-color: #f8f8f8;
  /* 当前播放列表 左侧边框高亮颜色 */
  --pbq-hl-text-color: var(--hl-text-bg);
  --pbq-hl-border: linear-gradient(to right, #e6399b, #e667af) 0 0 0 2;
  --pbq-box-shadow: 0px 0px 10px #161616;

  /* 搜索框 */
  --searchbar-bg: #e8e8e8;
  --search-btn-bg: #e8e8e8;
  --search-btn-svg-color: var(--svg-color);
  --searchbar-text-color: #313131;
  --searchbar-border-color: #e8e8e8;

  --search-btn-hover-bg: var(--search-btn-bg);
  --search-btn-hover-svg-color: var(--hl-color);
  /* 通知消息 */
  --ntf-bg: var(--ctx-menu-bg);
  --ntf-text-color: var(--text-color);
  --ntf-border-color: var(--ctx-menu-border-color);
  /* 加载中遮盖 */
  --loading-mask-bg: linear-gradient(90deg, #eee 8%, #ddd 18%, #eee 33%);
  --error-color: red;

  --checkbox-bg: #fff;
  --logo-bg: var(--btn-bg);
  --logo-text-bg: #fff;
  --logo-text-color: var(--hl-color);

  --category-view-border: 0.5px solid var(--main-left-border-color);
  --input-bg: var(--bg-color);
  --input-text-color: var(--text-color);
  --input-border-color: var(--main-left-border-color);
  --input-placeholder-color: #888;

  --back2top-btn-bg: var(--btn-hover-bg);
  --back2top-btn-svg-color: #fff;

  /* 音效 */
  --aeview-bg: var(--bg-color);
  --aeview-left-bg: #eee;
  --aeview-border: 1px solid #eee;
  --aeview-list-item-bg: #f3f3f3;
  --aeview-list-item-color: var(--text-color);
}

/*
svg {
    fill: var(--svg-color);
    cursor: pointer;
}

svg:hover {
    fill: var(--svg-hover-color);
}
*/

/* 滚动条 */
::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb-bg);
  border: 1px solid var(--scrollbar-thumb-bg);
  width: var(--scrollbar-width);
  height: 66px;
  border-radius: 8px;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-track-piece,
::-webkit-scrollbar-corner,
::-webkit-scrollbar-button,
::-webkit-resizer {
  background: transparent;
}

/*TODO 试验性CSS */
.loading-mask {
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: forwards;
  animation-timing-function: linear;
  background: var(--loading-mask-bg);
  background-size: 100% auto;
  height: 66px;
  position: relative;
}

@keyframes forwards {
  from {
    background-position: -360px 0;
  }

  to {
    background-position: 360px 0;
  }
}

@keyframes rotate {
  from {
    transform: rotateZ(0deg);
  }

  to {
    transform: rotateZ(360deg);
  }
}
</style>
