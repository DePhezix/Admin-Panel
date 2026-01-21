<script setup lang="ts">
import { onMounted, computed, ref, reactive } from "vue";
import { useOrganizationsStore } from "@/stores/organizations";
import { useCategoriesStore } from "@/stores/categories";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";

const dialogVisible = defineModel();

const organizationStore = useOrganizationsStore();
const categoriesStore = useCategoriesStore();

interface formType {
  name: string;
  categoryName: string | string[] | undefined;
}

interface optionsType {
  label: string;
  value: string;
}

const route = useRoute();

const formRef = ref<FormInstance>();
const form = reactive<formType>({
  categoryName: route.params.categoryId,
  name: "",
});
onMounted(async () => {
  if (!categoriesStore.fetched) {
    await categoriesStore.fetchCategories();
  }
});

const handleClose = () => {
  dialogVisible.value = false;
  form.categoryName = route.params.categoryId;
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
  formEl.validate(async (valid, fields) => {
    if (valid && form.name) {
      try {
        await organizationStore.createOrganization(form.name, form.categoryName);
        ElMessage({
          type: "success",
          message: "Created new organization!",
        });
        dialogVisible.value = false;
      } catch {
        ElMessage.error("Something went wrong. Organization was not created.");
      } finally {
        organizationStore.fetchOrganizations(route.params.categoryId);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const options = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];
  categoriesStore.categories.forEach((category) => {
    const option: optionsType = {
      label: "",
      value: "",
    };
    option.label = category.name;
    option.value = category.id;

    tempOptions.push(option);
  });

  return tempOptions;
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Create new work session"
    append-to-body
    @close="handleClose"
  >
    <el-form ref="formRef" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="Organization Name" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Category">
        <el-select-v2 v-model="form.categoryName" :options="options" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="submitForm(formRef)" :loading="organizationStore.loading">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
