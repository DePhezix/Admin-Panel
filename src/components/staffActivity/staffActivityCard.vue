<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  staff_activity_id: String,
  worker_id: String,
  activity_id: String,
  org_id: String,
});

interface formType {
  workerName: string;
  activityName: string;
  orgName: string;
}

const tempWork: { [key: number]: string } = {
  1: "John Doe",
  2: "Jane Doe",
};
const tempActivity: { [key: number]: string } = {
  1: "TV assembly",
  2: "Phone assembly",
};
const tempOrg: { [key: number]: string } = {
  1: "Akfa",
  2: "CAU",
};

const authStore = useAuthStore();

const editOpen = ref<boolean>(false);
const workerName = ref<string>(tempWork[Number(props.worker_id)] ?? "");
const activityName = ref<string>(tempActivity[Number(props.activity_id)] ?? "");
const orgName = ref<string>(tempOrg[Number(props.org_id)] ?? "");
const form = reactive<formType>({
  workerName: workerName.value ?? "",
  activityName: activityName.value ?? "",
  orgName: orgName.value ?? "",
});

const resetForm = () => {
  form.workerName = workerName.value ?? "";
  form.activityName = activityName.value ?? "";
  form.orgName = orgName.value ?? "";
};

const handleClose = () => {
  editOpen.value = false;
  resetForm();
};

const deleteStaffActivity = () => {
  ElMessageBox.confirm(
    `You are attempting to delete staff activity #${props.staff_activity_id}. Continue?`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
      ElMessage({
        type: "success",
        message: "Delete completed",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};
</script>

<template>
  <el-card shadow="hover" class="min-w-[350px]">
    <el-descriptions
      label-width="120px"
      :column="1"
      border
      :title="`Staff Activity #${staff_activity_id}`"
    >
      <el-descriptions-item>
        <template #label> Activity: </template>
        {{ activityName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> Assigned to: </template>
        {{ workerName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> Organization: </template>
        {{ orgName }}
      </el-descriptions-item>
    </el-descriptions>

    <template #footer v-if="authStore.userRole === 'admin' || authStore.userRole === 'agent'">
      <el-button-group class="flex w-full justify-center">
        <el-button type="primary" class="w-1/2" @click="editOpen = true"> Edit </el-button>
        <el-button type="danger" class="w-1/2" plain @click="deleteStaffActivity">
          Delete
        </el-button>
      </el-button-group>
    </template>
  </el-card>
  <el-dialog v-model="editOpen" title="Edit Staff Activity" :before-close="handleClose">
    <el-form :model="form" label-width="150px">
      <el-form-item label="Staff Activity ID">
        <el-input :value="staff_activity_id" disabled>
          <template #prefix>#</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Activity">
        <el-select v-model="form.activityName">
          <el-option
            v-for="(item, index) in Object.values(tempActivity)"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Assigned to">
        <el-select v-model="form.workerName">
          <el-option
            v-for="(item, index) in Object.values(tempWork)"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Organization">
        <el-select v-model="form.orgName">
          <el-option
            v-for="(item, index) in Object.values(tempOrg)"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="editOpen = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>
