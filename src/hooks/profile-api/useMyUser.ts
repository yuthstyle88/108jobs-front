import {IsoData} from "@/utils/types";
import {isBrowser} from "@/utils/browser";
import {MyUserInfo} from "lemmy-js-client";
import {REQUEST_STATE} from "@/services/HttpService";

/**
 * ดึง IsoData จาก window (เฉพาะฝั่งเบราว์เซอร์เท่านั้น)
 * หากรันบน SSR ให้คืนค่า null
 */
function getIsoData(): IsoData | null {
  if (isBrowser() && (window as any).isoData) {
    return (window as any).isoData as IsoData;
  }
  return null;
}

/**
 * Custom Hook สำหรับดึง MyUserInfo จาก isoData
 */
export const useMyUser = () => {
  const isoData = getIsoData();
  const user: MyUserInfo = isoData?.myUserInfo!;
  const profileState = REQUEST_STATE.SUCCESS;
  return {
    profileState,
    person: user?.localUserView?.person!,
    localUser: user?.localUserView?.localUser!,
    contact: user?.profile?.contact || null,
    address: user?.profile?.address || null,
    card: user?.profile?.card || null,
    coin: user?.profile?.coin || null,
  };
};