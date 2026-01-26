<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { EditPen, Delete } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

import { useStaffStore } from "@/stores/staff";
import { useOrganizationsStore } from "@/stores/organizations";
import { useStaffActivityStore } from "@/stores/staffActivity";
import { useActivitiesStore } from "@/stores/activities";

import type { optionsType } from "@/types/front/generalTypes";
import type { staffActivityFormType } from "@/types/front/staffActivityTypes";

const props = defineProps({
  staff_activity_id: String,
  activity_id: String,
  activity_name: String,
});

const route = useRoute();

const staffStore = useStaffStore();
const organizationStore = useOrganizationsStore();
const staffActivityStore = useStaffActivityStore();
const activitiesStore = useActivitiesStore();

const editOpen = ref<boolean>(false);

const form = reactive<staffActivityFormType>({
  workerName: route.params.staffId ?? "",
  activityName: props.activity_name ?? "",
  orgName: route.params.organizationId ?? "",
});

const resetForm = () => {
  form.workerName = route.params.staffId ?? "";
  form.activityName = props.activity_name ?? "";
  form.orgName = route.params.organizationId ?? "";
};

const handleClose = () => {
  editOpen.value = false;
  resetForm();
};

const handleEditOpen = (event: Event) => {
  event.stopPropagation();
  editOpen.value = true;
};

const deleteStaffActivity = () => {
  ElMessageBox.confirm(
    `You are attempting to delete staff activity #${props.staff_activity_id}. Continue?`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      if (props.staff_activity_id) {
        try {
          await staffActivityStore.deleteStaffActivity(props.staff_activity_id);

          ElMessage({
            type: "success",
            message: "Delete completed",
          });

          await staffActivityStore.fetchStaffActivity(
            route.params.organizationId,
            route.params.staffId
          );
        } catch {
          ElMessage.error("Failed to delete staff activity");
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

const handleEditConfirm = async () => {
  if (props.staff_activity_id) {
    try {
      await staffActivityStore.updateStaffActivity(
        props.staff_activity_id,
        form.activityName,
        form.workerName,
        form.orgName
      );
      editOpen.value = false;
      ElMessage({
        type: "success",
        message: "Updated Staff Activity",
      });

      await staffActivityStore.fetchStaffActivity(
        route.params.organizationId,
        route.params.staffId
      );
    } catch {
      ElMessage.error("Failed to update staff activity");
    }
  } else {
    editOpen.value = false;
  }
};

const organizationOptions = computed<optionsType[]>(() => {
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

const staffOptions = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];
  staffStore.staff.forEach((st) => {
    const option: optionsType = {
      label: "",
      value: "",
    };
    option.label = st.name + " " + st.surname;
    option.value = st.id;

    tempOptions.push(option);
  });

  return tempOptions;
});

const activityOptions = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];
  activitiesStore.activities.forEach((activity) => {
    const option: optionsType = {
      label: "",
      value: "",
    };
    option.label = activity.name;
    option.value = activity.id;

    tempOptions.push(option);
  });

  return tempOptions;
});
</script>

<template>
  <el-button-group direction="horizontal">
    <el-button :icon="EditPen" @click="handleEditOpen" />
    <el-button :icon="Delete" type="danger" @click="deleteStaffActivity" />
  </el-button-group>
  <el-dialog v-model="editOpen" title="Edit Staff Activity" @close="handleClose" append-to-body>
    <el-form :model="form" label-width="150px">
      <el-form-item label="Staff Activity ID">
        <el-input :value="staff_activity_id" disabled>
          <template #prefix>#</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Activity">
        <el-select-v2 v-model="form.activityName" :options="activityOptions" />
      </el-form-item>
      <el-form-item label="Assigned to">
        <el-select-v2 v-model="form.workerName" :options="staffOptions" />
      </el-form-item>
      <el-form-item label="Organization">
        <el-select-v2 v-model="form.orgName" :options="organizationOptions" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleEditConfirm" :loading="staffActivityStore.loading">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
