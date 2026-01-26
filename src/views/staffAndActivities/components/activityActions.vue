<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { EditPen, Delete } from "@element-plus/icons-vue";
import { useOrganizationsStore } from "@/stores/organizations";
import { useActivitiesStore } from "@/stores/activities";
import { useRoute } from "vue-router";

import type { optionsType } from "@/types/front/generalTypes";
import type { activityFormType } from "@/types/front/activityTypes";

const props = defineProps({
  name: String,
  id: String,
});

const route = useRoute();

const organizationsStore = useOrganizationsStore();
const activitiesStore = useActivitiesStore();

const editOpen = ref<boolean>(false);
const form = reactive<activityFormType>({
  name: props.name ?? "",
  orgName: route.params.organizationId ?? "",
});

const resetForm = () => {
  form.name = props.name ?? "";
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

const handleEditConfirm = async () => {
  if (props.id) {
    try {
      await activitiesStore.updateActivity(props.id, form.orgName, form.name);
      editOpen.value = false;
      ElMessage({
        type: "success",
        message: "Updated Activity",
      });

      await activitiesStore.fetchActivities(route.params.organizationId);
    } catch {
      ElMessage.error("Failed to update activity");
    }
  } else {
    editOpen.value = false;
  }
};

const deleteActivity = () => {
  ElMessageBox.confirm(
    `You are attempting to delete an activity. Continue?`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      if (props.id) {
        try {
          await activitiesStore.deleteActivity(props.id);

          ElMessage({
            type: "success",
            message: "Deleted Activity",
          });

          await activitiesStore.fetchActivities(route.params.organizationId);
        } catch {
          ElMessage.error("Failed to delete activity");
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

const options = computed<optionsType[]>(() => {
  const tempOptions: optionsType[] = [];
  organizationsStore.organizations.forEach((organization) => {
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
    <el-button :icon="Delete" type="danger" @click="deleteActivity" />
  </el-button-group>
  <el-dialog v-model="editOpen" title="Edit Activity" :before-close="handleClose" append-to-body>
    <el-form :model="form" label-width="150px">
      <el-form-item label="Activity ID">
        <el-input :value="id" disabled>
          <template #prefix>#</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Activity Name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Organization">
        <el-select-v2 v-model="form.orgName" :options="options" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="primary" @click="handleEditConfirm" :loading="activitiesStore.loading"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>
