import { testHost } from "@/config";
import { isBrowser } from "@/utils/browser";


export default function getExternalHost(): string {
  /* 1. safe-guard เมื่ออยู่บน browser */
  if (isBrowser()) {
    const host = (window as any).isoData?.lemmy_external_host;
    if (host) return host;
  }

  /* 2. SSR หรือยังไม่มี isoData → ดึงจาก ENV หรือ fallback */
  return process.env.NEXT_PUBLIC_API_BASE_URL_V3 ?? testHost;
}