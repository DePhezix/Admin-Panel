<script async setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useOrganizationsStore } from "@/stores/organizations";
import { useCategoriesStore } from "@/stores/categories";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import OrganizationActions from "@/components/organizations/organizationActions.vue";

interface rowEvent extends Event {
  active: boolean;
  id: string;
  name: string;
}

const route = useRoute();
const router = useRouter();
const orgazinationsStore = useOrganizationsStore();
const categoriesStore = useCategoriesStore();
const authStore = useAuthStore();

orgazinationsStore.setCurrentPage(Number(route.query.page) || 1);

const currentCategory = ref<string | undefined>(undefined);

watch(
  () => route.query.page,
  (newPage) => {
    orgazinationsStore.setCurrentPage(Number(newPage) || 1);
  }
);

onMounted(async () => {
  await Promise.all([
    route.params.categoryId
      ? categoriesStore.findCategory(route.params.categoryId).then((category) => {
          currentCategory.value = category?.name;
        })
      : Promise.resolve(),
    orgazinationsStore.fetchOrganizations(route.params.categoryId),
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
    name: "staff_and_activities",
    params: {
      ...route.params,
      organizationId: e.id,
    },
  });
};
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-table
      v-loading="orgazinationsStore.loading"
      :data="orgazinationsStore.displayedOrganizations"
      @row-click="handleRowClick"
      class="[&_tbody]:cursor-pointer"
    >
      <el-table-column label="Category">
        <template #default="scope">
          <el-text>
            {{ currentCategory }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Name" />
      <el-table-column
        fixed="right"
        header-align="right"
        align="right"
        min-width="120"
        label="Actions"
        v-if="authStore.userData.role === 'admin'"
      >
        <template #default="scope">
          <OrganizationActions :name="scope.row.name" :org_id="scope.row.id" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      class="mt-auto"
      :total="orgazinationsStore.totalOrganizations"
      :page-size="orgazinationsStore.pageSize"
      v-model:current-page="orgazinationsStore.currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>
