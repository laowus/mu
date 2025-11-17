<script setup>
import { inject, onActivated, onMounted, shallowRef, watch } from "vue";
import { storeToRefs } from "pinia";
import MainContent from "./DefaultMainContent.vue";
import MainTop from "./DefaultMainTop.vue";
import { useSettingStore } from "../store/settingStore";
const { isDefaultClassicLayout } = storeToRefs(useSettingStore());

const currentMainTop = shallowRef(null);
const currentMainBottom = shallowRef(null);

const setupDefaultLayout = () => {
  if (isDefaultClassicLayout.value) {
    // currentMainTop.value = ClassicMainTop;
  } else {
    currentMainTop.value = MainTop;
  }
};

onActivated(setupDefaultLayout);
</script>
<template>
  <div id="main-center">
    <component id="main-top" :is="currentMainTop"> </component>
    <MainContent id="main-content" :class="{ autopadding: isDefaultClassicLayout }"> </MainContent>
  </div>
</template>

<style>
#main-center {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: var(--main-center-bg);
}

#main-center,
#main-top,
#main-content,
#main-bottom {
  z-index: 1;
}

/* TODO */
#main-center .autopadding .playlist-square-view,
#main-center .autopadding .artist-square-view,
#main-center .autopadding .radio-square-view,
#main-center .autopadding #themes-view .title,
#main-center .autopadding #setting-view .title,
#main-center .autopadding #search-view,
#main-center .autopadding #user-profile-view,
#main-center .autopadding #batch-action-view,
#main-center .autopadding #user-info-edit-view,
#main-center .autopadding #custom-playlist-edit-view,
#main-center .autopadding #data-backup-view,
#main-center .autopadding #data-restore-view {
  padding-top: 5px;
}

#main-center .autopadding #local-music-view,
#main-center .autopadding #playlist-detail-view,
#main-center .autopadding #artist-detail-view,
#main-center .autopadding #album-detail-view,
#main-center .autopadding #custom-playlist-detail-view {
  padding-top: 13px;
}
</style>
