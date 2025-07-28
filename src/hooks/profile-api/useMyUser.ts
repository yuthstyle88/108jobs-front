import { useCallback, useMemo } from "react";
import { IsoData } from "@/utils/types";
import { isBrowser } from "@/utils/browser";
import { MyUserInfo } from "lemmy-js-client";

/**
 * ดึง IsoData จาก window (ฝั่งเบราว์เซอร์)  
 * หากรันบน SSR ให้คืน null เพราะ React-Server จะได้รับข้อมูลผ่าน props อยู่แล้ว
 */
function getIsoData(): IsoData | null {
  if (isBrowser() && (window as any).isoData) {
    return (window as any).isoData as IsoData;
  }
  return null;
}

export const useMyUser = () => {
  /* ------------------------------------------------------------------ */
  /* 1) อ่านค่า myUserInfo ที่เซิร์ฟเวอร์ส่งมาพร้อม HTML (IsoData)    */
  /* ------------------------------------------------------------------ */
  const isoData = useMemo(getIsoData, []);
  const myUserInfo: MyUserInfo | null = isoData?.myUserInfo ?? null;

  /* ------------------------------------------------------------------ */
  /* 2) เนื่องจากข้อมูลถูกอินไลน์มาพร้อม SSR แล้ว จึงไม่มีการโหลดเพิ่ม */
  /* ------------------------------------------------------------------ */
  const isLoadingProfile = false;
  const isErrorProfile = null;

  /* ------------------------------------------------------------------ */
  /* 3) สำหรับกรณีต้องการรีเฟรช สามารถยิง API ตามต้องการในภายหลัง    */
  /*    (เวอร์ชันนี้แค่ทำ no-op เพื่อให้ interface เดิมยังทำงานได้)   */
  /* ------------------------------------------------------------------ */
  const mutate = useCallback(async () => {
    /* TODO: ถ้าต้องการรีเฟรชจริง สามารถเรียก HttpService.client.getMyUser() ที่นี่ */
    console.debug("[useMyUser] mutate() ถูกเรียก แต่เวอร์ชันอ่านจาก IsoData ยังไม่รีเฟรชจาก API");
  }, []);

  return {
    /* state ถูกตัดออก เพราะไม่มี Request รอบใหม่เกิดขึ้น */
    profileState: undefined,
    profileData: myUserInfo,
    isErrorProfile,
    isLoadingProfile,
    mutate,
  };
};