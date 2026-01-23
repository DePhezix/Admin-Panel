<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useStaffStore } from "@/stores/staff";
import { useSessionsStore } from "@/stores/sessions";
import { useActivitiesStore } from "@/stores/activities";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, EditPen } from "@element-plus/icons-vue";

const props = defineProps({
  workerSessionId: String,
  workerName: String,
  activityId: String,
  equipmentName: String,
  status: Boolean,
  activityName: String,
});

interface optionsType {
  label: string;
  value: string;
}

interface formType {
  workerName: string;
  activityId: string;
  equipmentName: string;
  active: boolean;
}

const sessionStore = useSessionsStore();
const staffStore = useStaffStore();
const activitiesStore = useActivitiesStore();

const editOpen = ref<boolean>(false);
const form = reactive<formType>({
  workerName: props.workerName ?? "",
  activityId: props.activityId ?? "",
  equipmentName: props.equipmentName ?? "",
  active: props.status,
});

const resetForm = () => {
  form.workerName = props.workerName ?? "";
  form.activityId = props.activityId ?? "";
  form.equipmentName = props.equipmentName ?? "";
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
    },
  )
    .then(async () => {
      try {
        if (props.workerSessionId) {
          await sessionStore.deleteSession(props.workerSessionId);
          ElMessage({
            type: "success",
            message: "Delete completed",
          });

          await sessionStore.fetchSessions();
        }
      } catch {
        ElMessage.error("Deleting Failed!");
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};

const staffOptions = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];
  staffStore.staff.forEach((st) => {
    const option: optionsType = {
      label: "",
      value: "",
    };
    option.label = st.name + " " + st.surname;
    option.value = st.id;

    tempOptions.push(option);
  });

  return tempOptions;
});

const activityOptions = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];

  if (props.activityId && (props.activityName || props.activityName == null)) {
    tempOptions.push({
      label: props.activityName,
      value: props.activityId,
    });
  }

  activitiesStore.activities.forEach((st) => {
    const option: optionsType = {
      label: "",
      value: "",
    };
    option.label = st.name;
    option.value = st.id;

    tempOptions.push(option);
  });

  return tempOptions;
});

const equipmentOptions = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];
  Array.from({ length: 1000 }).map((_, idx) => {
    const option: optionsType = {
      label: "",
      value: "",
    };
    const equipment = `EQ-` + idx.toString().padStart(3, "0");
    option.label = equipment;
    option.value = equipment;

    tempOptions.push(option);
  });

  return tempOptions;
});

const handleEditConfirm = async () => {
  if (props.workerSessionId) {
    try {
      await sessionStore.updateSession(
        props.workerSessionId,
        form.workerName,
        form.activityId,
        form.equipmentName,
        form.active,
      );

      editOpen.value = false;

      ElMessage({
        type: "success",
        message: "Updated Staff",
      });

      await sessionStore.fetchSessions();
    } catch {
      ElMessage.error("Failed to update staff");
    }
  } else {
    editOpen.value = false;
  }
};
</script>

<template>
  <el-button-group direction="horizontal">
    <el-button :icon="EditPen" @click="editOpen = true" />
    <el-button :icon="Delete" type="danger" @click="deleteWorkerSession()" />
  </el-button-group>
  <el-dialog
    v-model="editOpen"
    title="Edit Work Session"
    :before-close="handleClose"
    append-to-body
  >
    <el-form :model="form" label-width="150px">
      <el-form-item label="Session">
        <el-input :value="workerSessionId" disabled>
          <template #prefix>#</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Staff Name">
        <el-select-v2 v-model="form.workerName" :options="staffOptions" />
      </el-form-item>
      <el-form-item label="Activity">
        <el-select-v2 v-model="form.activityId" :options="activityOptions" />
      </el-form-item>
      <el-form-item label="Equipment ">
        <el-select-v2 v-model="form.equipmentName" :options="equipmentOptions" />
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
        <el-button type="primary" @click="handleEditConfirm" :loading="sessionStore.loading">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
