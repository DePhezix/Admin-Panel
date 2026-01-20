<script setup lang="ts">
import TopSessions from "./topSessions.vue";
import TopCategoires from "./topCategoires.vue";

import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <el-header class="w-full justify-self-end flex justify-between items-center gap-[20px]">
    <TopSessions v-if="route.path.includes('sessions')" />
    <TopCategoires v-else-if="route.path.includes('categories')" />
  </el-header>
</template>
