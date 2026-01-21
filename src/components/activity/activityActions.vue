<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { EditPen, Delete } from "@element-plus/icons-vue";
import { useOrganizationsStore } from "@/stores/organizations";
import { useActivitiesStore } from "@/stores/activities";
import { useRoute } from "vue-router";

const props = defineProps({
  name: String,
  id: String,
});

interface formType {
  name: string;
  orgName: string | string[];
}

const route = useRoute();

const organizationsStore = useOrganizationsStore();
const activitiesStore = useActivitiesStore();

const editOpen = ref<boolean>(false);
const form = reactive<formType>({
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

const handleEdit = (event: Event) => {
  event.stopPropagation();
  editOpen.value = true;
};

const deleteActivity = () => {
  ElMessageBox.confirm(
    `You are attempting to delete activity  #${props.id}. Continue?`,
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
</script>

<template>
  <el-button-group direction="horizontal">
    <el-button :icon="EditPen" @click="handleEdit" />
    <el-button :icon="Delete" type="danger" @click="deleteActivity" />
  </el-button-group>
  <el-dialog v-model="editOpen" title="Edit Activity" @close="handleClose" append-to-body>
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
        <el-select v-model="form.orgName">
          <el-option
            v-for="(item, index) in organizationsStore.organizations"
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
