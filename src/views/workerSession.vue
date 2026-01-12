<script setup lang="ts">
import WorkerSessionCard from "@/components/workerSession/workerSessionCard.vue";

interface workerSessionType {
  worker_session_id: string;
  worker_id: string;
  activity_id: string;
  equipment_id: string;
  active: boolean;
}

const sessions: workerSessionType[] = [
  {
    worker_session_id: "1",
    worker_id: "1",
    activity_id: "1",
    equipment_id: "1",
    active: true,
  },   {
    worker_session_id: "2",
    worker_id: "2",
    activity_id: "2",
    equipment_id: "2",
    active: false,
  },
];
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-space wrap>
      <WorkerSessionCard
        v-for="(session, idx) in sessions"
        :worker_session_id="session.worker_session_id"
        :worker_id="session.worker_id"
        :activity_id="session.activity_id"
        :equipment_id="session.equipment_id"
        :active="session.active"
        :key="idx"
      />
    </el-space>
    <el-pagination class="mt-auto" layout="prev, pager, next" :total="1" :page-size="50" />
  </div>
</template>
