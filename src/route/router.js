import { createRouter, createWebHashHistory } from "vue-router";
import PlaylistSquareView from "../views/PlaylistSquareView.vue";
import PlaylistDetailView from "../views/PlaylistDetailView.vue";
import SearchView from '../views/SearchView.vue';
const routes = [
  {
    //默认
    path: "/",
    component: PlaylistSquareView,
  },
  {
    //歌单详情
    path: "/playlist/:platform/:id",
    props: true,
    component: PlaylistDetailView,
  },
  {
    //搜索
    path: "/search/:keyword",
    props: true,
    component: SearchView,
  },
];

export const router = createRouter({
  //为了简单起见，在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes,
});
