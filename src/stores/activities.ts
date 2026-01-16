import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { LocationQueryValue } from "vue-router";

interface activityType {
  id: string;
  name: string;
  org_id: string;
}

export const useActivitiesStore = defineStore("activities", () => {
  const activities: activityType[] = [
    {
      id: "6940257b57e1f40001a16c85",
      name: "dfdsasgagasga",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6940250157e1f40001a16c83",
      name: "vsdbsdbsdb",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "693a7eac3bf72b000174e52c",
      name: "TV Assembly",
      org_id: "692796dd312469eb67874a7c",
    },
  ];

  const tableHeight = activities.length * 42.2 + 240;

  const currentPage = ref(1);
  const pageSize = ref<number>(
    window.innerHeight < tableHeight ? Math.floor(window.innerHeight / 45) - 6 : activities.length
  );

  const displayedActivities = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return activities.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  function findActivity(activityID: string | LocationQueryValue[]): activityType | undefined {
    return activities.find((s) => s.id === activityID);
  }

  return {
    activities,
    displayedActivities,
    pageSize,
    currentPage,
    setCurrentPage,
    findActivity,
  };
});
