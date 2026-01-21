<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { EditPen, Delete } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

import { useStaffStore } from "@/stores/staff";
import { useOrganizationsStore } from "@/stores/organizations";
import { useStaffActivityStore } from "@/stores/staffActivity";

const props = defineProps({
  staff_activity_id: String,
  activity_id: String,
});

interface formType {
  workerName: string | string[];
  activityName: string;
  orgName: string | string[];
}

const route = useRoute();

const staffStore = useStaffStore();
const organizationStore = useOrganizationsStore();
const staffActivityStore = useStaffActivityStore();

const editOpen = ref<boolean>(false);
const activityName: string | undefined = "";

const form = reactive<formType>({
  workerName: route.params.staffId ?? "",
  activityName: activityName ?? "",
  orgName: route.params.organizationId ?? "",
});

const resetForm = () => {
  form.workerName = route.params.staffId ?? "";
  form.activityName = activityName ?? "";
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
          
          await staffActivityStore.fetchStaffActivity(route.params.organizationId, route.params.staffId)
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
</script>

<template>
  <el-button-group direction="horizontal">
    <el-button :icon="EditPen" @click="handleEdit" />
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
        <el-select v-model="form.activityName">
          <!--           <el-option
            v-for="(item, index) "
            :key="index"
            :label="item"
            :value="item"
          /> -->
        </el-select>
      </el-form-item>
      <el-form-item label="Assigned to">
        <el-select v-model="form.workerName">
          <el-option
            v-for="(item, index) in staffStore.staff"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
