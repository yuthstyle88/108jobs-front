import {
  FailedRequestState,
  SuccessRequestState,
  isFailed,
  isLoading,
  isSuccess,
} from "@/services/HttpService";

import {useHttpGet} from "@/hooks/useHttpGet";

export const useProfileData = () => {
  const {
    data: profileData,
    state: profileState,
    execute: refreshProfile,
  } = useHttpGet("getProfile");

  // ตรวจสอบสถานะของ profileState
  const isErrorProfile = isFailed(profileState)
    ? (profileState as FailedRequestState).err
    : null;

  // Helper สำหรับทำการ refresh
  const mutate = async () => {
    try {
      await refreshProfile(); // ส่ง array ที่ตรงกับ parameter
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    }
  };


  return {
    profileState,
    profileData: isSuccess(profileState)
      ? (profileState as SuccessRequestState<typeof profileData>).data
      : null,
    isErrorProfile,
    isLoadingProfile: isLoading(profileState),
    mutate,
  };

};