<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useActivitiesStore } from "@/stores/activities";
import { useOrganizationsStore } from "@/stores/organizations";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import ActivityActions from "./activityActions.vue";

const route = useRoute();
const router = useRouter();
const orgazinationsStore = useOrganizationsStore();
const activitiesStore = useActivitiesStore();
const authStore = useAuthStore();

activitiesStore.setCurrentPage(Number(route.query.page) || 1);

const currentOrganization = ref<string | undefined>(undefined);

onMounted(async () => {
  await Promise.all([
    route.params.organizationId
      ? orgazinationsStore.findOrganization(route.params.organizationId).then((organization) => {
          currentOrganization.value = organization?.name;
        })
      : Promise.resolve(),
    activitiesStore.fetchActivities(route.params.organizationId),
  ]);
});

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
    <el-table v-loading="activitiesStore.loading" :data="activitiesStore.displayedActivities">
      <el-table-column label="Organization" show-overflow-tooltip>
        <template #default="scope">
          <el-text>
            {{ currentOrganization }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Activity" show-overflow-tooltip />
      <el-table-column
        fixed="right"
        header-align="right"
        align="right"
        min-width="120"
        label="Actions"
        v-if="authStore.userData.role === 'admin' || authStore.userData.role === 'agent'"
      >
        <template #default="scope">
          <ActivityActions :name="scope.row.name" :id="scope.row.id" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      class="mt-auto"
      :total="activitiesStore.totalActivities"
      :page-size="activitiesStore.pageSize"
      v-model:current-page="activitiesStore.currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>
