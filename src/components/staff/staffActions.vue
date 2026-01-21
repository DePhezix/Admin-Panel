<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Delete, EditPen } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

import { useOrganizationsStore } from "@/stores/organizations";
import { useStaffStore } from "@/stores/staff";

const props = defineProps({
  worker_id: String,
  name: String,
  surname: String,
});

interface formType {
  workerName: string | undefined;
  workerSurname: string | undefined;
  orgName: string | string[] | undefined;
}

interface optionsType {
  label: string;
  value: string;
}

const route = useRoute();
const staffStore = useStaffStore();
const organizationStore = useOrganizationsStore();

const editOpen = ref<boolean>(false);
const form = reactive<formType>({
  workerName: props.name ?? "",
  workerSurname: props.surname ?? "",
  orgName: route.params.organizationId,
});

const resetForm = () => {
  form.workerName = props.name ?? "";
  form.workerSurname = props.surname ?? "";
  form.orgName = route.params.organizationId;
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
    .then(async () => {
      if (props.worker_id) {
        try {
          await staffStore.deleteStaff(props.worker_id);

          ElMessage({
            type: "success",
            message: "Delete completed",
          });

          await staffStore.fetchStaff(route.params.organizationId);
        } catch {
          ElMessage.error("Deleting staff failed!");
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

const handleEditConfirm = async () => {
  if (props.worker_id) {
    try {
      await staffStore.updateStaff(
        props.worker_id,
        form.workerName,
        form.workerSurname,
        form.orgName
      );
      editOpen.value = false;
      ElMessage({
        type: "success",
        message: "Updated Staff",
      });

      await staffStore.fetchStaff(route.params.organizationId);
    } catch {
      ElMessage.error("Failed to update staff");
    }
  } else {
    editOpen.value = false;
  }
};

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
  <el-button-group direction="horizontal">
    <el-button :icon="EditPen" @click="handleEditOpen" />
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
        <el-select-v2 v-model="form.orgName" :options="options" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleEditConfirm" :loading="staffStore.loading">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
