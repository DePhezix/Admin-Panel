<script setup lang="ts">
import { computed, onMounted, ref, reactive } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

import { useRoute } from "vue-router";
import { useOrganizationsStore } from "@/stores/organizations";
import { useStaffStore } from "@/stores/staff";

interface formType {
  workerName: string;
  workerSurname: string;
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

const formRef = ref<FormInstance>();
const form = reactive<formType>({
  workerName: "",
  workerSurname: "",
  orgName: route.params.organizationId,
});

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
  form.orgName = route.params.organizationId;
};

const rules = reactive<FormRules<formType>>({
  workerName: [
    {
      required: true,
      message: "Please input a name",
      trigger: "blur",
    },
  ],
  workerSurname: [
    {
      required: true,
      message: "Please input a surname",
      trigger: "blur",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        await staffStore.createStaff(form.workerName, form.workerSurname, form.orgName);
        ElMessage({
          type: "success",
          message: "Created new staff!",
        });

        dialogVisible.value = false;
        await staffStore.fetchStaff(route.params.organizationId);
      } catch {
        ElMessage.error("Failed to create staff!");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

onMounted(async () => {
  if (!organizationStore.fetched) {
    await organizationStore.fetchOrganizations(route.params.categoryId);
  }
});

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
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Create new staff"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-form ref="formRef" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="Name" prop="workerName">
        <el-input v-model="form.workerName" />
      </el-form-item>
      <el-form-item label="Surname" prop="workerSurname">
        <el-input v-model="form.workerSurname" />
      </el-form-item>
      <el-form-item label="Organization">
        <el-select-v2 v-model="form.orgName" :options="options" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)" :loading="staffStore.loading">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
