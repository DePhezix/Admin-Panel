import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";
import axios from "axios";

import type { LocationQueryValue } from "vue-router";

interface staffType {
  id: string;
  name: string;
  surname: string;
  org_id: string;
}

interface responseType {
  data: staffType[];
  total: number;
  page: number;
  limit: number;
}

export const useStaffStore = defineStore("staff", () => {
  const authStore = useAuthStore();

  const staff = ref<staffType[]>([]);
  
  const fetched = ref<boolean>(false)
  const loading = ref<boolean>(true);

  const currentPage = ref(1);
  const pageSize = ref<number>(Math.floor(window.innerHeight / 45) - 6);
  const pageSizeMultiple = ref<number>(1);
  const totalStaff = ref<number>(0);

  if (pageSize.value < 50 && pageSize.value >= 1) {
    while (pageSize.value * pageSizeMultiple.value < 50) {
      pageSizeMultiple.value++;
    }
  }

  const fetchStaff = async (organizationId: string | string[] | undefined, staffName?: string) => {
    loading.value = true;

    const response = await axios.get<responseType>(
      `https://crm.humaid.co/api/staff?page=${
        currentPage.value > 1 ? currentPage.value : 1
      }&limit=${pageSize.value * pageSizeMultiple.value}&org_id=${organizationId}${
        staffName ? `&search=${staffName}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    fetched.value = true
    loading.value = false;

    totalStaff.value = response.data.total;
    staff.value = response.data.data;
  };

  const createStaff = async (name: string, surname: string, org_id?: string | string[]) => {
    loading.value = true;

    try {
      await axios.post(
        "https://crm.humaid.co/api/staff",
        {
          name,
          surname,
          org_id,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
    } catch (err) {
      throw Error("creating staff failed! " + err);
    } finally {
      loading.value = false;
    }
  };

  const deleteStaff = async (staffId: string) => {
    loading.value = true;

    try {
      await axios.delete(
        `https://crm.humaid.co/api/staff/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
    } catch (err) {
      throw Error("delete staff failed! " + err);
    } finally {
      loading.value = false;
    }
  };

  const displayedStaff = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return staff.value.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  async function findStaff(staffID: string | LocationQueryValue[]): Promise<staffType | undefined> {
    loading.value = true;

    try {
      const response = await axios.get<staffType>(`https://crm.humaid.co/api/staff/${staffID}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });

      return response.data;
    } finally {
      loading.value = false;
    }
  }

  return {
    fetched,
    loading,
    totalStaff,
    staff,
    displayedStaff,
    pageSize,
    currentPage,
    setCurrentPage,
    findStaff,
    fetchStaff,
    createStaff,
    deleteStaff
  };
});
