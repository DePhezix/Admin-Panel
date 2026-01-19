import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useAuthStore } from "./auth";
import axios from "axios";

interface workerSessionType {
  id: string;
  worker: {
    id: string;
    name: string;
    surname: string;
  };
  activity: {
    id: string;
    name: string;
  };
  equipment_id: string;
  agent: {
    id: string;
    name: string;
    surname: string;
  };
  active: boolean;
  created_at: Date;
}

interface responseType {
  data: workerSessionType[];
  total: number;
  page: number;
  limit: number;
}

export const useSessionsStore = defineStore("sessions", () => {
  const authStore = useAuthStore();

  const sessions = ref<workerSessionType[]>([]);

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
    try {
      const response = await axios.get<responseType>(
        `https://crm.humaid.co/api/worker-session?page=${
          currentPage.value > 1 ? currentPage.value / pageSizeMultiple.value : 1
        }&limit=${pageSize.value * pageSizeMultiple.value}${checkedFilters.value.length === 1 ? `&active=${checkedFilters.value.includes("Active")}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );

      sessions.value = response.data.data;
      totalSessions.value = response.data.total;
    } catch (error) {
      console.error("Error fetching sessions:", error);
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
  };
});
