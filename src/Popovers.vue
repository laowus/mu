<script setup>
import { ref, reactive, onMounted } from "vue";
import Notification from "./components/Notification.vue";
import { useAppCommonStore } from "./store/appCommonStore";
import { storeToRefs } from "pinia";
import EventBus from "./common/EventBus";

const { commonNotificationShow, commonNotificationText } = storeToRefs(useAppCommonStore());

const { showCommonNotification, hideCommonNotification } = useAppCommonStore();

const doToast = (text, callback, delay) => {
  delay = delay && delay >= 0 ? delay : 1500;
  showCommonNotification(text);
  setTimeout(() => {
    hideCommonNotification();
    if (callback) callback();
  }, delay);
};
const bindEventListeners = () => {
  EventBus.on("toast", ({ text, callback, delay }) => doToast(text, callback, delay));
};

onMounted(() => {
  bindEventListeners();
});
</script>
<template>
  <transition>
    <Notification class="common-ntf" v-show="commonNotificationShow">
      <template #text>
        <p v-html="commonNotificationText"></p>
      </template>
    </Notification>
  </transition>
</template>

<style></style>
