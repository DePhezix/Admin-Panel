<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import type { FormInstance, FormRules } from "element-plus";

interface LoginForm {
  email: string;
  password: string;
  userType: "admin" | "agent" | "other"; //temp
}

const router = useRouter();
const authStore = useAuthStore();

const formRef = ref<FormInstance>();

const form = reactive<LoginForm>({
  email: "",
  password: "",
  userType: "other",
});

const rules = reactive<FormRules<LoginForm>>({
  email: [
    {
      required: true,
      message: "Please input email address",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Please input correct email address",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "Please input password",
      trigger: "blur",
    },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      authStore.setUserRole(form.userType)
      router.replace("/categories");
    }
  });
};
</script>

<template>
  <el-main class="w-full h-screen flex! justify-center pt-[10%]!">
    <el-form
      ref="formRef"
      :rules="rules"
      :model="form"
      class="w-[400px] flex flex-col"
      scrollToError
      hide-required-asterisk
      label-position="top"
    >
      <el-form-item label="Email:" prop="email">
        <el-input v-model="form.email" placeholder="Enter Email" class="h-[30px]" type="email" />
      </el-form-item>
      <el-form-item label="Password:" prop="password">
        <el-input
          v-model="form.password"
          placeholder="Enter Password"
          class="h-[30px]"
          type="password"
          show-password
        />
      </el-form-item>
      <el-radio-group v-model="form.userType">
        <el-radio value="admin">Admin</el-radio>
        <el-radio value="agent">Agent</el-radio>
        <el-radio value="other">Other</el-radio>
      </el-radio-group>
      <el-button @click="submitForm(formRef)">Login</el-button>
    </el-form>
  </el-main>
</template>
