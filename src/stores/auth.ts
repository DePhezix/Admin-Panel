import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Cookies from "js-cookie";
import axios from "axios";

type userTypes = "admin" | "agent" | "other" | null;

interface loginResponse {
  access_token: string;
  expired_at: string;
}

interface userData {
  id: string;
  name: string;
  email: string;
  role: userTypes;
  surname: string;
  created_at: string;
  email_verified: boolean;
  language: string;
}

export const useAuthStore = defineStore("auth", () => {
  const userRole = ref<userTypes>((Cookies.get("role") as userTypes) || null);
  const token = ref<string | null>(null);

  const isAuthenticated = computed<boolean>(() => !!userRole.value);

  async function loginUser(email: string, password: string) {
    try {
      const response = await axios.post<loginResponse>("https://crm.humaid.co/api/auth/login", {
        email,
        password,
      });

      token.value = response.data.access_token;
      const userData = await axios.get<userData>("https://crm.humaid.co/api/auth/get-user", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      setUserRole(userData.data.role);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Failed to login");
    }
  }

  function setUserRole(updatedRole: userTypes) {
    userRole.value = updatedRole;
    if (updatedRole) {
      Cookies.set("role", updatedRole, { expires: 7 });
    }
  }

  function signOutUser() {
    userRole.value = null;
    Cookies.remove("role");
  }

  return {
    isAuthenticated,
    userRole,
    setUserRole,
    signOutUser,
    loginUser,
  };
});
