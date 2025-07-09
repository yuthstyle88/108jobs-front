// Flatten Role-based Routes
import {auth} from "@/auth";
import {Session} from "next-auth";

let cachedSession: Session | null = null;

export async function getCachedSession(): Promise<Session | null> {
    if (!cachedSession) {
        cachedSession = await auth(); // เรียก auth() ครั้งเดียว
    }
    return cachedSession;
}

// Reset Cached Session (Optional ฟังก์ชันสำหรับเคลียร์ Cache เช่นหลังจาก Logout)
export function resetCachedSession(): void {
    cachedSession = null;
}