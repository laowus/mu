<script setup>
import { inject, onActivated, onMounted, ref, toRaw, watch } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { useSettingStore } from "../store/settingStore";
import { storeToRefs } from "pinia";

const { presetThemes, setThemeIndex } = useSettingStore();
const { theme } = storeToRefs(useSettingStore());

async function checkForUpdates() {
  const response = await invoke("check_for_updates"); // 调用 Tauri 的命令来检查更新
  console.log(response); // 处理响应，例如显示通知给用户等。
}
</script>

<template>
  <div id="setting-view">
    <div class="header">
      <div class="title">设置</div>
    </div>
    <div class="center">
      <div class="theme row">
        <span class="cate-name"><b>主题</b></span>
        <div class="content">
          <div class="last" v-for="(item, index) in presetThemes()" :class="{ active: index == theme.index, lightText: item.dark }" :style="{ background: item.color }" @click="setThemeIndex(index)">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="row">
          <span class="cate-name"><b>检查更新</b></span>
          <div class="content">
            <div class="last" @click="checkForUpdates">
              <span>检查更新</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#setting-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
  overflow: scroll;
}

#setting-view .tip-text {
  font-size: 13.5px;
  color: var(--text-sub-color);
}

#setting-view .title {
  margin-left: 35px;
  margin-right: 35px;
  padding-top: 25px;
  font-size: 30px;
  font-weight: bold;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--setting-bottom-border-color);
  /* border-bottom: 2px solid transparent; */
}

#setting-view .center {
  padding-left: 35px;
  padding-right: 35px;
  padding-bottom: 30px;
}

#setting-view .center .row {
  display: flex;
  flex-direction: row;
  padding-top: 35px;
  padding-bottom: 35px;
  border-bottom: 2px solid var(--setting-bottom-border-color);
  /* border-bottom: 2px solid transparent; */
}

#setting-view .center .last-row {
  border-color: transparent;
}

#setting-view .center .row > .cate-name {
  font-size: 17px;
  margin-left: 10px;
  width: 125px;
}

#setting-view .content,
#setting-view .content > div,
#setting-view .keys-input-ctl {
  flex: 1;
}

#setting-view .content > div {
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#setting-view .content > div span {
  width: 225px;
}

#setting-view .content .last {
  margin-bottom: 0px;
}

#setting-view .theme {
  padding-bottom: 10px !important;
}

#setting-view .theme .cate-name b {
  font-weight: normal;
}

#setting-view .theme .cate-name b:hover {
  cursor: pointer;
  font-weight: bold;
  color: var(--hl-color);
}

#setting-view .theme .content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

#setting-view .theme .content div {
  --size: 50px;
  width: var(--size);
  max-width: var(--size);
  height: var(--size);
  border-radius: 5px;
  box-shadow: 0px 0px 1px #212121;
  text-align: center;
  margin-right: 23px;
  margin-bottom: 25px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid transparent;
  /* flex: 1; */
}

#setting-view .theme .content div span {
  background-color: #16161656;
  line-height: var(--size);
  border-radius: 5px;
  visibility: hidden;
}

#setting-view .theme .content div:hover span {
  visibility: visible;
}

#setting-view .theme .content .active {
  border-color: #ffd700;
}

#setting-view .theme .content .lightText {
  color: #fff !important;
}

#setting-view .common .content {
  display: flex;
  flex-direction: column;
  margin-right: 30px;
}

#setting-view .common .window-zoom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

#setting-view .common .window-zoom div {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  align-items: center;
}

#setting-view .common .window-zoom .zoom-title span {
  margin-left: 18px;
  padding-top: 2px;
}

#setting-view .common .window-zoom .zoom-title input {
  border-radius: 3px;
  padding: 8px;
  border: 1px solid var(--input-border-color);
  background-color: var(--input-bg);
  margin-left: 15px;
  color: var(--text-color);
  text-align: center;
  min-width: 66px;
}

#setting-view .layout .content .layout-item,
#setting-view .track .content .quality-item {
  width: 68px;
  padding: 6px;
  text-align: center;
  border-radius: 10rem;
  margin-right: 20px;
  border: 0px solid var(--border-color);
  cursor: pointer;
}

#setting-view .layout .content .layout-item:hover,
#setting-view .track .content .quality-item:hover {
  background-color: var(--border-color);
  background-color: var(--list-item-hover);
}

#setting-view .layout .content .active,
#setting-view .track .content .active {
  background: var(--btn-bg) !important;
  color: var(--svg-btn-color) !important;
  /*border: 1px solid var(--border-color);*/
}

#setting-view .keys .global-keys-ctrl {
  margin-left: 50px;
}

#setting-view .keys .svg-text-btn {
  margin-left: 188px;
}

#setting-view .about .content span {
  width: auto;
  margin-right: 6px;
}

#setting-view .center .repository div {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#setting-view .repository svg {
  fill: var(--text-color);
  cursor: pointer;
}

#setting-view .repository .link,
#setting-view .license .link {
  text-decoration: underline;
  cursor: pointer;
  color: var(--text-color);
  padding-left: 5px;
}

#setting-view .keys-input-ctl input {
  min-width: 159px;
  width: 93.5%;
  padding: 8px;
}

#setting-view .keysInputAdptWidth input {
  width: 42%;
}

#setting-view .center .spacing {
  margin-left: 25px;
}

#setting-view .link {
  color: var(--text-color);
}

#setting-view datalist {
  background: transparent;
}

#setting-view #zoom-tickmarks {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  writing-mode: lr;
  flex: 1;
}

#setting-view #zoom-tickmarks option {
  font-size: 13px;
  cursor: pointer;
}

#setting-view input[type="range"] {
  width: 100%;
  cursor: pointer;
  background: transparent;
  -webkit-appearance: none;
  margin-top: 10px;
  margin-bottom: 5px;
  padding: 0px;
}

#setting-view input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 22px;
  width: 6px;
  background: var(--hl-color);
  border-radius: 10rem;
  margin-top: -8px;
}

#setting-view input[type="range"]::-webkit-slider-runnable-track {
  background: var(--progress-track-bg);
  border-radius: 10rem;
  height: 6px;
}

#setting-view .font {
  display: flex;
  margin-top: 3px;
}

#setting-view .font div {
  flex: 1;
}

#setting-view .font input,
#setting-view .network input {
  border-radius: 3px;
  padding: 8px;
  border: 1px solid var(--input-border-color);
  background-color: var(--input-bg);
  margin-left: 10px;
  min-width: 223px;
  color: var(--text-color);
}

#setting-view .version .download-wrap {
  display: flex;
  align-items: center;
}

#setting-view .version .download-wrap .progress-bar {
  width: 211px;
  height: 5px;
}
</style>
