<script setup lang="ts">
import { watch } from "vue";
import { useActivitiesStore } from "@/stores/activities";
import { useOrganizationsStore } from "@/stores/organizations";
import { useRoute, useRouter } from "vue-router";
import ActivityActions from "../activity/activityActions.vue";

interface rowEvent extends Event {
  active: boolean;
  id: string;
  name: string;
}

const route = useRoute();
const router = useRouter();
const orgazinationsStore = useOrganizationsStore();
const activitiesStore = useActivitiesStore();

activitiesStore.setCurrentPage(Number(route.query.page) || 1);

const currentOrganization = route.query.organization
  ? orgazinationsStore.findOrganization(route.query.organization)?.name
  : undefined;

watch(
  () => route.query.page,
  (newPage) => {
    activitiesStore.setCurrentPage(Number(newPage) || 1);
  }
);

const handlePageChange = (page: number) => {
  router.push({
    query: {
      ...route.query,
      page: String(page),
    },
  });
};
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-table :data="activitiesStore.displayedActivities">
      <el-table-column label="Organization">
        <template #default="scope">
          <el-text>
            {{ currentOrganization }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Activity" />
      <el-table-column prop="id" label="Activity ID" show-overflow-tooltip />
      <el-table-column
        fixed="right"
        header-align="right"
        align="right"
        min-width="120"
        label="Actions"
      >
        <template #default="scope">
          <ActivityActions :name="scope.row.name" :id="scope.row.id" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      class="mt-auto"
      :total="activitiesStore.activities.length"
      :page-size="activitiesStore.pageSize"
      v-model:current-page="activitiesStore.currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>
