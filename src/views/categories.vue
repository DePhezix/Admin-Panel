<script setup lang="ts">
import CategoriesTable from "@/components/categories/categoriesTable.vue";
import OrganizationsTable from "@/components/categories/organizationsTable.vue";
import StaffTable from "@/components/categories/staffTable.vue";
import ActivitiesTable from "@/components/categories/activitiesTable.vue";
import StaffActivityTable from "@/components/categories/staffActivityTable.vue";
import { useRoute, useRouter } from "vue-router";
import { ElTabPane } from "element-plus";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();

const activeName = ref<string>(route.query.tab || "staff");
const handleClick = () => {
  router.push({
    query: {
      category: route.query.category,
      organization: route.query.organization,
      tab: activeName.value === "staff" ? "activity" : "staff",
    },
  });
};
</script>

<template>
  <CategoriesTable v-if="!route.query.category" />
  <organizations-table v-else-if="route.query.category && !route.query.organization" />
  <staff-activity-table v-else-if="route.query.staff" />
  <el-tabs
    v-model="activeName"
    v-if="route.query.organization && !route.query.staff && !route.query.activity"
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
