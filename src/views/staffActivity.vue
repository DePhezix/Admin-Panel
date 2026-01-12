<script setup lang="ts">
import StaffActivityCard from "@/components/staffActivity/staffActivityCard.vue";

interface StaffActivityType {
  staff_activity_id: string;
  activity_id: string;
  worker_id: string;
  org_id: string;
}

const staffActivities: StaffActivityType[] = [
  {
    staff_activity_id: "1",
    worker_id: "1",
    activity_id: "1",
    org_id: "1",
  },
  {
    staff_activity_id: "2",
    worker_id: "2",
    activity_id: "2",
    org_id: "2",
  },
];
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-space wrap>
      <StaffActivityCard
        v-for="(stafActivity, idx) in staffActivities"
        :staff_activity_id="stafActivity.staff_activity_id"
        :worker_id="stafActivity.worker_id"
        :activity_id="stafActivity.activity_id"
        :org_id="stafActivity.org_id"
        :key="idx"
      />
    </el-space>
    <el-pagination class="mt-auto" layout="prev, pager, next" :total="1" :page-size="50" />
  </div>
</template>
