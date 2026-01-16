import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { LocationQueryValue } from "vue-router";

interface categoryType {
  id: string;
  name: string;
  active: boolean;
}

export const useCategoriesStore = defineStore("categories", () => {
  const categories: categoryType[] = [
    {
      id: "692791d2d294efeb67d9b7fb",
      name: "Assembly",
      active: true,
    },
    {
      id: "692791d2ea1eaeeb67efe2af",
      name: "Catering",
      active: true,
    },
    {
      id: "692791d2ec179aeb672da380",
      name: "Cooking",
      active: true,
    },
    {
      id: "692791d2cfe307eb67160aa6",
      name: "Healthcare",
      active: true,
    },
    {
      id: "692791d21f93bbeb6723483d",
      name: "Hospitality",
      active: true,
    },
    {
      id: "692791d25c1d37eb67169661",
      name: "Hotel",
      active: true,
    },
    {
      id: "692791d22caaeceb6734f083",
      name: "Industry",
      active: true,
    },
    {
      id: "692791d26b302deb67795356",
      name: "Kitchen",
      active: true,
    },
    {
      id: "692791d25cb075eb6725b10e",
      name: "Logistics",
      active: true,
    },
    {
      id: "692791d2287391eb67cac072",
      name: "Manufacturing",
      active: true,
    },
    {
      id: "692791d21388cdeb67274c9e",
      name: "Metallurgy",
      active: true,
    },
    {
      id: "692791d2d6e042eb67376562",
      name: "Mining",
      active: true,
    },
    {
      id: "692791d2b32a0deb6732fc15",
      name: "Restaurant",
      active: true,
    },
    {
      id: "692791d2d294efeb67d9b7fb",
      name: "Assembly",
      active: true,
    },
    {
      id: "692791d2ea1eaeeb67efe2af",
      name: "Catering",
      active: true,
    },
    {
      id: "692791d2ec179aeb672da380",
      name: "Cooking",
      active: true,
    },
    {
      id: "692791d2cfe307eb67160aa6",
      name: "Healthcare",
      active: true,
    },
    {
      id: "692791d21f93bbeb6723483d",
      name: "Hospitality",
      active: true,
    },
    {
      id: "692791d25c1d37eb67169661",
      name: "Hotel",
      active: true,
    },
  ];
  

  const tableHeight = categories.length * 42.2 + 120;

  const currentPage = ref(1);
  const pageSize = ref<number>(
    window.innerHeight < tableHeight ? Math.floor(window.innerHeight / 45) - 3 : categories.length
  );

  const displayedCategories = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return categories.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  function findCategory(categoryID: string | LocationQueryValue[] ): categoryType | undefined {
    return categories.find(category => category.id === categoryID)
  }

  return { categories, displayedCategories, pageSize, currentPage, setCurrentPage, findCategory };
});
