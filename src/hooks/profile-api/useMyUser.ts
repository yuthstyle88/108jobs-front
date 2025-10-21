import {REQUEST_STATE} from "@/services/HttpService";
import {getIsoData} from "@/hooks/useIsoData";
import {useEffect, useState} from "react";

/**
 * Custom Hook สำหรับดึง MyUserInfo จาก isoData
 * แก้ปัญหา SSR / Hydration: ระหว่าง SSR จะได้ค่า null และในบางกรณี isoData อาจถูกเติมช้าหลัง mount
 * จึงต้องอัปเดตหลัง mount และรอจนกว่า myUserInfo จะพร้อม
 */
export const useMyUser = () => {
    const [user, setUser] = useState(() => getIsoData()?.myUserInfo ?? null);

    useEffect(() => {
        // อัปเดตหนึ่งครั้งหลัง hydration
        setUser(getIsoData()?.myUserInfo ?? null);

        // ถ้า myUserInfo ยังไม่มา ให้พยายามตรวจซ้ำช่วงสั้น ๆ แล้วหยุดเมื่อพบหรือครบกำหนดเวลา
        if (!getIsoData()?.myUserInfo) {
            const started = Date.now();
            const interval = setInterval(() => {
                const current = getIsoData()?.myUserInfo ?? null;
                if (current) {
                    setUser(current);
                    clearInterval(interval);
                } else if (Date.now() - started > 5000) {
                    // ยุติหลัง 5 วินาทีเพื่อไม่ให้วิ่งตลอด
                    clearInterval(interval);
                }
            }, 250);
            return () => clearInterval(interval);
        }
    }, []);

    const profileState = user ? REQUEST_STATE.SUCCESS : REQUEST_STATE.FAILED;
    return {
        profileState,
        person: user?.localUserView?.person ?? null,
        localUser: user?.localUserView?.localUser ?? null,
        contact: user?.profile?.contact ?? null,
        address: user?.profile?.address ?? null,
        card: user?.profile?.identityCard ?? null,
        wallet: user?.wallet ?? null,
    };
};