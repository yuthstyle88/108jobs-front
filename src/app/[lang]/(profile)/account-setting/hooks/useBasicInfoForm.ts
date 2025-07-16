import { API_ROUTES } from "@/api/endpoints";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";

export const useBasicInfoForm = () => {
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: isErrorProfile,
    mutate,
  } = usePrivateFetch<ProfileData>(API_ROUTES.profile.getProfile);

  return {
    profileData,
    isLoadingProfile,
    isErrorProfile,
    mutate,
  };
};