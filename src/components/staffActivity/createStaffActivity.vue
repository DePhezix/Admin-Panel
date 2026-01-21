<script setup lang="ts">
import { onMounted, computed, ref, reactive } from "vue";
import { useOrganizationsStore } from "@/stores/organizations";
import { useStaffStore } from "@/stores/staff";
import { useActivitiesStore } from "@/stores/activities";
import { useStaffActivityStore } from "@/stores/staffActivity";
import { useRoute } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

interface formType {
  workerName: string | string[] | undefined;
  activityName: string;
  orgName: string | string[] | undefined;
}

interface optionsType {
  label: string;
  value: string;
}

const dialogVisible = defineModel();

const route = useRoute();

const organizationStore = useOrganizationsStore();
const staffStore = useStaffStore();
const activitiesStore = useActivitiesStore();
const staffActivityStore = useStaffActivityStore();

const formRef = ref<FormInstance>();
const form = reactive<formType>({
  workerName: route.params.staffId,
  activityName: "",
  orgName: route.params.organizationId,
});

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
  form.workerName = route.params.staffId;
  form.orgName = route.params.organizationId;
  form.activityName = "";
};

const rules = reactive<FormRules<formType>>({
  activityName: [
    {
      required: true,
      message: "Please select an activity",
      trigger: "blur",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await staffActivityStore.createStaffActivity(
          form.activityName,
          form.workerName,
          form.orgName
        );

        ElMessage({
          type: "success",
          message: "Created new staff activity!",
        });

        dialogVisible.value = false;

        await staffActivityStore.fetchStaffActivity(
          route.params.organizationId,
          route.params.staffId
        );
      } catch {
        ElMessage.error("Failed to create staff activity!");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const organizationOptions = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];
  organizationStore.organizations.forEach((organization) => {
    const option: optionsType = {
      label: "",
      value: "",
    };
    option.label = organization.name;
    option.value = organization.id;

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
  activitiesStore.activities.forEach((activity) => {
    const option: optionsType = {
      label: "",
      value: "",
    };
    option.label = activity.name;
    option.value = activity.id;

    tempOptions.push(option);
  });

  return tempOptions;
});

onMounted(async () => {
  if (!organizationStore.fetched) {
    await organizationStore.fetchOrganizations(route.params.categoryId);
  }

  if (!staffStore.fetched) {
    await staffStore.fetchStaff(route.params.organizationId);
  }

  if (!activitiesStore.fetched) {
    await activitiesStore.fetchActivities(route.params.organizationId);
  }
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Create new staff activity"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="Activity" prop="activityName">
        <el-select-v2 v-model="form.activityName" :options="activityOptions" />
      </el-form-item>
      <el-form-item label="Assigned to">
        <el-select-v2 v-model="form.workerName" :options="staffOptions" />
      </el-form-item>
      <el-form-item label="Organization">
        <el-select-v2 v-model="form.orgName" :options="organizationOptions" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button
          type="primary"
          @click="submitForm(formRef)"
          :loading="staffActivityStore.loading"
        >
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
