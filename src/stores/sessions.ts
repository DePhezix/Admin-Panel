import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useAuthStore } from "./index";
import axios from "axios";

import type { sessionsResponseType, sessionType } from "@/types/backend/index";

export const useSessionsStore = defineStore("sessions", () => {
  const authStore = useAuthStore();

  const sessions = ref<sessionType[]>([]);

  const loading = ref<boolean>(true);

  const currentPage = ref(1);
  const pageSize = ref<number>(Math.floor(window.innerHeight / 42.2) - 6);
  const totalSessions = ref<number>(0);
  const pageSizeMultiple = ref<number>(1);

  const filters = ref<string[]>(["Active", "Inactive"]);
  const checkedFilters = ref<string[]>(filters.value);
  const setCheckedFilters = (newFilter: string[]) => {
    checkedFilters.value = newFilter;
  };

  if (pageSize.value < 50 && pageSize.value >= 1) {
    while (pageSize.value * pageSizeMultiple.value < 50) {
      pageSizeMultiple.value++;
    }
  }

  const fetchSessions = async () => {
    loading.value = true;
    try {
      const response = await axios.get<sessionsResponseType>(
        `https://crm.humaid.co/api/worker-session?page=${
          currentPage.value > 1 ? currentPage.value / pageSizeMultiple.value : 1
        }&limit=${pageSize.value * pageSizeMultiple.value}${
          checkedFilters.value.length === 1
            ? `&active=${checkedFilters.value.includes("Active")}`
            : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );

      sessions.value = response.data.data;
      totalSessions.value = response.data.total;
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      loading.value = false;
    }
  };

  const createSessions = async (worker_id: string, activity_id: string, equipment_id: string) => {
    loading.value = true;
    try {
      await axios.post(
        "https://crm.humaid.co/api/worker-session",
        {
          worker_id,
          activity_id,
          equipment_id,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
    } catch (err) {
      throw Error("Failed to create sessions: " + err);
    } finally {
      loading.value = false;
    }
  };

  const deleteSession = async (sessionId: string) => {
    loading.value = true;
    try {
      axios.delete(`https://crm.humaid.co/api/worker-session/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    } catch (err) {
      throw Error("Failed to delete session: " + err);
    } finally {
      loading.value = false;
    }
  };

  const updateSession = async (
    sessionId: string,
    worker_id: string,
    activity_id: string,
    equipment_id: string,
    active: boolean,
  ) => {
    loading.value = true;
    try {
      await axios.put(
        `https://crm.humaid.co/api/worker-session/${sessionId}`,
        {
          worker_id,
          activity_id,
          equipment_id,
          active,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );
    } catch (err) {
      throw Error("Failed to update session: " + err);
    } finally {
      loading.value = false;
    }
  };

  const searchSession = async (searchID: string) => {
    loading.value = true;
    try {
      const response = await axios.get<sessionType>(
        `https://crm.humaid.co/api/worker-session/${searchID}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        },
      );

      sessions.value = [];
      sessions.value[0] = response.data;
    } catch (error) {
      console.error("Error fetching session", error);
      sessions.value = [];
    } finally {
      loading.value = false;
    }
  };

  watch(checkedFilters, () => {
    if (checkedFilters.value.length === 0) {
      sessions.value = [];
      return;
    }
    currentPage.value = 1;
    fetchSessions();
  });

  watch(currentPage, () => {
    if (currentPage.value * pageSize.value == currentPage.value * pageSizeMultiple.value) {
      fetchSessions();
    }
  });

  const displayedSessions = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sessions.value.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  const setPageSize = (newPageSize: number) => {
    pageSize.value = newPageSize;
  };

  return {
    loading,
    totalSessions,
    sessions,
    currentPage,
    pageSize,
    displayedSessions,
    filters,
    checkedFilters,
    setCurrentPage,
    setPageSize,
    setCheckedFilters,
    fetchSessions,
    searchSession,
    createSessions,
    deleteSession,
    updateSession,
  };
});
