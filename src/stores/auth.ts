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
  const userRole = ref<userTypes>(null);
  const token = ref<string | null>(null);

  const isAuthenticated = computed<boolean>(() => !!userRole.value);

  async function initAuth() {
    const savedToken = Cookies.get("token");
    if (savedToken) {
      token.value = savedToken;
      try {
        const userDataResponse = await axios.get<userData>(
          "https://crm.humaid.co/api/auth/get-user",
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          }
        );
        userRole.value = userDataResponse.data.role;
      } catch (error) {
        console.error("Failed to fetch user data during initAuth:", error);
        token.value = null;
        userRole.value = null;
        Cookies.remove("token");
      }
    }
  }

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

      userRole.value = userData.data.role;
      Cookies.set("token", token.value);

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Failed to login");
    }
  }

  function signOutUser() {
    userRole.value = null;
    Cookies.remove("role");
  }

  return {
    isAuthenticated,
    userRole,
    signOutUser,
    loginUser,
    initAuth
  };
});
