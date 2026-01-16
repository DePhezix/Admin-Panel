import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface workerSessionType {
  id: string;
  worker: string;
  activity: string;
  equipment: string;
  agent: string;
  status: boolean;
  created: Date;
}

export const useSessionsStore = defineStore("sessions", () => {
  const sessions = ref<workerSessionType[]>([
    {
      id: "69279c24eae1e195b382120a",
      worker: "John Doe",
      activity: "Welding",
      equipment: "EQ-001",
      agent: "Sarah Johnson",
      status: true,
      created: new Date("2025-01-15T08:30:00"),
    },
    {
      id: "1927ed24eae1e195b3821bd",
      worker: "Jane Smith",
      activity: "Assembly",
      equipment: "EQ-002",
      agent: "Michael Chen",
      status: false,
      created: new Date("2025-01-15T09:15:00"),
    },
    {
      id: "a3f8bc45def2e195b382130c",
      worker: "Robert Martinez",
      activity: "Quality Control",
      equipment: "EQ-003",
      agent: "Sarah Johnson",
      status: true,
      created: new Date("2025-01-15T07:45:00"),
    },
    {
      id: "5d829f16ghi3e195b382141d",
      worker: "Emily Davis",
      activity: "Painting",
      equipment: "EQ-004",
      agent: "David Park",
      status: true,
      created: new Date("2025-01-15T10:00:00"),
    },
    {
      id: "8b341e27jkl4e195b382152e",
      worker: "Michael Brown",
      activity: "Machining",
      equipment: "EQ-005",
      agent: "Michael Chen",
      status: false,
      created: new Date("2025-01-14T14:20:00"),
    },
    {
      id: "c9452a38mno5e195b382163f",
      worker: "Sarah Wilson",
      activity: "Packaging",
      equipment: "EQ-006",
      agent: "Sarah Johnson",
      status: true,
      created: new Date("2025-01-15T11:30:00"),
    },
    {
      id: "f1563b49pqr6e195b382174g",
      worker: "James Anderson",
      activity: "Welding",
      equipment: "EQ-007",
      agent: "David Park",
      status: true,
      created: new Date("2025-01-15T08:00:00"),
    },
    {
      id: "2d674c5stu7e195b382185h",
      worker: "Lisa Thompson",
      activity: "Testing",
      equipment: "EQ-008",
      agent: "Michael Chen",
      status: false,
      created: new Date("2025-01-14T16:45:00"),
    },
    {
      id: "4e785d6vwx8e195b382196i",
      worker: "David Garcia",
      activity: "Maintenance",
      equipment: "EQ-009",
      agent: "Sarah Johnson",
      status: true,
      created: new Date("2025-01-15T06:30:00"),
    },
    {
      id: "6f896e7yz9e195b3821a7j",
      worker: "Maria Rodriguez",
      activity: "Assembly",
      equipment: "EQ-010",
      agent: "David Park",
      status: true,
      created: new Date("2025-01-15T09:00:00"),
    },
    {
      id: "89a07f8abc0e195b3821b8k",
      worker: "Christopher Lee",
      activity: "Inspection",
      equipment: "EQ-011",
      agent: "Michael Chen",
      status: false,
      created: new Date("2025-01-13T13:15:00"),
    },
    {
      id: "9ab18g9bcd1e195b3821c9l",
      worker: "Amanda Taylor",
      activity: "Cutting",
      equipment: "EQ-012",
      agent: "Sarah Johnson",
      status: true,
      created: new Date("2025-01-15T10:45:00"),
    },
    {
      id: "abc29h0cde2e195b3821dam",
      worker: "Daniel White",
      activity: "Drilling",
      equipment: "EQ-013",
      agent: "David Park",
      status: true,
      created: new Date("2025-01-15T07:15:00"),
    },
    {
      id: "bcd3ai1def3e195b3821ebn",
      worker: "Jessica Martinez",
      activity: "Polishing",
      equipment: "EQ-014",
      agent: "Michael Chen",
      status: false,
      created: new Date("2025-01-14T15:30:00"),
    },
    {
      id: "cde4bj2efg4e195b3821fco",
      worker: "Kevin Harris",
      activity: "Welding",
      equipment: "EQ-015",
      agent: "Sarah Johnson",
      status: true,
      created: new Date("2025-01-15T08:45:00"),
    },
    {
      id: "def5ck3fgh5e195b3821gdp",
      worker: "Nicole Clark",
      activity: "Quality Control",
      equipment: "EQ-016",
      agent: "David Park",
      status: true,
      created: new Date("2025-01-15T11:00:00"),
    },
    {
      id: "efg6dl4ghi6e195b3821heq",
      worker: "Ryan Lewis",
      activity: "Assembly",
      equipment: "EQ-017",
      agent: "Michael Chen",
      status: false,
      created: new Date("2025-01-12T10:20:00"),
    },
    {
      id: "fgh7em5hij7e195b3821ifr",
      worker: "Stephanie Walker",
      activity: "Painting",
      equipment: "EQ-018",
      agent: "Sarah Johnson",
      status: true,
      created: new Date("2025-01-15T09:30:00"),
    },
    {
      id: "ghi8fn6ijk8e195b3821jgs",
      worker: "Brandon Hall",
      activity: "Fabrication",
      equipment: "EQ-019",
      agent: "David Park",
      status: true,
      created: new Date("2025-01-15T07:00:00"),
    },
    {
      id: "hij9go7jkl9e195b3821kht",
      worker: "Michelle Allen",
      activity: "Testing",
      equipment: "EQ-020",
      agent: "Michael Chen",
      status: false,
      created: new Date("2025-01-14T14:45:00"),
    },
    {
      id: "ijk0hp8klm0e195b3821liu",
      worker: "Jason Young",
      activity: "Machining",
      equipment: "EQ-021",
      agent: "Sarah Johnson",
      status: true,
      created: new Date("2025-01-15T10:15:00"),
    },
    {
      id: "jkl1iq9lmn1e195b3821mjv",
      worker: "Rachel King",
      activity: "Packaging",
      equipment: "EQ-022",
      agent: "David Park",
      status: true,
      created: new Date("2025-01-15T11:45:00"),
    },
    {
      id: "klm2jr0mno2e195b3821nkw",
      worker: "Timothy Wright",
      activity: "Welding",
      equipment: "EQ-023",
      agent: "Michael Chen",
      status: false,
      created: new Date("2025-01-13T16:00:00"),
    },
    {
      id: "lmn3ks1nop3e195b3821olx",
      worker: "Vanessa Scott",
      activity: "Inspection",
      equipment: "EQ-024",
      agent: "Sarah Johnson",
      status: true,
      created: new Date("2025-01-15T08:15:00"),
    },
    {
      id: "mno4lt2opq4e195b3821pmy",
      worker: "Gregory Green",
      activity: "Assembly",
      equipment: "EQ-025",
      agent: "David Park",
      status: true,
      created: new Date("2025-01-15T09:45:00"),
    },
  ]);

  const tableHeight = sessions.value.length * 42.2 + 160;

  const currentPage = ref(1);
  const pageSize = ref<number>(
    window.innerHeight < tableHeight
      ? Math.floor(window.innerHeight / 42.2) - 6
      : sessions.value.length
  );

  const filters = ref<string[]>(["Active", "Inactive"]);
  const checkedFilters = ref<string[]>(filters.value);
  const setCheckedFilters = (newFilter: string[]) => {
    checkedFilters.value = newFilter;
  };

  const filteredSessions = computed(() => {
    if (checkedFilters.value.length === 0) {
      return [];
    }

    if (checkedFilters.value.length === 2) {
      return sessions.value;
    }

    const showActive = checkedFilters.value.includes("Active");
    return sessions.value.filter((session) => session.status === showActive);
  });

  const displayedSessions = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredSessions.value.slice(start, end);
  });

  const setCurrentPage = (page: number) => {
    currentPage.value = page;
  };

  const setPageSize = (newPageSize: number) => {
    pageSize.value = newPageSize;
  };

  return {
    sessions,
    filteredSessions,
    currentPage,
    pageSize,
    displayedSessions,
    filters,
    checkedFilters,
    setCurrentPage,
    setPageSize,
    setCheckedFilters,
  };
});
