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
import {IncomingHttpHeaders} from "http";

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

  const hdr = await headers();
  const headersList: IncomingHttpHeaders = Object.fromEntries(hdr.entries());
 console.log("headersList: ", headersList);
  const path = hdr.get("x-path") || "/";
  const url  = hdr.get("x-url") || "/";
  console.log("x-path: ", path);
  const IncomingHttpHeaders: IncomingHttpHeaders = Object.fromEntries(hdr.entries());
  const isoDateContext = await fetchIsoData( path, url , IncomingHttpHeaders);
   console.log("isoDateContext: ", isoDateContext);
  return (
    <html lang="th" suppressHydrationWarning>
    <head>
      <FontAwesomeConfig/>
    </head>
    <body suppressHydrationWarning className={`${kanit.className} antialiased bg-white`}>
    <script
      dangerouslySetInnerHTML={{
        __html: `window.isoData = ${JSON.stringify(isoDateContext)};`,
      }}
    />
    <IsoDataProvider value={isoDateContext ?? {
      path: "/",
      routeData: {} as any,
      siteRes: {} as any,
      lemmyExternalHost: "localhost:8532"
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