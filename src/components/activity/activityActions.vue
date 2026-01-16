<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import { EditPen, Delete } from "@element-plus/icons-vue";
import { useOrganizationsStore } from "@/stores/organizations";
import { useRoute } from "vue-router";

const props = defineProps({
  name: String,
  id: String,
});

interface formType {
  name: string;
  orgName: string;
}

const route = useRoute()
const authStore = useAuthStore();
const organizationsStore = useOrganizationsStore();

const editOpen = ref<boolean>(false);
const orgName: string | undefined = route.query.organization ? organizationsStore.findOrganization(route.query.organization)?.name : undefined;
const form = reactive<formType>({
  name: props.name ?? "",
  orgName: orgName ?? "",
});

const resetForm = () => {
  form.name = props.name ?? "";
  form.orgName = orgName ?? "";
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
  <el-button-group
    direction="horizontal"
    v-if="authStore.userRole === 'admin' || authStore.userRole === 'agent'"
  >
    <el-button :icon="EditPen" @click="handleEdit" />
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
