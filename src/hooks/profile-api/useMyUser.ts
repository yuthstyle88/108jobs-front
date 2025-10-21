import {REQUEST_STATE} from "@/services/HttpService";
import {getIsoData} from "@/hooks/useIsoData";

/**
 * Custom Hook สำหรับดึง MyUserInfo จาก isoData
 */
export const useMyUser = () => {
    const isoData = getIsoData();
    const user = isoData?.myUserInfo;
    const profileState = user ? REQUEST_STATE.SUCCESS : REQUEST_STATE.FAILED;
    return {
        profileState,
        person: user?.localUserView.person,
        localUser: user?.localUserView.localUser,
        contact: user?.profile?.contact || null,
        address: user?.profile?.address || null,
        card: user?.profile?.identityCard || null,
        wallet: user?.wallet || null,
    };
};