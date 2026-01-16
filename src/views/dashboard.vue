<template>
  <div>
    <div class="flex flex-col w-full gap-[20px]">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :lg="6" v-for="card in cards" :key="card.title">
          <el-card shadow="hover" :body-style="{ padding: '24px' }">
            <el-space direction="vertical" :size="16" class="w-full">
              <div class="flex justify-between items-center gap-[50px]">
                <el-avatar :size="48" :style="{ backgroundColor: card.color }">
                  <el-icon :size="24">
                    <component :is="card.icon" />
                  </el-icon>
                </el-avatar>
                <el-tag
                  :type="card.tagType"
                  size="large"
                  effect="plain"
                  class="text-[20px] font-[600]"
                >
                  {{ calculatePercentage(card.covered, card.total) }}%
                </el-tag>
              </div>

              <el-descriptions label-width="100" :title="card.title" :column="1">
                <el-descriptions-item label="Covered">
                  <el-text class="font-[600]">{{ card.covered }}</el-text>
                </el-descriptions-item>
                <el-descriptions-item label="Total">
                  <el-text class="font-[600]">{{ card.total }}</el-text>
                </el-descriptions-item>
              </el-descriptions>
            </el-space>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="never" class="w-[75%] mx-auto">
        <template #header>
          <el-text size="large" class="font-[600]">Summary</el-text>
        </template>
        <el-row :gutter="24">
          <el-col :xs="12" :md="6">
            <el-statistic title="Total Covered" :value="totalCovered">
              <template #prefix>
                <el-icon style="color: #67c23a" class="translate-y-[3px]">
                  <CircleCheck />
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
          <el-col :xs="12" :md="6">
            <el-statistic title="Total Items" :value="totalItems">
              <template #prefix>
                <el-icon style="color: #409eff" class="translate-y-[3px]">
                  <DataLine />
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
          <el-col :xs="12" :md="6">
            <el-statistic
              title="Overall Coverage"
              :value="overallCoverage"
              suffix="%"
              :precision="1"
            >
              <template #prefix>
                <el-icon style="color: #e6a23c" class="translate-y-[3px]">
                  <TrendCharts />
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
          <el-col :xs="12" :md="6">
            <el-statistic title="Categories" :value="4">
              <template #prefix>
                <el-icon style="color: #9c27b0" class="translate-y-[3px]">
                  <Grid />
                </el-icon>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  OfficeBuilding,
  User,
  UserFilled,
  TrendCharts,
  CircleCheck,
  DataLine,
  Grid,
} from "@element-plus/icons-vue";

const stats = {
  organizations: { total_org: 17, covered_org: 1 },
  workers: { total_worker: 16, covered_worker: 2 },
  agents: { total_agent: 5, covered_agent: 0 },
  activities: { total_activity: 18, covered_activity: 6 },
};

const cards = [
  {
    title: "Organizations",
    icon: OfficeBuilding,
    total: stats.organizations.total_org,
    covered: stats.organizations.covered_org,
    color: "#409EFF",
    tagType: "primary",
  },
  {
    title: "Workers",
    icon: User,
    total: stats.workers.total_worker,
    covered: stats.workers.covered_worker,
    color: "#67C23A",
    tagType: "success",
  },
  {
    title: "Agents",
    icon: UserFilled,
    total: stats.agents.total_agent,
    covered: stats.agents.covered_agent,
    color: "#9C27B0",
    tagType: "warning",
  },
  {
    title: "Activities",
    icon: TrendCharts,
    total: stats.activities.total_activity,
    covered: stats.activities.covered_activity,
    color: "#E6A23C",
    tagType: "danger",
  },
];

const calculatePercentage = (covered: number, total: number) => {
  return total > 0 ? ((covered / total) * 100).toFixed(1) : "0.0";
};

const totalCovered = computed(
  () =>
    stats.organizations.covered_org +
    stats.workers.covered_worker +
    stats.agents.covered_agent +
    stats.activities.covered_activity
);

const totalItems = computed(
  () =>
    stats.organizations.total_org +
    stats.workers.total_worker +
    stats.agents.total_agent +
    stats.activities.total_activity
);

const overallCoverage = computed(() =>
  parseFloat(calculatePercentage(totalCovered.value, totalItems.value))
);
</script>
