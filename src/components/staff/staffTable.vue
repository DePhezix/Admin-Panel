<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useStaffStore } from "@/stores/staff";
import { useAuthStore } from "@/stores/auth";
import { useOrganizationsStore } from "@/stores/organizations";
import { useRoute, useRouter } from "vue-router";
import StaffActions from "../staff/staffActions.vue";

interface rowEvent extends Event {
  active: boolean;
  id: string;
  name: string;
}

const route = useRoute();
const router = useRouter();
const orgazinationsStore = useOrganizationsStore();
const staffStore = useStaffStore();
const authStore = useAuthStore();

staffStore.setCurrentPage(Number(route.query.page) || 1);

const currentOrganization = ref<string | undefined>(undefined);

watch(
  () => route.query.page,
  (newPage) => {
    staffStore.setCurrentPage(Number(newPage) || 1);
  }
);

onMounted(async () => {
  await Promise.all([
    route.params.organizationId
      ? orgazinationsStore.findOrganization(route.params.organizationId).then((organization) => {
          currentOrganization.value = organization?.name;
        })
      : Promise.resolve(),
    staffStore.fetchStaff(route.params.organizationId),
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

const handleRowClick = (e: rowEvent) => {
  router.push({
    name: "staff_activities",
    params: {
      ...route.params,
      staffId: e.id,
    },
  });
};
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-table
      v-loading="staffStore.loading"
      :data="staffStore.displayedStaff"
      @row-click="handleRowClick"
      class="[&_tbody]:cursor-pointer"
    >
      <el-table-column label="Organization" show-overflow-tooltip>
        <template #default="scope">
          <el-text>
            {{ currentOrganization }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Name" show-overflow-tooltip />
      <el-table-column prop="surname" label="Surname" show-overflow-tooltip />
      <el-table-column prop="id" label="Staff ID" show-overflow-tooltip />
      <el-table-column
        fixed="right"
        header-align="right"
        align="right"
        min-width="120"
        label="Actions"
        v-if="authStore.userData.role === 'admin' || authStore.userData.role === 'agent'"
      >
        <template #default="scope">
          <StaffActions
            :name="scope.row.name"
            :surname="scope.row.surname"
            :worker_id="scope.row.id"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      class="mt-auto"
      :total="staffStore.totalStaff"
      :page-size="staffStore.pageSize"
      v-model:current-page="staffStore.currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>
