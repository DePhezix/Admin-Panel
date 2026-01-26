<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const userInfo = authStore.userData;

const getRoleType = (role: string) => {
  const roleTypes: Record<string, string> = {
    admin: "danger",
    agent: "warning",
    user: "info",
  };
  return roleTypes[role] || "info";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const logOut = () => {
  authStore.signOutUser();
  window.location.reload();
};
</script>

<template>
  <div class="settings-page p-6">
    <el-card>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">Account Information</span>
          <el-button type="danger" @click="logOut">
            <span class="flex gap-[5px] items-center">
              <el-icon><SwitchButton /></el-icon> Logout
            </span>
          </el-button>
        </div>
      </template>

      <el-skeleton :loading="authStore.loading"  animated>
        <template #template>
          <el-descriptions label-width="150" :column="2" border>
            <el-descriptions-item v-for="n in 6" :key="n">
              <el-skeleton-item />
            </el-descriptions-item>
          </el-descriptions>
        </template>
        <template #default>
          <el-descriptions label-width="150" :column="2" border>
            <el-descriptions-item label="ID">
              {{ userInfo.id }}
            </el-descriptions-item>

            <el-descriptions-item label="Name">
              {{ userInfo.name }} {{ userInfo.surname }}
            </el-descriptions-item>

            <el-descriptions-item label="Email">
              <div class="flex items-center gap-[5px]">
                {{ userInfo.email }}
                <el-tag v-if="userInfo.email_verified" type="success" size="small">
                  Verified
                </el-tag>
                <el-tag v-else type="warning" size="small"> Not Verified </el-tag>
              </div>
            </el-descriptions-item>

            <el-descriptions-item label="Role">
              <el-tag :type="userInfo.role ? getRoleType(userInfo.role) : 'info'">
                {{ userInfo.role && userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1) }}
              </el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="Language">
              {{ userInfo.language }}
            </el-descriptions-item>

            <el-descriptions-item label="Created At">
              {{userInfo.created_at && formatDate(userInfo.created_at) }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>
