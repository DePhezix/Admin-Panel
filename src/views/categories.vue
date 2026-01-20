<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useCategoriesStore } from "@/stores/categories";
import { useRoute, useRouter } from "vue-router";

interface rowEvent extends Event {
  active: boolean;
  id: string;
  name: string;
}

const route = useRoute();
const router = useRouter();
const categoriesStore = useCategoriesStore();

categoriesStore.setCurrentPage(Number(route.query.page) || 1);

watch(
  () => route.query.page,
  (newPage) => {
    categoriesStore.setCurrentPage(Number(newPage) || 1);
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

const handleRowClick = (e: rowEvent) => {
  router.push({
    name: "organizations",
    params: {
      ...route.params,
      categoryId: e.id,
    },
  });
};

onMounted(async () => {
  await categoriesStore.fetchCategories();
});
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-table
      v-loading="categoriesStore.loading"
      :data="categoriesStore.displayedCategories"
      @row-click="handleRowClick"
      class="[&_tbody]:cursor-pointer"
    >
      <el-table-column
        fixed
        prop="id"
        label="Category ID"
        class="cursor-pointer"
        show-overflow-tooltip
      />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="status" label="Status" width="180">
        <template #default="scope">
          <el-tag :type="scope.row.active ? 'success' : 'danger'" disable-transitions>
            <span class="flex items-center gap-[5px]">
              <el-icon><CircleCheck v-if="scope.row.active" /><CircleClose v-else /></el-icon>
              {{ scope.row.active ? "Active" : "Inactive" }}
            </span>
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      class="mt-auto"
      :total="categoriesStore.totalCategories"
      :page-size="categoriesStore.pageSize"
      v-model:current-page="categoriesStore.currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>
