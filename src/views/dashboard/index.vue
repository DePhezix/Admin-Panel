<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAnalyticsStore } from "@/stores/analytics";
import {
  OfficeBuilding,
  User,
  UserFilled,
  TrendCharts,
  CircleCheck,
  DataLine,
  Grid,
} from "@element-plus/icons-vue";

import type { dashboardCardType } from "@/types/front/dashboardTypes";

const analyticsStore = useAnalyticsStore();

onMounted(async () => {
  await analyticsStore.fetchAnalytics();
});

const cards = computed<dashboardCardType[]>(() => [
  {
    title: "Organizations",
    icon: OfficeBuilding,
    total: analyticsStore.analytics.organizations.total_org,
    covered: analyticsStore.analytics.organizations.covered_org,
    color: "#409EFF",
    tagType: "primary",
  },
  {
    title: "Workers",
    icon: User,
    total: analyticsStore.analytics.workers.total_worker,
    covered: analyticsStore.analytics.workers.covered_worker,
    color: "#67C23A",
    tagType: "success",
  },
  {
    title: "Agents",
    icon: UserFilled,
    total: analyticsStore.analytics.agents.total_agent,
    covered: analyticsStore.analytics.agents.covered_agent,
    color: "#9C27B0",
    tagType: "warning",
  },
  {
    title: "Activities",
    icon: TrendCharts,
    total: analyticsStore.analytics.activities.total_activity,
    covered: analyticsStore.analytics.activities.covered_activity,
    color: "#E6A23C",
    tagType: "danger",
  },
]);
</script>

<template>
  <div>
    <div class="flex flex-col w-full gap-[20px]">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :lg="6" v-for="card in cards" :key="card.title">
          <el-card shadow="hover" :body-style="{ padding: '24px' }">
            <el-skeleton :loading="analyticsStore.loading" animated>
              <template #template>
                <div class="flex flex-col gap-4">
                  <div class="flex justify-between items-center gap-12">
                    <el-skeleton animated class="w-12">
                      <template #template>
                        <el-skeleton-item variant="circle" class="w-12 h-12" />
                      </template>
                    </el-skeleton>

                    <el-skeleton animated class="w-20">
                      <template #template>
                        <el-skeleton-item variant="text" class="h-8" />
                      </template>
                    </el-skeleton>
                  </div>
                  <el-skeleton animated :rows="3" />
                </div>
              </template>
              <template #default>
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
                      {{ analyticsStore.calculatePercentage(card.covered, card.total) }}%
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
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="never" class="w-[75%] mx-auto">
        <template #header>
          <el-text size="large" class="font-[600]">Summary</el-text>
        </template>
        <el-skeleton :loading="analyticsStore.loading" animated>
          <template #template>
            <el-row :gutter="24">
              <el-col :xs="12" :md="6" v-for="n in 4" :key="n">
                <el-skeleton-item />
              </el-col>
            </el-row>
          </template>
          <template #default>
            <el-row :gutter="24">
              <el-col :xs="12" :md="6">
                <el-statistic title="Total Covered" :value="analyticsStore.totalCovered">
                  <template #prefix>
                    <el-icon style="color: #67c23a" class="translate-y-[3px]">
                      <CircleCheck />
                    </el-icon>
                  </template>
                </el-statistic>
              </el-col>
              <el-col :xs="12" :md="6">
                <el-statistic title="Total Items" :value="analyticsStore.totalItems">
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
                  :value="analyticsStore.overallCoverage"
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
          </template>
        </el-skeleton>
      </el-card>
    </div>
  </div>
</template>
