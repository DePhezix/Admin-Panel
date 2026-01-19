import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "./auth";
import type { LocationQueryValue } from "vue-router";
import axios from "axios";

interface categoryType {
  id: string;
  name: string;
  active: boolean;
}

interface responseType {
  data: categoryType[];
  total: number;
  page: number;
  limit: number;
}

export const useCategoriesStore = defineStore("categories", () => {
  const categories = ref<categoryType[]>([]);

  const authStore = useAuthStore();

  const currentPage = ref(1);
  const pageSize = ref<number>(Math.floor(window.innerHeight / 45) - 3);
  const pageSizeMultiple = ref<number>(1);
  const totalCategories = ref<number>(0);

  if (pageSize.value < 50 && pageSize.value >= 1) {
    while (pageSize.value * pageSizeMultiple.value < 50) {
      pageSizeMultiple.value++;
    }
  }

  const fetchCategories = async () => {
    const response = await axios.get<responseType>(
      `https://crm.humaid.co/api/category?page=${
        currentPage.value > 1 ? currentPage.value / pageSizeMultiple.value : 1
      }&limit=${pageSize.value * pageSizeMultiple.value}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      }
    );

    categories.value = response.data.data;
    totalCategories.value = response.data.total;
  };

  const displayedCategories = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return categories.value.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  async function findCategory(categoryID: string | LocationQueryValue[]): Promise<categoryType | undefined> {
    const response = await axios.get<categoryType>(
      `https://crm.humaid.co/api/category/${categoryID}`,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })

    return response.data
  }

  return { totalCategories, categories, displayedCategories, pageSize, currentPage, setCurrentPage, findCategory, fetchCategories };
});
