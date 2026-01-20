import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import { sha256 } from "js-sha256";
import Cookies from "js-cookie";
import axios from "axios";

type userTypes = "admin" | "agent" | "other" | null;

interface loginResponse {
  access_token: string;
  expired_at: string;
}

interface userData {
  id: string | null;
  name: string | null;
  email: string | null;
  role: userTypes | null;
  surname: string | null;
  created_at: string | null;
  email_verified: boolean | null;
  language: string | null;
}

export const useAuthStore = defineStore("auth", () => {
  const hash = sha256.create();

  const token = ref<string | null>(null);
  const loading = ref<boolean>(true);

  const noUser: userData = {
    id: null,
    name: null,
    email: null,
    role: null,
    surname: null,
    created_at: null,
    email_verified: null,
    language: null,
  };

  const userData = reactive<userData>(noUser);

  const isAuthenticated = computed<boolean>(() => !!userData.role);

  async function initAuth() {
    const savedToken = Cookies.get("token");
    if (savedToken) {
      loading.value = true;
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

        Object.assign(userData, userDataResponse.data);
      } catch (error) {
        console.error("Failed to fetch user data during initAuth:", error);
        token.value = null;
        Object.assign(userData, noUser);
        Cookies.remove("token");
      } finally {
        loading.value = false;
      }
    }
  }

  async function loginUser(email: string, password: string) {
    try {
      loading.value = true;
      hash.update(password);

      const response = await axios.post<loginResponse>("https://crm.humaid.co/api/auth/login", {
        email,
        password: hash.hex(),
      });

      token.value = response.data.access_token;
      const userResponseData = await axios.get<userData>(
        "https://crm.humaid.co/api/auth/get-user",
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      Object.assign(userData, userResponseData.data);
      Cookies.set("token", token.value);

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Failed to login");
    } finally {
      loading.value = false;
    }
  }

  function signOutUser() {
    Object.assign(userData, noUser);
    Cookies.remove("token");
  }

return {
    isAuthenticated,
    userData,
    token,
    loading,
    signOutUser,
    loginUser,
    initAuth,
  };
});
