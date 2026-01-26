<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import WorkSessionActions from "./components/workSessionActions.vue";
import { useSessionsStore } from "@/stores/sessions";
import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();
const sessionsStore = useSessionsStore();

sessionsStore.setCurrentPage(Number(route.query.page) || 1);

watch(
  () => route.query.page,
  (newPage) => {
    sessionsStore.setCurrentPage(Number(newPage) || 1);
  },
);

const handlePageChange = (page: number) => {
  router.push({
    query: {
      ...route.query,
      page: String(page),
    },
  });
};

onMounted(async () => {
  try {
    await sessionsStore.fetchSessions();
  } catch {
    ElMessage.error("Failed to get data from server. Please try again later.");
  }
});
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-table
      v-loading="sessionsStore.loading"
      :data="sessionsStore.displayedSessions"
      show-overflow-tooltip
      class="w-full"
    >
      <el-table-column fixed label="Worker" width="200" >
        <template #default="scope">
          {{ scope.row.worker.name + " " + scope.row.worker.surname }}
        </template>
      </el-table-column>
      <el-table-column prop="activity.name" label="Activity" width="180" />
      <el-table-column prop="equipment_id" label="Equipment ID" width="180">
        <template #default="scope">
          <el-text>
            {{
              scope.row.equipment_id.toString().startsWith("EQ-")
                ? scope.row.equipment_id
                : `EQ-${scope.row.equipment_id.toString().padStart(3, "0")}`
            }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="agent.name" label="Agent" width="180" />
      <el-table-column prop="active" label="Status" width="180">
        <template #default="scope">
          <el-tag :type="scope.row.active ? 'success' : 'danger'" disable-transitions>
            <span class="flex items-center gap-[5px]">
              <el-icon><CircleCheck v-if="scope.row.active" /><CircleClose v-else /></el-icon>
              {{ scope.row.active ? "Active" : "Inactive" }}
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="Created At" width="200">
        <template #default="scope">
          {{ new Date(scope.row.created_at).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="right"
        align="right"
        min-width="120"
        label="Actions"
      >
        <template #default="scope">
          <WorkSessionActions
            :worker-name="scope.row.worker.id"
            :activity-id="scope.row.activity.id"
            :equipment-name="scope.row.equipment_id"
            :status="scope.row.active"
            :worker-session-id="scope.row.id"
            :activity-name="scope.row.activity.name"
            :org_id="scope.row.org_id"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mt-auto"
      layout="prev, pager, next"
      :total="sessionsStore.totalSessions"
      :page-size="sessionsStore.pageSize"
      v-model:current-page="sessionsStore.currentPage"
      @current-change="handlePageChange"
    />
  </div>
</template>
