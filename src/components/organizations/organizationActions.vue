<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, EditPen } from "@element-plus/icons-vue";

import { useRoute } from "vue-router";
import { useCategoriesStore } from "@/stores/categories";

const props = defineProps({
  name: String,
  org_id: String,
});

interface formType {
  name: string;
  categoryName: string;
}

const route = useRoute();
const categoriesStores = useCategoriesStore();

const currentCategory = route.params.categoryId
  ? categoriesStores.findCategory(route.params.categoryId)?.name
  : undefined;

const editOpen = ref<boolean>(false);

const form = reactive<formType>({
  name: props.name ?? "",
  categoryName: currentCategory ?? "",
});

const resetForm = () => {
  form.name = props.name ?? "";
  form.categoryName = currentCategory ?? "";
};

const handleclose = () => {
  editOpen.value = false;
  resetForm();
};

const deleteOrganization = (e: Event) => {
  e.stopPropagation()
  ElMessageBox.confirm(
    `You are attempting to delete organization  #${props.org_id}. Continue?`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
      ElMessage({
        type: "success",
        message: "Delete completed",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};

const handleEdit = (event: Event) => {
  event.stopPropagation();
  editOpen.value = true
}
</script>

<template>
  <el-button-group direction="horizontal">
    <el-button :icon="EditPen" @click="handleEdit" />
    <el-button :icon="Delete" type="danger" @click="deleteOrganization" />
  </el-button-group>
  <el-dialog v-model="editOpen" title="Edit Organization" :before-close="handleclose" append-to-body>
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
        <el-select v-model="form.categoryName">
          <el-option
            v-for="(item, index) in categoriesStores.categories"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleclose">Cancel</el-button>
        <el-button type="primary" @click="editOpen = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>
