<script setup>
import { provide } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

/* 全局Router设置  */
const router = useRouter();
const currentRoutePath = () => router.currentRoute.value.path;
const resolveRoute = (route) => {
  if (typeof route == "object") return route;
  return { toPath: route.toString() };
};
//TODO Reject是否需要实现待考虑
const visitRoute = (route) => {
  console.log("visitRoute", route);
  return new Promise((resolve, reject) => {
    if (!route) {
      //if(reject) reject()
      return;
    }
    const { toPath, onRouteReady, beforeRoute } = resolveRoute(route);
    console.log("visitRoute toPath", toPath, beforeRoute);
    if (!toPath) {
      //if(reject) reject()
      return;
    }
    if (beforeRoute) beforeRoute(toPath);
    const fromPath = currentRoutePath();
    const isSame = fromPath == toPath;
    if (isSame) {
      console.log("visitRoute toPath isSame", toPath);
      //if(reject) reject()
      return;
    }
    if (onRouteReady) onRouteReady(toPath);
    console.log("visitRoute toPath", toPath);
    router.push(toPath);
    if (resolve) resolve();
  });
};

provide("appRoute", {
  visitRoute,
  visitPlaylist: (platform, id) => {
    router.push(`/playlist/${platform}/${id}`);
  },
  backward: () => router.back(),
  forward: () => router.forward(),
});
</script>
<template>
  <slot></slot>
</template>

<style scoped></style>
