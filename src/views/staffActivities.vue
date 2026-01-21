<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useStaffActivityStore } from "@/stores/staffActivity";
import { useStaffStore } from "@/stores/staff";
import { useOrganizationsStore } from "@/stores/organizations";
import { useActivitiesStore } from "@/stores/activities";
import { useAuthStore } from "@/stores/auth";

import StaffActivityActions from "@/components/staffActivity/staffActivityActions.vue";

const route = useRoute();
const router = useRouter();

const orgazinationsStore = useOrganizationsStore();
const staffStore = useStaffStore();
const staffActivityStore = useStaffActivityStore();
const authStore = useAuthStore();
const activitiesStore = useActivitiesStore();

staffActivityStore.setCurrentPage(Number(route.query.page) || 1);

const currentOrganization = ref<string | undefined>(undefined);
const currentStaff = ref<string | undefined>(undefined);

watch(
  () => route.query.page,
  (newPage) => {
    staffActivityStore.setCurrentPage(Number(newPage) || 1);
  }
);

onMounted(async () => {
  await Promise.all([
    route.params.organizationId
      ? orgazinationsStore.findOrganization(route.params.organizationId).then((organization) => {
          currentOrganization.value = organization?.name;
        })
      : Promise.resolve(),
    route.params.staffId
      ? staffStore.findStaff(route.params.staffId).then((staff) => {
          currentStaff.value = staff?.name + " " +  staff?.surname;
        })
      : Promise.resolve(),
    staffActivityStore.fetchStaffActivity(route.params.organizationId, route.params.staffId),
  ]);
});

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
    <el-table
      v-loading="staffActivityStore.loading"
      :data="staffActivityStore.displayedStaffActivity"
    >
      <el-table-column label="Organization" show-overflow-tooltip>
        <template #default="scope">
          <el-text>
            {{ currentOrganization }}
          </el-text>
        </template>
      </el-table-column>

      <el-table-column label="Worker" show-overflow-tooltip>
        <template #default="scope">
          <el-text>
            {{ currentStaff }}
          </el-text>
        </template>
      </el-table-column>

      <el-table-column
        prop="activity_name"
        label="Activity"
        class="cursor-pointer"
        show-overflow-tooltip
      />

      <el-table-column prop="id" label="Staff Activity ID" show-overflow-tooltip />

      <el-table-column
        fixed="right"
        header-align="right"
        align="right"
        min-width="120"
        label="Actions"
        v-if="authStore.userData.role === 'admin' || authStore.userData.role === 'agent'"
      >
        <template #default="scope">
          <StaffActivityActions
            :staff_activity_id="scope.row.id"
            :activity_id="scope.row.activity_id"
            :activity_name="scope.row.activity_name"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      class="mt-auto"
      :total="staffActivityStore.totalStaffActivity"
      :page-size="staffActivityStore.pageSize"
      v-model:current-page="staffActivityStore.currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>
