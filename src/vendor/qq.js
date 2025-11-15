import { invoke } from "@tauri-apps/api/core";
import { Category } from "../common/Category.js";

/**
 * QQ音乐平台相关功能类
 * 用于处理QQ音乐的分类获取和其他平台特定操作
 */
export class QQ {
  // 平台编码标识
  static CODE = "qq";
  // 默认分类ID
  static DEFAULT_CATE = 10000000;
  // 排行榜分类ID
  static TOPLIST_CODE = 99999999;
  // 电台分类ID
  static RADIO_CODE = 88888888;
  // 最新分类ID
  static NEW_CODE = 22222222;
  // 排行榜前缀
  static TOPLIST_PREFIX = "TOP_";
  // 电台缓存数据
  static RADIO_CACHE = { channel: 0, data: [] };

  /**
   * 获取QQ音乐分类列表
   * @returns {Promise<Object>} 返回包含分类数据的Promise对象
   */
  static categories() {
    return new Promise((resolve, reject) => {
      // 初始化返回结果对象
      const result = { platform: QQ.CODE, data: [], orders: [] };

      // 调用Tauri原生API获取QQ音乐分类数据
      invoke("fetch_qq_category")
        .then((res) => {
          // 处理API返回的数据，确保是JSON对象
          const json = typeof res === "string" ? JSON.parse(res) : res;
          // 用于缓存分类名称，避免重复添加
          const cateNameCached = [];
          // 获取分类列表数据
          const list = json.data.categories;

          // 打印分类列表到控制台（调试用）
          console.table(list);

          // 遍历处理每个一级分类
          list.forEach((cate) => {
            // 获取分类组名称
            const cateName = cate.categoryGroupName;
            // 创建新的Category实例
            const category = new Category(cateName);
            // 获取该分类下的子项
            const items = cate.items;

            // 遍历处理每个子分类项
            items.forEach((item) => {
              // 获取子分类名称
              const name = item.categoryName;
              // 获取子分类ID
              const id = item.categoryId;
              // 将子分类添加到Category实例中
              category.add(name, id);
            });

            // 防止重复添加同名分类组
            if (cateNameCached.includes(cateName)) return;
            // 将分类添加到结果集
            result.data.push(category);
            // 记录已添加的分类名称
            cateNameCached.push(cateName);
          });

          // 在第一个分类中插入特殊分类：最新、排行榜、电台
          const firstCate = result.data[0];
          // 在索引1位置插入"最新"分类
          firstCate.data.splice(1, 0, { key: "最新", value: QQ.NEW_CODE });
          // 在索引2位置插入"排行榜"分类
          firstCate.data.splice(2, 0, {
            key: "排行榜",
            value: QQ.TOPLIST_CODE,
          });
          // 在索引3位置插入"电台"分类
          firstCate.data.splice(3, 0, { key: "电台", value: QQ.RADIO_CODE });

          // 成功解析后返回结果
          resolve(result);
        })
        .catch((err) => {
          // 处理错误
          reject(err);
        });
    });
  }
}
