<script setup lang="ts">
import { RouterView } from "vue-router";
import SideNavbar from "@/components/navbar/side.vue";
import TopNavbar from "@/components/navbar/top.vue";

</script>

<template>
  <el-container class="min-h-screen">
    <SideNavbar />
    <el-container class="pl-[300px] flex flex-col">
      <TopNavbar />
      <el-main class="pt-[60px]! min-w-full">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>
