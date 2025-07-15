import { LanguageProvider } from "@/contexts/LanguageContext";
import { Kanit } from "next/font/google";
import { Toaster } from "sonner";
import FontAwesomeConfig from "./fontawesome";
import "./globals.css";
import { Providers } from "./providers";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { SWRConfig } from "swr";
import swrConfig from "@/config/swrConfig";
import {jwtDecode} from "jwt-decode";
import {Session} from "next-auth";
import { JWT } from "next-auth/jwt";

const kanit = Kanit({
  subsets: ["latin", "vietnamese", "thai"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

export async function generateMetadata() {
  return generateLocalizedMetadata("home", { lang: "th" });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  function getSessionFromStorage(): Session | null {
    if (typeof window === 'undefined') {
      return null; // ป้องกันการเรียกใช้บน server-side
    }

    const temp = sessionStorage.getItem("jwt");
    if (!temp) return null;

    try {
      const decoded = jwtDecode(temp) as JWT;
      return {
        user: {
          name: decoded.name || decoded.sub || null,
          email: decoded.email || null,
          roles: decoded.roles,
          token: ""
        },
        // ค่าอื่นๆ ตาม interface Session
        accessToken: temp,
        expires: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    } catch (error) {
      console.error("Error decoding JWT:",
        error);
      return null;
    }
  }

  const session = getSessionFromStorage();

  return (
    <html lang="th" suppressHydrationWarning>
    <head>
      <FontAwesomeConfig/>
    </head>
    <body suppressHydrationWarning className={`${kanit.className} antialiased bg-white`}>
    <Providers session={session}>
      <SWRConfig value={swrConfig}>
        <Toaster richColors closeButton position="top-right"/>
        <LanguageProvider initialLang="th">
          {children}
        </LanguageProvider>
      </SWRConfig>
    </Providers>
    </body>
    </html>
  );
}