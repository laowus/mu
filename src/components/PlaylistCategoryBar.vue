<script setup>
import { reactive } from "vue";
import EventBus from "../common/EventBus.js";

const props = defineProps({ data: Array, loading: Boolean });

const flatData = reactive([]);
const getFlatData = () => {
  // 清空之前的数据
  flatData.length = 0;

  // 检查数据是否存在
  if (!props.data || props.data.length === 0) {
    return flatData;
  }

  // 处理嵌套数组结构 - 从错误信息看，data是一个包含数组的数组
  // 例如: Array(1)[0: Array(6)[0: Category, 1: Category, ...]]
  const outerArray = props.data;

  // 遍历外部数组
  outerArray.forEach((innerArray, outerIndex) => {
    // 检查innerArray是否为数组
    if (Array.isArray(innerArray)) {
      // 遍历内部数组中的Category对象
      innerArray.forEach((category, categoryIndex) => {
        // 确保category和category.data存在
        if (category && Array.isArray(category.data)) {
          // 遍历Category对象中的data数组
          category.data.forEach((item, itemIndex) => {
            // 记录位置信息
            item.row = outerIndex;
            item.col = itemIndex;
            // 确保item有key属性才添加
            if (item && item.key !== undefined) {
              flatData.push(item);
            }
          });
        }
      });
    }
  });

  return flatData;
};
</script>

<template>
  <div class="playlist-category-bar">
    <div v-show="!loading">
      <template v-if="data && data.length > 0">
        <span
          v-for="(item, index) in getFlatData()"
          :key="index"
          v-html="item.key"
        >
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.playlist-category-bar {
  margin-left: 10px;
  height: 36px;
  overflow: hidden;
  text-align: left;
}

.playlist-category-bar span {
  padding: 6px 15px;
  margin-right: 8px;
  vertical-align: middle;
  text-align: center;
  line-height: 36px;
  font-size: var(--text-size);
  cursor: pointer;
  white-space: nowrap;
  border-radius: 10rem;
  color: var(--text-color);
}

.playlist-category-bar span:hover {
  background: var(--list-item-hover);
  color: var(--text-color);
}

.playlist-category-bar svg {
  fill: var(--svg-color);
  margin-right: 15px;
  cursor: pointer;
  transform: translateY(3px);
}

.playlist-category-bar svg:hover {
  fill: var(--hl-color);
}

.playlist-category-bar .active {
  border-color: var(--hl-color);
  border-color: transparent;
  background: var(--btn-bg) !important;
  color: var(--svg-btn-color) !important;
}
</style>
