import { IsoDataProvider } from "@/contexts/IsoDataContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Kanit } from "next/font/google";
import { Toaster } from "sonner";
import FontAwesomeConfig from "./fontawesome";
import "./globals.css";
import { Providers } from "./providers";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { SWRConfig } from "swr";
import swrConfig from "@/config/swrConfig";
import fetchIsoData from "@/lib/api/fetchIsoData";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

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

  const headersList = await headers();
  const req = {
    headers: Object.fromEntries(headersList.entries()),
  } as unknown as NextRequest;

  const path = req.headers.get("x-path") || "/";
  const url = req.headers.get("x-url") || "/";

  const isoDateContext = await fetchIsoData(req, path, url);

  return (
    <html lang="th" suppressHydrationWarning>
    <head>
      <FontAwesomeConfig/>
    </head>
    <body suppressHydrationWarning className={`${kanit.className} antialiased bg-white`}>
    <IsoDataProvider value={isoDateContext ?? {
      path: "/",
      routeData: {} as any,
      siteRes: {} as any,
      lemmyExternalHost: "127.0.0.0:8532"
    }}>
      <Providers>
        <SWRConfig value={swrConfig}>
          <Toaster richColors closeButton position="top-right"/>
          <LanguageProvider initialLang="th">
            {children}
          </LanguageProvider>
        </SWRConfig>
      </Providers>
    </IsoDataProvider>
    </body>
    </html>
  );
}