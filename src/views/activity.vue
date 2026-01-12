<script setup lang="ts">
import ActivityCard from "@/components/activity/activityCard.vue";

interface activityType {
  name: string;
  org_id: string;
  activity_id: string;
}

const tempActivities: activityType[] = [
  {
    name: "TV Assembly",
    org_id: "1",
    activity_id: "1",
  },
  {
    name: "Phone Assembly",
    org_id: "2",
    activity_id: "2",
  },
];
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-space wrap>
      <activity-card
        v-for="(activity, idx) in tempActivities"
        :name="activity.name"
        :activity_id="activity.activity_id"
        :org_id="activity.org_id"
        :key="idx"
      />
    </el-space>
    <el-pagination class="mt-auto" layout="prev, pager, next" :total="1" :page-size="50" />
  </div>
</template>
