import { signOut } from "next-auth/react";

export const useLogout = () => {
  const logout = async () => {
    try {
      localStorage.removeItem("freelancerFormData");
      localStorage.removeItem("freelancerCurrentStep");

      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { logout };
};
