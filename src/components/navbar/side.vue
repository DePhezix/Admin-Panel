<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

type sideNavigationType =
  | "categories"
  | "organizations"
  | "staff"
  | "activity"
  | "staff activity"
  | "worker session"
  | "analytics"
  | "health check";

const sideNavigationArr: sideNavigationType[] = [
  "categories",
  "organizations",
  "staff",
  "activity",
  "staff activity",
  "worker session",
  "analytics",
  "health check",
];

const route = useRoute();
const router = useRouter();

const currentNavIdx = computed<number>(() => {
  const currentPath = route.path.split("_").join(" ").slice(1);
  const idxOfPath = sideNavigationArr.findIndex((item) => item === currentPath);

  return idxOfPath;
});

const handleChange = (newNavIdx: string) => {
  const idx = Number(newNavIdx);
  const newNav = sideNavigationArr[idx]?.split(" ").join("_");
  if (newNav) {
    router.push(newNav);
  }
};

</script>
<template>
  <el-aside class="fixed">
    <el-scrollbar>
      <el-menu class="h-screen" :default-active="String(currentNavIdx)" @select="handleChange">
        <el-menu-item index="0">Categories</el-menu-item>
        <el-menu-item index="1">Organizations</el-menu-item>
        <el-menu-item index="2">Staff</el-menu-item>
        <el-menu-item index="3">Activity</el-menu-item>
        <el-menu-item index="4">Staff Activity</el-menu-item>
        <el-menu-item index="5">Worker Sessions</el-menu-item>
        <el-menu-item index="6">Analytics</el-menu-item>
        <el-menu-item index="7">Health Check</el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>
