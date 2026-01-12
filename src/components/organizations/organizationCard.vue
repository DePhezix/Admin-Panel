<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  name: String,
  category_id: String,
  org_id: String,
});

interface formType {
  name: string;
  categoryName: string;
}

const tempCategory: { [key: number]: string } = {
  1: "Medical",
  2: "Engineering",
};

const authStore = useAuthStore();

const editOpen = ref<boolean>(false);
const categoryName = ref<string>(tempCategory[Number(props.category_id)] ?? "");
const form = reactive<formType>({
  name: props.name ?? "",
  categoryName: categoryName.value ?? "",
});

const resetForm = () => {
  form.name = props.name ?? "";
  form.categoryName = categoryName.value ?? "";
};

const handleclose = () => {
  editOpen.value = false;
  resetForm();
};

const deleteOrganization = () => {
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
</script>

<template>
  <el-card shadow="hover" class="min-w-[350px]">
    <el-descriptions label-width="120px" :column="1" border :title="`Organization #${org_id}`">
      <el-descriptions-item>
        <template #label> Organization: </template>
        {{ name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> Category: </template>
        {{ categoryName }}
      </el-descriptions-item>
    </el-descriptions>

    <template #footer v-if="authStore.userRole === 'admin'">
      <el-button-group class="flex w-full justify-center">
        <el-button type="primary" class="w-1/2" @click="editOpen = true"> Edit </el-button>
        <el-button type="danger" class="w-1/2" plain @click="deleteOrganization">
          Delete
        </el-button>
      </el-button-group>
    </template>
  </el-card>
  <el-dialog v-model="editOpen" title="Edit Organization" :before-close="handleclose">
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
        <el-button @click="handleclose">Cancel</el-button>
        <el-button type="primary" @click="editOpen = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>
