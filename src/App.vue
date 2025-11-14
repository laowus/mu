<script setup>
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { Category } from "./common/Category.js";

const loading = ref(false);
const error = ref("");

async function fetchQQMusicDataViaTauri() {
  loading.value = true;
  error.value = "";

  try {
    const result = await invoke("fetch_qq_category");
    const _json = typeof result === "string" ? JSON.parse(result) : result;
    const cateNameCached = [];
    const list = _json.data.categories;
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
  } catch (err) {
    error.value = `通过Tauri命令获取数据失败: ${err.message}`;
    console.error("Error invoking Tauri command:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchQQMusicDataViaTauri();
});
</script>

<template>
  <main class="container"></main>
</template>

<style scoped>
.api-section {
  margin: 40px 0;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fafafa;
}

.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 20px 0;
}

.api-result {
  margin-top: 20px;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.api-result pre {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
  max-height: 400px;
  font-size: 14px;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.loading-message {
  margin: 20px 0;
  font-style: italic;
}

.no-data-message {
  margin: 20px 0;
  font-style: italic;
  color: #666;
}

.sort-names-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0;
}

.sort-name-item {
  background-color: #e3f2fd;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

/* 新增样式 */
.allsorts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 15px 0;
}

.allsort-item {
  background-color: #e8f5e9;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #c8e6c9;
  min-width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.item-name {
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 8px;
}

.item-detail {
  font-size: 13px;
  color: #43a047;
  margin-bottom: 4px;
}

.array-info {
  font-weight: bold;
  color: #1565c0;
  margin-bottom: 10px;
}

.allsorts-json {
  margin-top: 20px;
}

.large-array-notice {
  padding: 10px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  color: #856404;
  font-style: italic;
  margin-top: 10px;
}

h3 {
  margin-top: 25px;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.greet-section {
  margin-top: 40px;
}

@media (prefers-color-scheme: dark) {
  .api-section {
    border-color: #333;
    background-color: #2a2a2a;
  }

  .api-result pre {
    background-color: #1f1f1f;
    color: #f0f0f0;
  }

  .sort-name-item {
    background-color: #1a237e;
    color: #90caf9;
    border-color: #303f9f;
  }

  .allsort-item {
    background-color: #1b5e20;
    border-color: #2e7d32;
  }

  .item-name {
    color: #81c784;
  }

  .item-detail {
    color: #a5d6a7;
  }

  .array-info {
    color: #64b5f6;
  }

  .large-array-notice {
    background-color: #5d4037;
    border-color: #8d6e63;
    color: #d7ccc8;
  }

  h3 {
    color: #f0f0f0;
  }
}
</style>

<style>
/* 全局样式保持不变 */
:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #0f0f0f;
  background-color: #f6f6f6;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  margin: 0;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

button {
  cursor: pointer;
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #646cff;
  color: white;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #535bf2;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #2f2f2f;
  }

  input {
    background-color: #1a1a1a;
    color: #f6f6f6;
    border-color: #444;
  }
}
</style>
