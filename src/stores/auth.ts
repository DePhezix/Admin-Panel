import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Cookies from "js-cookie";

type userTypes = "admin" | "agent" | "other" | null;

export const useAuthStore = defineStore("auth", () => {
  const userRole = ref<userTypes>((Cookies.get("role") as userTypes) || null);

  const isAuthenticated = computed<boolean>(() => !!userRole.value);

  function setUserRole(updatedRole: userTypes) {
    userRole.value = updatedRole;
    if (updatedRole) {
      Cookies.set("role", updatedRole, { expires: 7 });
    }
  }

  function signOutUser() {
    userRole.value = null
    Cookies.remove("role")
  }

  return {
    isAuthenticated,
    userRole,
    setUserRole,
    signOutUser
  };
});
