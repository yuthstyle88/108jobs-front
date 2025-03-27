// hooks/useProfileData.ts
import { usePrivateFetch } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";

export const useBasicInfoForm = () => {
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: isErrorProfile,
    mutate,
  } = usePrivateFetch<ProfileData>("/profile");

  return {
    profileData,
    isLoadingProfile,
    isErrorProfile,
    mutate,
  };
};