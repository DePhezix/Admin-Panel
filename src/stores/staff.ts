import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { LocationQueryValue } from "vue-router";

interface staffType {
  id: string;
  name: string;
  surname: string;
  org_id: string;
}

export const useStaffStore = defineStore("staff", () => {
  const staff: staffType[] = [
    {
      id: "69279c24eae1e195b382120a",
      name: "Anvar",
      surname: "Aliyev",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "693a82b43bf72b000174e536",
      name: "Anvar",
      surname: "Aliyev",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928d9cf08537c0001274f6e",
      name: "John",
      surname: "Doe",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928dd6d08537c0001274f70",
      name: "Shoshi",
      surname: "Qanot",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928ddd108537c0001274f71",
      name: "cvdn",
      surname: "dnn",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "69279c24eae1e195b382120a",
      name: "Anvar",
      surname: "Aliyev",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "693a82b43bf72b000174e536",
      name: "Anvar",
      surname: "Aliyev",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928d9cf08537c0001274f6e",
      name: "John",
      surname: "Doe",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928dd6d08537c0001274f70",
      name: "Shoshi",
      surname: "Qanot",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928ddd108537c0001274f71",
      name: "cvdn",
      surname: "dnn",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "69279c24eae1e195b382120a",
      name: "Anvar",
      surname: "Aliyev",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "693a82b43bf72b000174e536",
      name: "Anvar",
      surname: "Aliyev",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928d9cf08537c0001274f6e",
      name: "John",
      surname: "Doe",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928dd6d08537c0001274f70",
      name: "Shoshi",
      surname: "Qanot",
      org_id: "692796dd312469eb67874a7c",
    },
    {
      id: "6928ddd108537c0001274f71",
      name: "cvdn",
      surname: "dnn",
      org_id: "692796dd312469eb67874a7c",
    },
  ];

  const tableHeight = staff.length * 42.2 + 240;

  const currentPage = ref(1);
  const pageSize = ref<number>(
    window.innerHeight < tableHeight ? Math.floor(window.innerHeight / 45) - 6: staff.length
  );

  const displayedStaff = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return staff.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  function findStaff(staffID: string | LocationQueryValue[]): staffType | undefined {
    return staff.find((s) => s.id === staffID);
  }

  return {
    staff,
    displayedStaff,
    pageSize,
    currentPage,
    setCurrentPage,
    findStaff,
  };
});
