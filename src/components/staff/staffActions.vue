<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

import { useOrganizationsStore } from "@/stores/organizations";

const props = defineProps({
  worker_id: String,
  name: String,
  surname: String,
});

interface formType {
  workerName: string;
  workerSurname: string;
  orgName: string | undefined;
}

const route = useRoute()
const organizationStore = useOrganizationsStore()
const orgName = route.query.organization ? organizationStore.findOrganization(route.query.organization)?.name : ""

const editOpen = ref<boolean>(false);
const form = reactive<formType>({
  workerName: props.name ?? "",
  workerSurname: props.surname ?? "",
  orgName: orgName ,
});

const resetForm = () => {
  form.workerName = props.name ?? "";
  form.workerSurname = props.surname ?? "";
  form.orgName = orgName;
};

const handleClose = () => {
  editOpen.value = false;
  resetForm();
};

const deleteStaff = (e: Event) => {
  e.stopPropagation();
  ElMessageBox.confirm(
    `You are attempting to delete staff #${props.worker_id}. Continue?`,
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
  editOpen.value = true;
};
</script>

<template>
  <el-button-group
    direction="horizontal"
  >
    <el-button :icon="EditPen" @click="handleEdit" />
    <el-button :icon="Delete" type="danger" @click="deleteStaff" />
  </el-button-group>
  <el-dialog v-model="editOpen" title="Edit Staff" :before-close="handleClose" append-to-body>
    <el-form :model="form" label-width="150px">
      <el-form-item label="Staff ID">
        <el-input :value="worker_id" disabled>
          <template #prefix>#</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Name">
        <el-input v-model="form.workerName" />
      </el-form-item>
      <el-form-item label="Surname">
        <el-input v-model="form.workerSurname" />
      </el-form-item>
      <el-form-item label="Organization">
        <el-select v-model="form.orgName">
          <el-option
            v-for="(item, index) in organizationStore.organizations"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="editOpen = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>
