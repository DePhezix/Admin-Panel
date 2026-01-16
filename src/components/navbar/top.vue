<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useSessionsStore } from "@/stores/sessions";
import { useRoute } from "vue-router";
import { ref, computed, defineAsyncComponent } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import type { CheckboxValueType } from "element-plus";

type sideNavigationType = "dashboard" | "categories" | "equipment" | "sessions" | "settings";

const sideNavigationArr: sideNavigationType[] = [
  "dashboard",
  "categories",
  "equipment",
  "sessions",
  "settings",
];

const createName: Partial<Record<sideNavigationType, string>> = {
  sessions: "Session",
};

const hasSearch: sideNavigationType[] = ["categories", "sessions"];

const dialogComponents: Partial<
  Record<sideNavigationType, ReturnType<typeof defineAsyncComponent>>
> = {
  sessions: defineAsyncComponent(() => import("@/components/workerSession/createWorkSession.vue")),
};

const authStore = useAuthStore();
const filtersStore = useSessionsStore();
const route = useRoute();

const search = ref<string>("");
const showCreateDialog = ref<boolean>(false);

const isIndeterminate = ref<boolean>(true);
const checkAll = ref(false);

const handleCheckAllChange = (val: CheckboxValueType) => {
  filtersStore.setCheckedFilters(val ? filtersStore.filters : []);
  isIndeterminate.value = false;
};

const handleCheckedFiltersChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === filtersStore.filters.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < filtersStore.filters.length;
};

const currentNavIdx = computed<number>(() => {
  const currentPath = route.path.split("_").join(" ").slice(1);
  const idxOfPath = sideNavigationArr.findIndex((item) => item === currentPath);

  return idxOfPath;
});

const currentNav = computed<sideNavigationType | undefined>(
  () => sideNavigationArr[currentNavIdx.value]
);

const CurrentDialogComponent = computed(() => {
  return currentNav.value && dialogComponents.hasOwnProperty(currentNav.value)
    ? dialogComponents[currentNav.value]
    : null;
});

const authorized = computed<boolean>(() => {
  /*   if (currentNav.value === "organizations") {
    return authStore.userRole === "admin";
  } else { */
  return authStore.userRole === "admin" || authStore.userRole === "agent";
  /*   }
   */
});
</script>

<template>
  <el-header class="w-full justify-self-end flex justify-between items-center gap-[20px]">
    <el-breadcrumb :separator-icon="ArrowRight" v-if="route.path === '/categories'">
      <el-breadcrumb-item :to="{ path: '/categories' }">Categories</el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="route.query.category"
        :to="{
          path: '/categories',
          query: {
            category: route.query.category,
          },
        }"
        >Organizations</el-breadcrumb-item
      >
      <el-breadcrumb-item
        v-if="route.query.organization && (!route.query.tab || route.query.tab === 'staff')"
        :to="{
          path: '/categories',
          query: {
            category: route.query.category,
            organization: route.query.organization,
          },
        }"
        >Staff</el-breadcrumb-item
      >
      <el-breadcrumb-item
        v-if="route.query.organization &&route.query.tab === 'activity'"
        :to="{
          path: '/categories',
          query: {
            category: route.query.category,
            organization: route.query.organization,
          },
        }"
        >Activity</el-breadcrumb-item
      >
      <el-breadcrumb-item
        v-if="route.query.staff"
        :to="{
          path: '/categories',
          query: {
            category: route.query.category,
            organization: route.query.organization,
            staff: route.query.staff,
            activity: route.query.activity,
          },
        }"
        >Staff Activity</el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="ml-auto flex justify-end items-center gap-[20px]">
      <el-input
        v-model="search"
        :placeholder="`Search ${currentNav}`"
        clearable
        class="w-[250px]"
        v-if="currentNav && hasSearch.includes(currentNav)"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-popover trigger="click" :width="200" v-if="currentNav && hasSearch.includes(currentNav)">
        <template #reference>
          <el-button>
            <div class="flex gap-[5px] items-center">
              <el-icon><Filter /></el-icon>
              <el-text>Filters</el-text>
            </div>
          </el-button>
        </template>
        <div class="flex flex-col gap-2">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            Filter All
          </el-checkbox>
          <el-checkbox-group
            v-model="filtersStore.checkedFilters"
            @change="handleCheckedFiltersChange"
          >
            <el-checkbox
              v-for="filter in filtersStore.filters"
              :key="filter"
              :label="filter"
              :value="filter"
            >
              {{ filter }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-popover>
      <el-button
        type="primary"
        @click="showCreateDialog = true"
        v-if="CurrentDialogComponent && authorized"
        class="flex gap-[5px] items-center !m-[0]"
      >
        <el-icon><Plus /></el-icon>
        <span> Add {{ currentNav ? createName[currentNav] : currentNav }} </span>
      </el-button>
    </div>
    <component
      :is="CurrentDialogComponent"
      v-if="CurrentDialogComponent && authorized"
      v-model="showCreateDialog"
    />
  </el-header>
</template>
