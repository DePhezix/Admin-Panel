<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import type { FormInstance, FormRules } from "element-plus";
import { Lock, Message } from "@element-plus/icons-vue";

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
  userType: "admin",
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
  await formEl.validate(async (valid) => {
    if (valid) {
      const response = await authStore.loginUser(form.email, form.password);
      if (response.access_token) {
        console.log(response)
        router.replace({ name: "dashboard" });
      }
    }
  });
};
</script>

<template>
  <el-main class="w-full h-screen flex! justify-center pt-[10%]!">
    <el-card shadow="hover" class="h-min">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 style="font-weight: 600">LOGIN</h1>
          <p>login to your account</p>
        </div>
      </template>
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
          <el-input
            v-model="form.email"
            placeholder="Enter Email"
            class="h-[40px]"
            type="email"
            :prefix-icon="Message"
          />
        </el-form-item>
        <el-form-item label="Password:" prop="password">
          <el-input
            v-model="form.password"
            placeholder="Enter Password"
            class="h-[40px]"
            type="password"
            show-password
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-button type="primary" class="!h-[40px]" @click="submitForm(formRef)">Login</el-button>
      </el-form>
    </el-card>
  </el-main>
</template>
