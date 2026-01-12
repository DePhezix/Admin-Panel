<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  worker_session_id: String,
  worker_id: String,
  activity_id: String,
  equipment_id: String,
  active: Boolean,
});

interface formType {
  workerName: string;
  activityName: string;
  equipmentName: string;
  active: boolean;
}

const tempWork: { [key: number]: string } = {
  1: "John Doe",
  2: "Jane Doe",
};
const tempActivity: { [key: number]: string } = {
  1: "TV assembly",
  2: "Phone assembly",
};
const tempEquipment: { [key: number]: string } = {
  1: "Lenovo Think Pad T120",
  2: "Macbook Air M3",
};

const authStore = useAuthStore();

const editOpen = ref<boolean>(false);
const workerName = ref<string>(tempWork[Number(props.worker_id)] ?? "");
const activityName = ref<string>(tempActivity[Number(props.activity_id)] ?? "");
const equipmentName = ref<string>(tempEquipment[Number(props.equipment_id)] ?? "");
const form = reactive<formType>({
  workerName: workerName.value ?? "",
  activityName: activityName.value ?? "",
  equipmentName: equipmentName.value ?? "",
  active: props.active,
});

const resetForm = () => {
  form.workerName = workerName.value ?? "";
  form.activityName = activityName.value ?? "";
  form.equipmentName = equipmentName.value ?? "";
  form.active = props.active;
};

const handleClose = () => {
  editOpen.value = false;
  resetForm();
};

const deleteWorkerSession = () => {
  ElMessageBox.confirm(
    `You are attempting to delete work session #${props.worker_id}. Continue?`,
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
      :title="`Worker Session #${worker_session_id}`"
    >
      <template #extra>
        <el-tag :type="props.active ? 'success' : 'danger'" size="small">{{
          props.active ? "Active" : "Inactive"
        }}</el-tag>
      </template>
      <el-descriptions-item>
        <template #label> Staff: </template>
        {{ workerName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> Activity: </template>
        {{ activityName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> Equipment: </template>
        {{ equipmentName }}
      </el-descriptions-item>
    </el-descriptions>

    <template #footer v-if="authStore.userRole === 'admin' || authStore.userRole === 'agent'">
      <el-button-group class="flex w-full justify-center">
        <el-button type="primary" class="w-1/2" @click="editOpen = true"> Edit </el-button>
        <el-button type="danger" class="w-1/2" plain @click="deleteWorkerSession()">
          Delete
        </el-button>
      </el-button-group>
    </template>
  </el-card>
  <el-dialog v-model="editOpen" title="Edit Work Session" :before-close="handleClose">
    <el-form :model="form" label-width="150px">
      <el-form-item label="Session">
        <el-input :value="worker_session_id" disabled>
          <template #prefix>#</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Staff Name">
        <el-select v-model="form.workerName">
          <el-option
            v-for="(item, index) in Object.values(tempWork)"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
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
      <el-form-item label="Equipment ">
        <el-select v-model="form.equipmentName">
          <el-option
            v-for="(item, index) in Object.values(tempEquipment)"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-switch
          v-model="form.active"
          size="large"
          active-text="Active"
          inactive-text="Inactive"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
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
