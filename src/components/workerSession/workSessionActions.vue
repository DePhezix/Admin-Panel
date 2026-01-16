<script setup lang="ts">
import { reactive, ref } from "vue";
import { useSessionsStore } from "@/stores/sessions";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, EditPen } from "@element-plus/icons-vue";

const props = defineProps({
  workerSessionId: String,
  workerName: String,
  activityName: String,
  equipmentName: String,
  status: Boolean
});

interface formType {
  workerName: string;
  activityName: string;
  equipmentName: string;
  active: boolean;
}

const sessionStore = useSessionsStore()

const editOpen = ref<boolean>(false);
const workerName = ref<string>(props.workerName ?? "");
const activityName = ref<string>(props.activityName ?? "");
const equipmentName = ref<string>(props.equipmentName ?? "");
const form = reactive<formType>({
  workerName: workerName.value ?? "",
  activityName: activityName.value ?? "",
  equipmentName: equipmentName.value ?? "",
  active: props.status,
});

const resetForm = () => {
  form.workerName = workerName.value ?? "";
  form.activityName = activityName.value ?? "";
  form.equipmentName = equipmentName.value ?? "";
  form.active = props.status;
};

const handleClose = () => {
  editOpen.value = false;
  resetForm();
};

const deleteWorkerSession = () => {
  ElMessageBox.confirm(
    `You are attempting to delete ${props.workerName}'s work session. Continue?`,
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
  <el-button-group direction="horizontal">
    <el-button :icon="EditPen" @click="editOpen = true" />
    <el-button :icon="Delete" type="danger" @click="deleteWorkerSession()" />
  </el-button-group>
  <el-dialog v-model="editOpen" title="Edit Work Session" :before-close="handleClose" append-to-body>
    <el-form :model="form" label-width="150px">
      <el-form-item label="Session">
        <el-input :value="workerSessionId" disabled>
          <template #prefix>#</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Staff Name">
        <el-select v-model="form.workerName">
          <el-option
            v-for="(item, index) in sessionStore.sessions"
            :key="index"
            :label="item.worker"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity">
        <el-select v-model="form.activityName">
          <el-option
            v-for="(item, index) in sessionStore.sessions"
            :key="index"
            :label="item.activity"
            :value="item.activity"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Equipment ">
        <el-select v-model="form.equipmentName">
          <el-option
            v-for="(item, index) in sessionStore.sessions"
            :key="index"
            :label="item.equipment"
            :value="item.equipment"
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
