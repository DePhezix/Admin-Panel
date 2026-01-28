<script setup lang="ts">
import { useSessionsStore, useAuthStore } from "@/stores/index";
import { ref, computed, defineAsyncComponent } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { type CheckboxValueType } from "element-plus";

const authStore = useAuthStore();
const sessionsStore = useSessionsStore();

const search = ref<string>("");
const showCreateDialog = ref<boolean>(false);

const isIndeterminate = ref<boolean>(true);
const checkAll = ref(false);

const handleCheckAllChange = (val: CheckboxValueType) => {
  sessionsStore.setCheckedFilters(val ? sessionsStore.filters : []);
  isIndeterminate.value = false;
};

const handleCheckedFiltersChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === sessionsStore.filters.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < sessionsStore.filters.length;
};

const CurrentDialogComponent = computed(() => {
  return defineAsyncComponent(() => import("./createWorkSession.vue"));
});

const authorized = computed<boolean>(() => {
  return authStore.userData.role === "admin" || authStore.userData.role === "agent";
});

const debouncedSearch = useDebounceFn((value: string) => {
  sessionsStore.searchSession(value);
}, 500);

const handleSearchChange = (value: string) => {
  search.value = value;
  if (value.length > 0) {
    debouncedSearch(value);
  } else {
    sessionsStore.fetchSessions();
  }
};
</script>

<template>
  <div class="ml-auto flex justify-end items-center gap-[20px]">
    <el-input
      :model-value="search"
      @input="handleSearchChange"
      placeholder="Search Sessions"
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
      <div class="flex flex-col gap-2">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >
          Filter All
        </el-checkbox>
        <el-checkbox-group
          v-model="sessionsStore.checkedFilters"
          @change="handleCheckedFiltersChange"
        >
          <el-checkbox
            v-for="filter in sessionsStore.filters"
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
      <span> Add Session </span>
    </el-button>
  </div>
  <component
    :is="CurrentDialogComponent"
    v-if="CurrentDialogComponent && authorized"
    v-model="showCreateDialog"
  />
</template>
