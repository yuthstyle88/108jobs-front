import {REQUEST_STATE} from "@/services/HttpService";
import {assertExists} from "@/utils/helpers";
import {getIsoData} from "@/hooks/useIsoData";

/**
 * Custom Hook สำหรับดึง MyUserInfo จาก isoData
 */
export const useMyUser = () => {
  const isoData = getIsoData();
  const user = assertExists(isoData?.myUserInfo, "Missing myUserInfo");
  const profileState = REQUEST_STATE.SUCCESS;
  return {
    profileState,
    person: assertExists(user.localUserView.person, "Missing person"),
    localUser: assertExists(user.localUserView.localUser, "Missing localUser"),
    contact: user?.profile?.contact || null,
    address: user?.profile?.address || null,
    card: user?.profile?.identityCard || null,
    // coin: user?.profile?.coin || null,
  };
};