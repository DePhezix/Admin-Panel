<script setup lang="ts">
import StaffCard from '@/components/staff/staffCard.vue';

  interface staffMemberType {
    worker_id: string;
    name: string;
    surname: string;
    org_id: string;
  }

  const staff: staffMemberType[] = [{
    worker_id: "1",
    name: "John",
    surname: "Doe",
    org_id: "1"
  }, {
    worker_id: "2",
    name: "Jane",
    surname: "Doe",
    org_id: "2"
  }]
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-space wrap>
      <StaffCard
        v-for="(staffMember, idx) in staff"
        :name="staffMember.name"
        :surname="staffMember.surname"
        :worker_id="staffMember.worker_id"
        :org_id="staffMember.org_id"
        :key="idx"
      />
    </el-space>
    <el-pagination class="mt-auto" layout="prev, pager, next" :total="1" :page-size="50" />
  </div>
</template>
