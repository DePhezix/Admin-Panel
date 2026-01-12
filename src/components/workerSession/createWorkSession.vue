<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";

interface formType {
  workerName: string;
  activityName: string;
  equipmentName: string;
  active: boolean;
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
const tempEquipment: { [key: number]: string } = {
  1: "Lenovo Think Pad T120",
  2: "Macbook Air M3",
};

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
  <el-dialog v-model="dialogVisible" title="Create new work session" :append-to-body="true">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="Staff Name" prop="workerName">
        <el-select v-model="form.workerName">
          <el-option
            v-for="(item, index) in Object.values(tempWork)"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
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
      <el-form-item label="Equipment" prop="equipmentName">
        <el-select v-model="form.equipmentName">
          <el-option
            v-for="(item, index) in Object.values(tempEquipment)"
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
