import { defineStore } from "pinia";
import { reactive, computed, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "./auth";

import type { analayticsResponseType } from "@/types/back/analyticsResponseTypes";

export const useAnalyticsStore = defineStore("analytics", () => {
  const analytics = reactive<analayticsResponseType>({
    organizations: {
      total_org: 0,
      covered_org: 0,
    },
    workers: {
      total_worker: 0,
      covered_worker: 0,
    },
    agents: {
      total_agent: 0,
      covered_agent: 0,
    },
    activities: {
      total_activity: 0,
      covered_activity: 0,
    },
  });
  const authStore = useAuthStore();

  const loading = ref<boolean>(true);

  const fetchAnalytics = async () => {
    loading.value = true;
    try {
      const response = await axios.get<analayticsResponseType>(
        "https://crm.humaid.co/api/analytics/general-stats",
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );

      Object.assign(analytics, response.data);
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const calculatePercentage = (covered: number, total: number) => {
    return total > 0 ? ((covered / total) * 100).toFixed(1) : "0.0";
  };

  const totalCovered = computed(
    () =>
      analytics.organizations.covered_org +
      analytics.workers.covered_worker +
      analytics.agents.covered_agent +
      analytics.activities.covered_activity
  );

  const totalItems = computed(
    () =>
      analytics.organizations.total_org +
      analytics.workers.total_worker +
      analytics.agents.total_agent +
      analytics.activities.total_activity
  );

  const overallCoverage = computed(() =>
    parseFloat(calculatePercentage(totalCovered.value, totalItems.value))
  );

  return {
    loading,
    analytics,
    totalCovered,
    totalItems,
    overallCoverage,
    fetchAnalytics,
    calculatePercentage,
  };
});
