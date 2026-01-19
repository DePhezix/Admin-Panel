import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";
import type { LocationQueryValue } from "vue-router";
import axios from "axios";

interface organizationType {
  id: string;
  name: string;
}

interface responseType {
  data: organizationType[];
  total: number;
  page: number;
  limit: number;
}

export const useOrganizationsStore = defineStore("organizations", () => {
  const authStore = useAuthStore();

  const organizations = ref<organizationType[]>([]);

  const currentPage = ref(1);
  const pageSize = ref<number>(Math.floor(window.innerHeight / 45) - 3);
  const pageSizeMultiple = ref<number>(1);
  const totalOrganizations = ref<number>(0);

  if (pageSize.value < 50 && pageSize.value >= 1) {
    while (pageSize.value * pageSizeMultiple.value < 50) {
      pageSizeMultiple.value++;
    }
  }

  const fetchOrganizations = async (categoryId: string | string[] | undefined) => {
    const response = await axios.get<responseType>(
      `https://crm.humaid.co/api/organization?page=${
        currentPage.value > 1 ? currentPage.value : 1
    }&limit=${pageSize.value * pageSizeMultiple.value}&category_id=${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    organizations.value = response.data.data;
    totalOrganizations.value = response.data.total;
  }

  const displayedOrganizations = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return organizations.value.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  async function findOrganization(
    organizationID: string | LocationQueryValue[]
  ): Promise<organizationType | undefined> {
    const response = await axios.get<organizationType>(
      `https://crm.humaid.co/api/organization/${organizationID}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })

    return response.data
  }

  return {
    totalOrganizations,
    organizations,
    displayedOrganizations,
    pageSize,
    currentPage,
    setCurrentPage,
    findOrganization,
    fetchOrganizations
  };
});
