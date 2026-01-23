<script setup lang="ts">
import { onMounted, computed, ref, reactive } from "vue";
import { useStaffStore } from "@/stores/staff";
import { useSessionsStore } from "@/stores/sessions";
import { useActivitiesStore } from "@/stores/activities";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

interface formType {
  workerName: string;
  activityName: string;
  equipmentName: string;
  active: boolean;
}

interface optionsType {
  label: string;
  value: string;
}

const dialogVisible = defineModel();

const sessionStore = useSessionsStore();
const staffStore = useStaffStore();
const activitiesStore = useActivitiesStore();

const formRef = ref<FormInstance>();
const form = reactive<formType>({
  workerName: "",
  activityName: "",
  equipmentName: "",
  active: false,
});

const rules = reactive<FormRules<formType>>({
  workerName: [
    {
      required: true,
      message: "Please select a staff member",
      trigger: "blur",
    },
  ],
  activityName: [
    {
      required: true,
      message: "Please select an activity",
      trigger: "blur",
    },
  ],
  equipmentName: [
    {
      required: true,
      message: "Please select an equipment",
      trigger: "blur",
    },
  ],
});

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await sessionStore.createSessions(form.workerName, form.activityName, form.equipmentName);

        ElMessage({
          type: "success",
          message: "Created new work session!",
        });

        dialogVisible.value = false;

        await sessionStore.fetchSessions();
      } catch {
        ElMessage.error("Failed to create session!");
      }
    } else {
      console.log("error submit!", fields);
    }
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

onMounted(async () => {
  await staffStore.fetchStaff();

  await activitiesStore.fetchActivities();
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Create new work session"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="Staff Name" prop="workerName">
        <el-select-v2 v-model="form.workerName" :options="staffOptions" />
      </el-form-item>
      <el-form-item label="Activity" prop="activityName">
        <el-select-v2 v-model="form.activityName" :options="activityOptions" />
      </el-form-item>
      <el-form-item label="Equipment" prop="equipmentName">
        <el-select v-model="form.equipmentName" :options="equipmentOptions" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)" :loading="sessionStore.loading">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
