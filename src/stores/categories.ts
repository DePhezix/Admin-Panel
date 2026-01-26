import { defineStore } from "pinia";
import { watch, ref, computed } from "vue";
import { useAuthStore } from "./auth";
import type { LocationQueryValue } from "vue-router";
import axios from "axios";

import type { categoriesResponseType, categoryType } from "@/types/back/categoriesResponseTypes";

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<categoryType[]>([]);

  const authStore = useAuthStore();

  const loading = ref<boolean>(true);
  const fetched = ref<boolean>(false);

  const currentPage = ref(1);
  const pageSize = ref<number>(Math.floor(window.innerHeight / 45) - 3);
  const pageSizeMultiple = ref<number>(1);
  const totalCategories = ref<number>(0);

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

  const fetchCategories = async () => {
    loading.value = true;
    try {
      const response = await axios.get<categoriesResponseType>(
        `https://crm.humaid.co/api/category?page=${
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
        }
      );

      fetched.value = true;
      categories.value = response.data.data;
      totalCategories.value = response.data.total;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const displayedCategories = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return categories.value.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  async function findCategory(
    categoryID: string | LocationQueryValue[]
  ): Promise<categoryType | undefined> {
    loading.value = true;
    try {
      const response = await axios.get<categoryType>(
        `https://crm.humaid.co/api/category/${categoryID}`,
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

  async function searchCategory(categoryID: string | LocationQueryValue[]) {
    categories.value = [];
    const result = await findCategory(categoryID);
    if (result) {
      categories.value[0] = result;
    }
  }

  watch(checkedFilters, () => {
    if (checkedFilters.value.length === 0) {
      categories.value = [];
      return;
    }
    currentPage.value = 1;
    fetchCategories();
  });

  return {
    loading,
    totalCategories,
    categories,
    displayedCategories,
    pageSize,
    currentPage,
    filters,
    checkedFilters,
    fetched,
    setCurrentPage,
    findCategory,
    fetchCategories,
    searchCategory,
    setCheckedFilters,
  };
});
