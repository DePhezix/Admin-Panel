<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { sideNavigationType } from "@/types/front/sideNavTypes";

const sideNavigationArr: sideNavigationType[] = ["dashboard", "categories", "sessions", "settings"];

const route = useRoute();
const router = useRouter();

const collapsedNav = ref<boolean>(false);

const currentNavIdx = computed<number>(() => {
  const currentPath = route.path.split("_").join(" ").slice(1);
  const idxOfPath = !currentPath.includes("categories")
    ? sideNavigationArr.findIndex((item) => item === currentPath)
    : 1;

  return idxOfPath;
});

const handleChange = (newNavIdx: string) => {
  const idx = Number(newNavIdx);
  const newNav = sideNavigationArr[idx]?.split(" ").join("_");
  if (newNav) {
    router.push({ name: newNav });
  }
};
</script>
<template>
  <el-aside :class="{ '!w-min': collapsedNav }">
    <el-scrollbar>
      <el-menu
        class="h-screen flex flex-col"
        :collapse="collapsedNav"
        :default-active="String(currentNavIdx)"
        @select="handleChange"
      >
        <h1
          class="flex justify-between px-[20px] py-[10px] items-center"
          :class="{ 'justify-center py-[0]': collapsedNav }"
        >
          <span :class="{ hidden: collapsedNav }"> HUMAID </span>
          <el-icon class="cursor-pointer" @click="collapsedNav = !collapsedNav"
            ><Fold v-if="!collapsedNav" /><Expand v-else
          /></el-icon>
        </h1>
        <div class="flex-1">
          <el-menu-item index="0">
            <el-icon><DataLine /></el-icon>
            <template #title>Dashboard</template>
          </el-menu-item>
          <el-menu-item index="1">
            <el-icon><Document /></el-icon>
            <template #title>Categories</template>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><Suitcase /></el-icon>
            <template #title>Sessions</template>
          </el-menu-item>
        </div>
        <el-menu-item index="3">
          <el-icon><setting /></el-icon><template #title>Settings</template></el-menu-item
        >
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>
