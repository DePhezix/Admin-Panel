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

  const loading = ref<boolean>(true);
  const fetched = ref<boolean>(false);

  const currentPage = ref(1);
  const pageSize = ref<number>(Math.floor(window.innerHeight / 45) - 3);
  const pageSizeMultiple = ref<number>(1);
  const totalOrganizations = ref<number>(0);

  if (pageSize.value < 50 && pageSize.value >= 1) {
    while (pageSize.value * pageSizeMultiple.value < 50) {
      pageSizeMultiple.value++;
    }
  }

  const fetchOrganizations = async (
    categoryId: string | string[] | undefined,
    organizationName?: string
  ) => {
    loading.value = true;

    const response = await axios.get<responseType>(
      `https://crm.humaid.co/api/organization?page=${
        currentPage.value > 1 ? currentPage.value : 1
      }&limit=${pageSize.value * pageSizeMultiple.value}&category_id=${categoryId}${
        organizationName ? `&search=${organizationName}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    fetched.value = true;
    loading.value = false;

    organizations.value = response.data.data;
    totalOrganizations.value = response.data.total;
  };

  const createOrganization = async (organizationName: string, category_id?: string | string[]) => {
    loading.value = true;
    try {
      await axios.post(
        "https://crm.humaid.co/api/organization",
        { category_id: category_id, name: organizationName },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
    } finally {
      loading.value = false;
    }
  };

  const deleteOrganization = async (organizationId: string) => {
    loading.value = true;
    try {
      await axios.delete(`https://crm.humaid.co/api/organization/${organizationId}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
    } catch (err) {
      throw Error("failed to delete organization: " + err);
    } finally {
      loading.value = false;
    }
  };

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
    loading.value = true;

    try {
      const response = await axios.get<organizationType>(
        `https://crm.humaid.co/api/organization/${organizationID}`,
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
    totalOrganizations,
    organizations,
    displayedOrganizations,
    pageSize,
    currentPage,
    fetched,
    setCurrentPage,
    findOrganization,
    fetchOrganizations,
    createOrganization,
    deleteOrganization,
  };
});
