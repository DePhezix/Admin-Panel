<script setup lang="ts">
import { reactive } from "vue";

type statusTypes = "ok" | "warning" | "critical";
interface formType {
  status: statusTypes;
  temperature: number;
  pressure: number;
}
const form = reactive<formType>({
  status: "ok",
  temperature: 25,
  pressure: 1013,
});

const getStatusType = (status: statusTypes) => {
  const types = {
    ok: "success",
    warning: "warning",
    critical: "danger",
  };
  return types[status] || "info";
};
</script>

<template>
  <div class="flex justify-center pt-[10%]">
    <el-card shadow="hover" class="w-[600px]">
      <template #header>
        <div class="flex items-center justify-between">
          <span style="font-weight: 600">POST Health Data</span>
          <el-tag :type="getStatusType(form.status)">{{ form.status.toUpperCase() }}</el-tag>
        </div>
      </template>

      <el-form :model="form" label-width="120px" label-position="left">
        <el-form-item label="System Status">
          <el-select v-model="form.status" placeholder="Select status" class="w-full">
            <el-option label="OK" value="ok" success>
              <span class="flex items-center gap-[8px]">
                <el-icon class="translate-y-[1.3px]" color="#67c23a"><Check /></el-icon>
                OK
              </span>
            </el-option>
            <el-option label="Warning" value="warning">
              <span class="flex items-center gap-[8px]">
                <el-icon class="translate-y-[1.3px]" color="#e6a23c"><Warning /></el-icon>
                Warning
              </span>
            </el-option>
            <el-option label="Critical" value="critical">
              <span class="flex items-center gap-[8px]">
                <el-icon class="translate-y-[1.3px]" color="#f56c6c"><Close /></el-icon>
                Critical
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Temperature">
          <el-input-number
            v-model="form.temperature"
            :min="-50"
            :max="100"
            :step="0.5"
            controls-position="right"
            class="w-full!"
          >
            <template #suffix>°C</template>
          </el-input-number>
        </el-form-item>

        <el-form-item label="Pressure">
          <el-input-number
            v-model="form.pressure"
            :min="900"
            :max="1100"
            :step="1"
            controls-position="right"
            class="w-full!"
          >
            <template #suffix>hPa</template>
          </el-input-number>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="w-full" size="large">
            <span class="flex gap-[10px]">
              <el-icon><Upload /></el-icon> Submit Data</span
            >
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
