<script setup lang="ts">
import { watch, onMounted, computed, ref, reactive } from "vue";
import { useStaffStore } from "@/stores/staff";
import { useSessionsStore } from "@/stores/sessions";
import { useStaffActivityStore } from "@/stores/staffActivity";
import { useOrganizationsStore } from "@/stores/organizations";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

import type { optionsType } from "@/types/front/generalTypes";
import type { createSessionFormType } from "@/types/front/sessionsTypes";

const dialogVisible = defineModel();

const sessionStore = useSessionsStore();
const staffStore = useStaffStore();
const staffActivityStore = useStaffActivityStore();
const organizationStore = useOrganizationsStore();

const formRef = ref<FormInstance>();
const form = reactive<createSessionFormType>({
  workerName: "",
  activityName: "",
  equipmentName: "",
  organization: "",
  active: false,
});

const rules = reactive<FormRules<createSessionFormType>>({
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

const organizationOptions = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];
  organizationStore.organizations.forEach((st) => {
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
  staffActivityStore.staffActivity.forEach((st) => {
    const option: optionsType = {
      label: "",
      value: "",
    };
    option.label = st.activity_name;
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

    option.label = `EQ-` + idx.toString().padStart(3, "0");
    option.value = idx.toString();

    tempOptions.push(option);
  });

  return tempOptions;
});

onMounted(async () => {
  organizationStore.fetchOrganizations();
});

watch(
  () => form.organization,
  async () => {
    form.activityName = "";
    form.workerName = "";
    await staffStore.fetchStaff(form.organization);
    await staffActivityStore.fetchStaffActivity(form.organization, form.workerName);
  },
);

watch(
  () => form.workerName,
  async () => {
    form.activityName = "";
    await staffActivityStore.fetchStaffActivity(form.organization, form.workerName);
  },
);
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Create new work session"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-form ref="formRef" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="Organization" prop="organization">
        <el-select-v2 v-model="form.organization" :options="organizationOptions" />
      </el-form-item>
      <el-form-item label="Staff Name" prop="workerName">
        <el-select-v2
          v-model="form.workerName"
          :options="staffOptions"
          :disabled="form.organization.length === 0"
        />
      </el-form-item>
      <el-form-item label="Activity" prop="activityName">
        <el-select-v2
          v-model="form.activityName"
          :options="activityOptions"
          :disabled="form.organization.length === 0 || form.workerName.length === 0"
        />
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
