<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";
import { ref, computed, defineAsyncComponent } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useDebounceFn } from "@vueuse/core";
import { type CheckboxValueType } from "element-plus";

type navigationType = "Categories" | "Organization" | "Staff" | "Activity" | "Staff Activity";

const dialogComponents: Partial<Record<navigationType, ReturnType<typeof defineAsyncComponent>>> =
  {};

const authStore = useAuthStore();
const route = useRoute();

const search = ref<string>("");
const showCreateDialog = ref<boolean>(false);

const isIndeterminate = ref<boolean>(true);
const checkAll = ref(false);

/* const handleCheckAllChange = (val: CheckboxValueType) => {
  sessionsStore.setCheckedFilters(val ? sessionsStore.filters : []);
  isIndeterminate.value = false;
};

const handleCheckedFiltersChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === sessionsStore.filters.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < sessionsStore.filters.length;
}; */

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
  /*   if (currentNav.value === "organizations") {
    return authStore.userData.role === "admin";
  } else { */
  return authStore.userData.role === "admin" || authStore.userData.role === "agent";
  /*   }
   */
});

const debouncedSearch = useDebounceFn((value: string) => {
  /*   sessionsStore.searchSession(value);
   */
}, 500);

const handleSearchChange = (value: string) => {
  search.value = value;
  if (value.length > 0) {
    debouncedSearch(value);
  } else {
    /*     sessionsStore.fetchSessions();
     */
  }
};
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
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
    <el-popover trigger="click" :width="200">
      <template #reference>
        <el-button>
          <div class="flex gap-[5px] items-center">
            <el-icon><Filter /></el-icon>
            <el-text>Filters</el-text>
          </div>
        </el-button>
      </template>
      <div class="flex flex-col gap-2"></div>
    </el-popover>
    <el-button
      type="primary"
      @click="showCreateDialog = true"
      v-if="CurrentDialogComponent && authorized"
      class="flex gap-[5px] items-center !m-[0]"
    >
      <el-icon><Plus /></el-icon>
      <span> Add {{ currentNav }} </span>
    </el-button>
  </div>
  <component
    :is="CurrentDialogComponent"
    v-if="CurrentDialogComponent && authorized"
    v-model="showCreateDialog"
  />
</template>
