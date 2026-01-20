<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";
import { watch, ref, computed, defineAsyncComponent } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useDebounceFn } from "@vueuse/core";
import { type CheckboxValueType } from "element-plus";
import { useCategoriesStore } from "@/stores/categories";
import { useOrganizationsStore } from "@/stores/organizations";
import { useStaffStore } from "@/stores/staff";
import { useActivitiesStore } from "@/stores/activities";
import { useStaffActivityStore } from "@/stores/staffActivity";

type navigationType = "Categories" | "Organization" | "Staff" | "Activity" | "Staff Activity";

const dialogComponents: Partial<Record<navigationType, ReturnType<typeof defineAsyncComponent>>> =
  {};

const authStore = useAuthStore();
const categoriesStore = useCategoriesStore();
const organizationStore = useOrganizationsStore();
const staffStore = useStaffStore();
const activityStore = useActivitiesStore();
const staffActivityStore = useStaffActivityStore();

const route = useRoute();

const search = ref<string>("");
const showCreateDialog = ref<boolean>(false);

const hasSearch: navigationType[] = ["Organization", "Staff", "Activity"];
const hasFilter: navigationType[] = ["Categories"];

const isIndeterminate = ref<boolean>(true);
const checkAll = ref(false);

const handleCheckAllChange = (val: CheckboxValueType) => {
  categoriesStore.setCheckedFilters(val ? categoriesStore.filters : []);
  isIndeterminate.value = false;
};

const handleCheckedFiltersChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === categoriesStore.filters.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < categoriesStore.filters.length;
};

const currentNav = computed<navigationType | undefined>(() => {
  if (!route.params.categoryId) return "Categories";
  if (!route.params.organizationId) return "Organization";
  if (route.params.staffId) return "Staff Activity";
  if (route.query.tab === "activity") return "Activity";
  return "Staff";
});

const CurrentDialogComponent = computed(() => {
  return currentNav.value && dialogComponents.hasOwnProperty(currentNav.value)
    ? dialogComponents[currentNav.value]
    : null;
});

const authorized = computed<boolean>(() => {
  if (currentNav.value === "Organization") {
    return authStore.userData.role === "admin";
  } else {
    return authStore.userData.role === "admin" || authStore.userData.role === "agent";
  }
});

const debouncedSearch = useDebounceFn((value: string) => {
  if (currentNav.value == "Organization") {
    organizationStore.fetchOrganizations(route.params.categoryId, value);
  } else if (currentNav.value == "Staff") {
    staffStore.fetchStaff(route.params.organizationId, value);
  } else {
    activityStore.fetchActivities(route.params.organizationId, value);
  }
}, 500);

const handleSearchChange = (value: string) => {
  search.value = value;
  debouncedSearch(value);
};

watch(currentNav, () => {
  search.value = "";
});
</script>

<template>
  <el-breadcrumb :separator-icon="ArrowRight" v-if="route.path.includes('categories')">
    <el-breadcrumb-item :to="{ path: '/categories' }">Categories</el-breadcrumb-item>
    <el-breadcrumb-item
      v-if="route.params.categoryId"
      :to="{
        name: 'organizations',
        params: {
          categoryId: route.params.categoryId,
        },
      }"
      >Organizations</el-breadcrumb-item
    >
    <el-breadcrumb-item
      v-if="route.params.organizationId && (!route.query.tab || route.query.tab === 'staff')"
      :to="{
        name: 'staff_and_activities',
        params: {
          categoryId: route.params.categoryId,
          organizationId: route.params.organizationId,
        },
      }"
      >Staff</el-breadcrumb-item
    >
    <el-breadcrumb-item
      v-if="route.params.organizationId && route.query.tab === 'activity'"
      :to="{
        name: 'staff_and_activities',
        params: {
          categoryId: route.params.categoryId,
          organizationId: route.params.organizationId,
        },
      }"
      >Activity</el-breadcrumb-item
    >
    <el-breadcrumb-item
      v-if="route.params.staffId"
      :to="{
        name: 'staff_activities',
        params: {
          categoryId: route.params.categoryId,
          organizationId: route.params.organizationId,
          staffId: route.params.staffId,
        },
      }"
      >Staff Activity</el-breadcrumb-item
    >
  </el-breadcrumb>
  <div class="ml-auto flex justify-end items-center gap-[20px]">
    <el-input
      :model-value="search"
      @input="handleSearchChange"
      :placeholder="`Search ${currentNav}`"
      clearable
      class="w-[250px]"
      v-if="currentNav && hasSearch.includes(currentNav)"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
    <el-popover trigger="click" :width="200" v-if="currentNav && hasFilter.includes(currentNav)">
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
          v-model="categoriesStore.checkedFilters"
          @change="handleCheckedFiltersChange"
        >
          <el-checkbox
            v-for="filter in categoriesStore.filters"
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
      <span> Add {{ currentNav && currentNav }} </span>
    </el-button>
  </div>
  <component
    :is="CurrentDialogComponent"
    v-if="CurrentDialogComponent && authorized"
    v-model="showCreateDialog"
  />
</template>
