<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, defineAsyncComponent } from "vue";

type sideNavigationType =
  | "categories"
  | "organizations"
  | "staff"
  | "activity"
  | "staff activity"
  | "worker session"
  | "analytics"
  | "health check";

const sideNavigationArr: sideNavigationType[] = [
  "categories",
  "organizations",
  "staff",
  "activity",
  "staff activity",
  "worker session",
  "analytics",
  "health check",
];

const hasSearch: sideNavigationType[] = [
  "categories",
  "organizations",
  "staff",
  "activity",
  "staff activity",
  "worker session",
];

const dialogComponents: Partial<
  Record<sideNavigationType, ReturnType<typeof defineAsyncComponent>>
> = {
  organizations: defineAsyncComponent(() => import("@/components/organizations/createOrganization.vue")),
  staff: defineAsyncComponent(() => import("@/components/staff/createStaff.vue")),
  activity: defineAsyncComponent(() => import("@/components/activity/createActivity.vue")),
  "staff activity": defineAsyncComponent(() => import("@/components/staffActivity/createStaffActivity.vue")),
  "worker session": defineAsyncComponent(() => import("@/components/workerSession/createWorkSession.vue")),
};

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const search = ref<string>("");
const showCreateDialog = ref<boolean>(false);

const handleSignOut = () => {
  authStore.signOutUser();
  router.push("/login");
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
  if (currentNav.value === "organizations") {
    return authStore.userRole === "admin";
  } else {
    return authStore.userRole === "admin" || authStore.userRole === "agent";
  }
});
</script>

<template>
  <el-header
    class="w-[calc(100%-300px)] flex justify-between items-center gap-[20px] fixed top-[0]"
  >
    <el-button primary @click="showCreateDialog = true" v-if="CurrentDialogComponent && authorized">
      Create new {{ currentNav }}
    </el-button>
    <div class="ml-auto flex justify-end items-center gap-[20px]">
      <el-input
        v-model="search"
        :placeholder="`Search for ${currentNav}`"
        clearable
        class="w-[250px]"
        v-if="currentNav && hasSearch.includes(currentNav)"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-dropdown>
        <el-avatar>
          <el-icon><Avatar /></el-icon>
        </el-avatar>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Role: {{ authStore.userRole }}</el-dropdown-item>
            <el-dropdown-item
              ><el-button type="danger" plain @click="handleSignOut"
                >Sign Out</el-button
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <component
      :is="CurrentDialogComponent"
      v-if="CurrentDialogComponent && authorized"
      v-model="showCreateDialog"
    />
  </el-header>
</template>
