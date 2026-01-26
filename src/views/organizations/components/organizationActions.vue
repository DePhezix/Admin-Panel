<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, EditPen } from "@element-plus/icons-vue";

import { useRoute } from "vue-router";
import { useCategoriesStore } from "@/stores/categories";
import { useOrganizationsStore } from "@/stores/organizations";

import type { optionsType } from "@/types/front/generalTypes";
import type { organizationFormType } from "@/types/front/organizationTypes";

const props = defineProps({
  name: String,
  org_id: String,
});

const route = useRoute();
const categoriesStores = useCategoriesStore();
const organizationStore = useOrganizationsStore();

const editOpen = ref<boolean>(false);

const form = reactive<organizationFormType>({
  name: props.name ?? "",
  categoryName: route.params.categoryId,
});

const resetForm = () => {
  form.name = props.name ?? "";
  form.categoryName = route.params.categoryId;
};

const handleclose = () => {
  editOpen.value = false;
  resetForm();
};

const deleteOrganization = async (e: Event) => {
  e.stopPropagation();
  ElMessageBox.confirm(
    `You are attempting to delete organization  #${props.org_id}. Continue?`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    },
  )
    .then(async () => {
      if (props.org_id) {
        try {
          await organizationStore.deleteOrganization(props.org_id);
          ElMessage({
            type: "success",
            message: "Delete completed!",
          });
          await organizationStore.fetchOrganizations(route.params.categoryId);
        } catch {
          ElMessage.error("Delete failed!");
        }
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};

const handleEditOpen = (event: Event) => {
  event.stopPropagation();
  editOpen.value = true;
};

const options = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];
  categoriesStores.categories.forEach((category) => {
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

const handleEditConfirm = async () => {
  if (props.org_id) {
    try {
      await organizationStore.updateOrganization(props.org_id, form.categoryName, form.name);
      editOpen.value = false;
      ElMessage({
        type: "success",
        message: "Updated Organization",
      });

      await organizationStore.fetchOrganizations(route.params.categoryId);
    } catch {
      ElMessage.error("Failed to update organization");
    }
  } else {
    editOpen.value = false;
  }
};
</script>

<template>
  <el-button-group direction="horizontal">
    <el-button :icon="EditPen" @click="handleEditOpen" />
    <el-button :icon="Delete" type="danger" @click="deleteOrganization" />
  </el-button-group>
  <el-dialog
    v-model="editOpen"
    title="Edit Organization"
    :before-close="handleclose"
    append-to-body
  >
    <el-form :model="form" label-width="150px">
      <el-form-item label="Organization ID">
        <el-input :value="org_id" disabled>
          <template #prefix>#</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Organization Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Category">
        <el-select-v2 v-model="form.categoryName" :options="options" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleclose">Cancel</el-button>
        <el-button type="primary" @click="handleEditConfirm" :loading="organizationStore.loading">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
