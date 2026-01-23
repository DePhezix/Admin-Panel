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
  const fetched = ref<boolean>(false);

  const currentPage = ref(1);
  const pageSize = ref<number>(Math.floor(window.innerHeight / 45) - 6);
  const pageSizeMultiple = ref<number>(1);
  const totalActivities = ref<number>(0);

  if (pageSize.value < 50 && pageSize.value >= 1) {
    while (pageSize.value * pageSizeMultiple.value < 50) {
      pageSizeMultiple.value++;
    }
  }

  const fetchActivities = async (
    organizationId?: string | string[] | undefined,
    activityName?: string,
  ) => {
    loading.value = true;

    const response = await axios.get<responseType>(
      `https://crm.humaid.co/api/activity?page=${
        currentPage.value > 1 ? currentPage.value : 1
      }&limit=${pageSize.value * pageSizeMultiple.value}${organizationId ? `&org_id=${organizationId}` : ""}${
        activityName ? `&search=${activityName}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    );

    fetched.value = true;
    loading.value = false;

    totalActivities.value = response.data.total;
    activities.value = response.data.data;
  };

  const createActivity = async (name: string, org_id: string | string[]) => {
    loading.value = true;

    try {
      await axios.post(
        "https://crm.humaid.co/api/activity",
        {
          name,
          org_id,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
    } catch (err) {
      throw Error("Failed to create activity! " + err);
    } finally {
      loading.value = false;
    }
  };

  const deleteActivity = async (activityId: string) => {
    loading.value = true;

    try {
      axios.delete(`https://crm.humaid.co/api/activity/${activityId}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    } catch (err) {
      throw Error("Failed to delete activity! " + err);
    } finally {
      loading.value = false;
    }
  };

  const updateActivity = async (activityId: string, org_id?: string | string[], name?: string) => {
    loading.value = true;

    try {
      await axios.put(
        `https://crm.humaid.co/api/activity/${activityId}`,
        {
          org_id,
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
    } catch (err) {
      throw Error("failed activity update: " + err);
    } finally {
      loading.value = false;
    }
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
        },
      );

      return response.data;
    } finally {
      loading.value = false;
    }
  }

  return {
    fetched,
    loading,
    totalActivities,
    activities,
    displayedActivities,
    pageSize,
    currentPage,
    setCurrentPage,
    findActivity,
    fetchActivities,
    createActivity,
    deleteActivity,
    updateActivity,
  };
});
