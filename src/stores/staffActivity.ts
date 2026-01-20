import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";
import axios from "axios";
import type { LocationQueryValue } from "vue-router";

interface staffActivtyType {
  id: string;
  activity_id: string | null;
  worker_id: string;
  org_id: string;
}

interface responseType {
  data: staffActivtyType[];
  total: number;
  page: number;
  limit: number;
}

export const useStaffActivityStore = defineStore("staffActivity", () => {
  const authStore = useAuthStore();

  const staffActivity = ref<staffActivtyType[]>([]);

  const loading = ref<boolean>(true);

  const currentPage = ref(1);
  const pageSize = ref<number>(Math.floor(window.innerHeight / 45) - 3);
  const pageSizeMultiple = ref<number>(1);
  const totalStaffActivity = ref<number>(0);

  if (pageSize.value < 50 && pageSize.value >= 1) {
    while (pageSize.value * pageSizeMultiple.value < 50) {
      pageSizeMultiple.value++;
    }
  }

  const fetchStaffActivity = async (
    organizationId: string | string[] | undefined,
    staffId: string | string[] | undefined,
  ) => {
    loading.value = true;

    const response = await axios.get<responseType>(
      `https://crm.humaid.co/api/staff-activity?page=${
        currentPage.value > 1 ? currentPage.value : 1
      }&limit=${
        pageSize.value * pageSizeMultiple.value
      }&org_id=${organizationId}&worker_id=${staffId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    loading.value = false;

    totalStaffActivity.value = response.data.total;
    staffActivity.value = response.data.data;
  };

  const displayedStaffActivity = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return staffActivity.value.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  async function findStaffActivity(
    staffActivityID: string | LocationQueryValue[]
  ): Promise<staffActivtyType | undefined> {
    loading.value = true;

    try {
      const response = await axios.get<staffActivtyType>(
        `https://crm.humaid.co/api/staff-activity/${staffActivityID}`,
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

  return {
    loading,
    totalStaffActivity,
    staffActivity,
    displayedStaffActivity,
    pageSize,
    currentPage,
    setCurrentPage,
    findStaffActivity,
    fetchStaffActivity,
  };
});
