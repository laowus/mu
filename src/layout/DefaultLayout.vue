<script setup>
import MainCenter from "./DefaultMainCenter.vue";
import Popovers from '../Popovers.vue';
</script>
<template>
  <div class="default-layout">
    <MainCenter></MainCenter>
    <Popovers></Popovers>
  </div>
</template>

<style>
.default-layout {
  flex: 1;
  display: flex;
}
</style>
