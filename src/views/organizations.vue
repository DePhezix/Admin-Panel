<script setup lang="ts">
import OrganizationCard from "@/components/organizations/organizationCard.vue";

interface organizationType {
  org_id: string;
  category_id: string;
  name: string;
}

const organizations: organizationType[] = [
  {
    org_id: "1",
    category_id: "1",
    name: "Acme Corporation",
  },
  {
    org_id: "2",
    category_id: "2",
    name: "Bacme Organization",
  },
];
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-full">
    <el-space wrap>
      <OrganizationCard
        v-for="(organization, idx) in organizations"
        :name="organization.name"
        :category_id="organization.category_id"
        :org_id="organization.org_id"
        :key="idx"
      />
    </el-space>
    <el-pagination class="mt-auto" layout="prev, pager, next" :total="1" :page-size="50" />
  </div>
</template>
