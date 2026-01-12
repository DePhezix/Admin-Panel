<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";

interface formType {
  workerName: string;
  activityName: string;
  orgName: string;
}

const dialogVisible = defineModel();

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

const formRef = ref<FormInstance>();
const form = reactive<formType>({
  workerName: "",
  activityName: "",
  orgName: "",
});

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
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
  await formEl.validate((valid, fields) => {
    if (valid) {
      dialogVisible.value = false;
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Create new staff activity" :append-to-body="true">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="Activity" prop="activityName">
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
        <el-button type="primary" @click="submitForm(formRef)"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>
