import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore, useActivitiesStore } from "./index";
import axios from "axios";

import type { LocationQueryValue } from "vue-router";
import type {
  completeStaffActivityType,
  staffActivityResponseType,
  staffActivtyType,
} from "@/types/backend/index";

export const useStaffActivityStore = defineStore("staffActivity", () => {
  const authStore = useAuthStore();
  const activitiesStore = useActivitiesStore();

  const staffActivity = ref<completeStaffActivityType[]>([]);

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

    const response = await axios.get<staffActivityResponseType>(
      `https://crm.humaid.co/api/staff-activity?page=${
        currentPage.value > 1 ? currentPage.value : 1
      }&limit=${
        pageSize.value * pageSizeMultiple.value
      }&org_id=${organizationId}&worker_id=${staffId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    loading.value = false;

    totalStaffActivity.value = response.data.total;
    staffActivity.value = [];

    response.data.data.map(async (data) => {
      let activityName = "";
      if (data.activity_id) {
        try {
          const activity = await activitiesStore.findActivity(data.activity_id);
          if (activity && activity.name) {
            activityName = activity.name;
          }
        } catch (error) {
          console.error(`Failed to fetch activity ${data.activity_id}:`, error);
        }
      }

      staffActivity.value.push({
        id: data.id,
        activity_id: data.activity_id,
        activity_name: activityName,
        worker_id: data.worker_id,
        org_id: data.org_id,
      });
    });
  };

  const createStaffActivity = async (
    activity_id: string,
    worker_id?: string | string[],
    org_id?: string | string[],
  ) => {
    loading.value = true;
    try {
      await axios.post(
        "https://crm.humaid.co/api/staff-activity",
        {
          activity_id,
          worker_id,
          org_id,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
    } catch (err) {
      throw Error("Failed to create staff activity! " + err);
    } finally {
      loading.value = false;
    }
  };

  const deleteStaffActivity = async (staffActivityId: string) => {
    loading.value = true;

    try {
      axios.delete(`https://crm.humaid.co/api/staff-activity/${staffActivityId}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    } catch (err) {
      throw Error("Failed to delete! " + err);
    } finally {
      loading.value = false;
    }
  };

  const updateStaffActivity = async (
    staffActivityId: string,
    activity_id?: string,
    worker_id?: string | string[],
    org_id?: string | string[],
  ) => {
    loading.value = true;

    try {
      axios.put(
        `https://crm.humaid.co/api/staff-activity/${staffActivityId}`,
        {
          activity_id,
          worker_id,
          org_id,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
    } catch (err) {
      throw Error("Failed to delete! " + err);
    } finally {
      loading.value = false;
    }
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
    staffActivityID: string | LocationQueryValue[],
  ): Promise<staffActivtyType | undefined> {
    loading.value = true;

    try {
      const response = await axios.get<staffActivtyType>(
        `https://crm.humaid.co/api/staff-activity/${staffActivityID}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
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
    createStaffActivity,
    deleteStaffActivity,
    updateStaffActivity,
  };
});
