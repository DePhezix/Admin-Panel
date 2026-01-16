<script setup lang="ts">
import { watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import WorkSessionActions from "@/components/workerSession/workSessionActions.vue";
import { useSessionsStore } from "@/stores/sessions";

const router = useRouter();
const route = useRoute();
const sessionsStore = useSessionsStore();

sessionsStore.setCurrentPage(Number(route.query.page) || 1);

watch(
  () => route.query.page,
  (newPage) => {
    sessionsStore.setCurrentPage(Number(newPage) || 1);
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
    <el-table :data="sessionsStore.displayedSessions" show-overflow-tooltip class="w-full">
      <el-table-column fixed prop="id" label="Session ID" width="180" />
      <el-table-column prop="worker" label="Worker" width="200" />
      <el-table-column prop="activity" label="Activity" width="180" />
      <el-table-column prop="equipment" label="Equipment" width="180" />
      <el-table-column prop="agent" label="Agent" width="180" />
      <el-table-column prop="status" label="Status" width="180">
        <template #default="scope">
          <el-tag :type="scope.row.status ? 'success' : 'danger'" disable-transitions>
            <span class="flex items-center gap-[5px]">
              <el-icon><CircleCheck v-if="scope.row.status" /><CircleClose v-else /></el-icon>
              {{ scope.row.status ? "Active" : "Inactive" }}
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created" label="Created At" width="200" />
      <el-table-column fixed="right" header-align="right" align="right" min-width="120" label="Actions">
        <template #default="scope">
          <WorkSessionActions
            :worker-name="scope.row.worker"
            :activity-name="scope.row.activity"
            :equipment-name="scope.row.equipment"
            :status="scope.row.status"
            :worker-session-id="scope.row.id"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mt-auto"
      layout="prev, pager, next"
      :total="sessionsStore.filteredSessions.length"
      :page-size="sessionsStore.pageSize"
      v-model:current-page="sessionsStore.currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>
