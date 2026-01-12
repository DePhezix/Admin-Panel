<script setup lang="ts">
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";

const dialogVisible = defineModel();

interface formType {
  name: string;
  categoryName: string;
}

const tempCategory: { [key: number]: string } = {
  1: "Medical",
  2: "Engineering",
};

const formRef = ref<FormInstance>();
const form = reactive<formType>({
  categoryName: "",
  name: "",
});

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields(); 
};

const rules = reactive<FormRules<formType>>({
  name: [
    {
      required: true,
      message: "Please input an organization name",
      trigger: "blur",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      dialogVisible.value = false
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Create new work session" :append-to-body="true">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="Organization Name" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Category">
        <el-select v-model="form.categoryName">
          <el-option
            v-for="(item, index) in Object.values(tempCategory)"
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
