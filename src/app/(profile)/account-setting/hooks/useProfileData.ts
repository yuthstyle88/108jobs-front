import { usePrivateFetch } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";
import { useEffect } from "react";
import { UseFormReset } from "react-hook-form";

export interface FormValues {
  display_name: string;
  username: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
}

export const useProfileData = (reset: UseFormReset<FormValues>) => {
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: isErrorProfile,
    mutate,
  } = usePrivateFetch<ProfileData>("/profile");

  useEffect(() => {
    if (profileData?.user) {
      const [year, month, day] = profileData.user.birth_date.split("-");
      reset({
        display_name: profileData.user.display_name,
        birth_day: day,
        birth_month: month,
        birth_year: year,
      });
    }
  }, [profileData, reset]);

  return {
    profileData,
    isLoadingProfile,
    isErrorProfile,
    mutate,
  };
};
