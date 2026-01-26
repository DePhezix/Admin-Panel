<script setup lang="ts">
import { onMounted, computed, ref, reactive } from "vue";
import { useOrganizationsStore } from "@/stores/organizations";
import { useActivitiesStore } from "@/stores/activities";
import { useRoute } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

import type { optionsType } from "@/types/front/generalTypes";
import type { activityFormType } from "@/types/front/activityTypes";

const dialogVisible = defineModel();

const route = useRoute();
const organizationStore = useOrganizationsStore();
const activitiesStore = useActivitiesStore();

const formRef = ref<FormInstance>();
const form = reactive<activityFormType>({
  name: "",
  orgName: route.params.organizationId,
});

const rules = reactive<FormRules<activityFormType>>({
  name: [
    {
      required: true,
      message: "Please input an activity name",
      trigger: "blur",
    },
  ],
  orgName: [
    {
      required: true,
      message: "Please select an organization",
      trigger: "blur",
    },
  ],
});

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
  form.orgName = route.params.organizationId;
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid && form.orgName) {
      try {
        await activitiesStore.createActivity(form.name, form.orgName);
        dialogVisible.value = false;
        ElMessage({
          type: "success",
          message: "Created new activity!",
        });
        await activitiesStore.fetchActivities(route.params.organizationId);
      } catch {
        ElMessage.error("Failed to create activity!");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const options = computed<optionsType[]>(() => {
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

onMounted(async () => {
  if (!organizationStore.fetched) {
    await organizationStore.fetchOrganizations(route.params.categoryId);
  }
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Create new activity"
    append-to-body
    @close="handleClose"
  >
    <el-form :rules="rules" ref="formRef" :model="form" label-width="150px">
      <el-form-item label="Activity Name" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Organization" prop="orgName">
        <el-select-v2 v-model="form.orgName" :options="options" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)" :loading="activitiesStore.loading">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
