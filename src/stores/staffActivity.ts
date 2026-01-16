import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { LocationQueryValue } from "vue-router";

interface staffActivtyType {
  id: string;
  activity_id: string | null;
  worker_id: string;
  org_id: string;
}

export const useStaffActivityStore = defineStore("staffActivity", () => {
  const staffActivity: staffActivtyType[] = [
    {
      id: "693a82d43bf72b000174e537",
      activity_id: "693a816f3bf72b000174e531",
      worker_id: "69279c24eae1e195b382120a",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "693a818b3bf72b000174e533",
      activity_id: "693a81723bf72b000174e532",
      worker_id: "69279c24eae1e195b382120a",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "693a72c73bf72b000174e529",
      activity_id: "69279c24eae1e195b382120a",
      worker_id: "69279c24eae1e195b382120a",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "69290c8e309e20000147d217",
      activity_id: null,
      worker_id: "69279c24eae1e195b382120a",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928da3108537c0001274f6f",
      activity_id: null,
      worker_id: "69279c24eae1e195b382120a",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6927a89770663f1aed333681",
      activity_id: null,
      worker_id: "69279c24eae1e195b382120a",
      org_id: "692796dd312469eb67874a7c",
    },
  ];

  const tableHeight = staffActivity.length * 42.2 + 120;

  const currentPage = ref(1);
  const pageSize = ref<number>(
    window.innerHeight < tableHeight ? Math.floor(window.innerHeight / 45) - 3 : staffActivity.length
  );

  const displayedStaffActivity = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return staffActivity.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  function findStaffActivity(staffActivityID: string | LocationQueryValue[]): staffActivtyType | undefined {
    return staffActivity.find((staffActivity) => staffActivity.id === staffActivityID);
  }

  return { staffActivity, displayedStaffActivity, pageSize, currentPage, setCurrentPage, findStaffActivity };
});
