import {IsoData} from "@/utils/types";
import {isBrowser} from "@/utils/browser";
import {REQUEST_STATE} from "@/services/HttpService";
import {assertExists} from "@/utils/helpers";

/**
 * ดึง IsoData จาก window (เฉพาะฝั่งเบราว์เซอร์เท่านั้น)
 * หากรันบน SSR ให้คืนค่า null
 */
function getIsoData(): IsoData | null {
  if (isBrowser() && typeof window !== "undefined" && "isoData" in window) {
    return (window as { isoData: IsoData }).isoData;
  }
  return null;
}

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
    coin: user?.profile?.coin || null,
  };
};