<script setup lang="ts">
import StaffTable from "@/components/staff/staffTable.vue";
import ActivitiesTable from "@/components/activity/activitiesTable.vue";
import { useRoute, useRouter, type LocationQueryValue } from "vue-router";
import { ElTabPane } from "element-plus";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();

const activeName = ref<string | LocationQueryValue[]>(route.query.tab || "staff");
const handleClick = () => {
  router.push({
    query: {
      tab: activeName.value === "staff" ? "activity" : "staff",
    },
  });
};
</script>

<template>
  <el-tabs
    v-model="activeName"
    @tab-click="handleClick"
    class="h-full"
  >
    <el-tab-pane label="Staff" name="staff" class="h-full">
      <staff-table />
    </el-tab-pane>
    <el-tab-pane label="Activity" name="activity" class="h-full">
      <ActivitiesTable />
    </el-tab-pane>
  </el-tabs>
</template>
