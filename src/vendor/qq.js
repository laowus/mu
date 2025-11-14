import { invoke } from "@tauri-apps/api/core";
import { Category } from "../common/Category.js";

export class QQ {
  static CODE = "qq";
  static DEFAULT_CATE = 10000000;
  static TOPLIST_CODE = 99999999;
  static RADIO_CODE = 88888888;
  static NEW_CODE = 22222222;
  static TOPLIST_PREFIX = "TOP_";
  static RADIO_CACHE = { channel: 0, data: [] };

  static categories() {
    return new Promise((resolve, reject) => {
      const result = { platform: QQ.CODE, data: [], orders: [] };
      invoke("fetch_qq_category")
        .then((res) => {
          console.log(res);
          const json = typeof res === "string" ? JSON.parse(res) : res;
          const cateNameCached = [];
          const list = json.data.categories;
          list.forEach((cate) => {
            const cateName = cate.categoryGroupName;
            const category = new Category(cateName);
            const items = cate.items;
            items.forEach((item) => {
              const name = item.categoryName;
              const id = item.categoryId;
              category.add(name, id);
            });
            if (cateNameCached.includes(cateName)) return;
            result.data.push(category);
            cateNameCached.push(cateName);
          });
          const firstCate = result.data[0];
          firstCate.data.splice(1, 0, { key: "最新", value: QQ.NEW_CODE });
          firstCate.data.splice(2, 0, {
            key: "排行榜",
            value: QQ.TOPLIST_CODE,
          });
          firstCate.data.splice(3, 0, { key: "电台", value: QQ.RADIO_CODE });
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
