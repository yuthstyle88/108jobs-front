import {ProfileData} from "@/lib/lemmy-js-client/src";
import {useHttpApi} from "@/hooks/useHttpApi";           // ← เปลี่ยนมาใช้ hook ใหม่
import {
  REQUEST_STATE,
  isSuccess,
} from "@/services/HttpService";


export const useProfileData = () => {
  const {
    state: profileState,
    execute: refreshProfile,
    isMutating: isLoadingProfile,
  } = useHttpApi("getProfile");

  const profileData: ProfileData | undefined = isSuccess(profileState)
    ? profileState.data
    : undefined;

  const isErrorProfile =
    profileState.state === REQUEST_STATE.FAILED
      ? profileState.err
      : null;

  /* ---------- helper refresh -------------------------------- */
  const mutate = async() => {
    await refreshProfile();
  };

  return {
    profileState,
    profileData,
    isLoadingProfile,
    isErrorProfile,
    mutate,
  };
};