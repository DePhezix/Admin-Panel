<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";

interface formType {
  name: string;
  orgName: string;
}

const dialogVisible = defineModel();

const tempOrg: { [key: number]: string } = {
  1: "Akfa",
  2: "CAU",
};

const formRef = ref<FormInstance>();
const form = reactive<formType>({
  name: "",
  orgName: "",
});

const rules = reactive<FormRules<formType>>({
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
};

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
  <el-dialog v-model="dialogVisible" title="Create new activity" :append-to-body="true">
    <el-form :rules="rules" ref="formRef" :model="form" label-width="150px">
      <el-form-item label="Activity Name" prop="name" >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Organization" prop="orgName">
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
