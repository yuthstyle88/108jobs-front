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
import type { IncomingHttpHeaders } from "http";
import { IsoData, RouteData } from "@/utils/types";
import { GetSiteResponse } from "lemmy-js-client";
import { testHost } from "@/config";

// Optimize font loading with display swap and preload
const kanit = Kanit({
  subsets: ["latin", "vietnamese", "thai"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
  adjustFontFallback: true,
});

export async function generateMetadata() {
  return generateLocalizedMetadata("home", { lang: "th" });
}

/**
 * Safely serialize data to JSON, handling circular references and non-serializable values
 * @param data The data to serialize
 * @returns A JSON string representation of the data
 */
function safeJsonStringify(data: unknown): string {
  try {
    // Use a replacer function to handle circular references and non-serializable values
    const seen = new WeakSet();
    return JSON.stringify(data, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        seen.add(value);
      }
      // Handle functions, undefined, and other non-serializable values
      if (typeof value === 'function') {
        return '[Function]';
      }
      if (value === undefined) {
        return null;
      }
      return value;
    });
  } catch (error) {
    console.error('Error serializing ISO data:', error);
    return '{}';
  }
}

// Default ISO data to use as fallback
const defaultIsoData: IsoData = {
  path: "/",
  routeData: {} as RouteData,
  siteRes: {} as GetSiteResponse,
  lemmyExternalHost: testHost || "localhost:8532",
  errorPageData: undefined,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get request headers and URL
  const hdr = await headers();
  const url = hdr.get("x-url") || "/";
  const incomingHttpHeaders: IncomingHttpHeaders = Object.fromEntries(hdr.entries());
  
  // Fetch data with proper error handling
  let isoData: IsoData;
  try {
    const fetchedData = await fetchIsoData(url, incomingHttpHeaders);
    isoData = fetchedData || defaultIsoData;
  } catch (error) {
    console.error('Error fetching ISO data:', error);
    isoData = defaultIsoData;
  }

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <FontAwesomeConfig />
      </head>
      <body suppressHydrationWarning className={`${kanit.className} antialiased bg-white`}>
        {/* Provide initial data to client */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.isoData = ${safeJsonStringify(isoData)};`,
          }}
        />
        <IsoDataProvider value={isoData}>
          <Providers>
            <SWRConfig value={swrConfig}>
              <Toaster richColors closeButton position="top-right" />
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