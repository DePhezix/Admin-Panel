import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { LocationQueryValue } from "vue-router";

interface organizationType {
  id: string;
  name: string;
}

export const useOrganizationsStore = defineStore("organizations", () => {
  const organizations: organizationType[] = [
    {
      id: "6928cb646551650001bb3a8f",
      name: "Acme Corporatio",
    },
    {
      id: "6927972808e40c4d65735f16",
      name: "Hilton",
    },
  ];

  const tableHeight = organizations.length * 42.2 + 120;

  const currentPage = ref(1);
  const pageSize = ref<number>(
    window.innerHeight < tableHeight
      ? Math.floor(window.innerHeight / 45) - 3
      : organizations.length
  );

  const displayedOrganizations = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return organizations.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  function findOrganization(
    organizationID: string | LocationQueryValue[]
  ): organizationType | undefined {
    return organizations.find((organization) => organization.id === organizationID);
  }

  return {
    organizations,
    displayedOrganizations,
    pageSize,
    currentPage,
    setCurrentPage,
    findOrganization,
  };
});
