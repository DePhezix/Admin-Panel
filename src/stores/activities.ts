import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";
import axios from "axios";

interface activityType {
  id: string;
  name: string;
  org_id: string;
}

interface responseType {
  data: activityType[];
  total: number;
  page: number;
  limit: number;
}

export const useActivitiesStore = defineStore("activities", () => {
  const authStore = useAuthStore();

  const activities = ref<activityType[]>([]);

  const loading = ref<boolean>(true);

  const currentPage = ref(1);
  const pageSize = ref<number>(Math.floor(window.innerHeight / 45) - 6);
  const pageSizeMultiple = ref<number>(1);
  const totalActivities = ref<number>(0);

  if (pageSize.value < 50 && pageSize.value >= 1) {
    while (pageSize.value * pageSizeMultiple.value < 50) {
      pageSizeMultiple.value++;
    }
  }

  const fetchActivities = async (organizationId: string | string[] | undefined) => {
    loading.value = true;

    const response = await axios.get<responseType>(
      `https://crm.humaid.co/api/activity?page=${
        currentPage.value > 1 ? currentPage.value : 1
      }&limit=${pageSize.value * pageSizeMultiple.value}&org_id=${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    loading.value = false;

    totalActivities.value = response.data.total;
    activities.value = response.data.data;
  };

  const displayedActivities = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return activities.value.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  async function findActivity(activityID: string | null): Promise<activityType | undefined> {
    loading.value = true;

    try {
      const response = await axios.get<activityType>(
        `https://crm.humaid.co/api/activity/${activityID}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );

      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function searchActivity(activityID: string | null) {
    activities.value = [];
    const response = await findActivity(activityID);

    if (response) {
      activities.value[0] = response;
    }
  }

  return {
    loading,
    totalActivities,
    activities,
    displayedActivities,
    pageSize,
    currentPage,
    setCurrentPage,
    findActivity,
    fetchActivities,
    searchActivity,
  };
});
