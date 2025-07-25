import { LanguageProvider } from "@/contexts/LanguageContext";
import { Kanit } from "next/font/google";
import { Toaster } from "sonner";
import FontAwesomeConfig from "./fontawesome";
import "./globals.css";
import { Providers } from "./providers";
import { generateLocalizedMetadata } from "@/lib/metadata";
import React from "react";
import isoDataInitializer from "@/utils/iso-data-Initializer";
import {ClientSWRProvider} from "@/components/ClientSWRProvider";

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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isoData = await isoDataInitializer();
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <FontAwesomeConfig />
      </head>
      <body suppressHydrationWarning className={`${kanit.className} antialiased bg-white`}>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.isoData = ${JSON.stringify(isoData)};`,
        }}
      />
      <Providers>
        <ClientSWRProvider>
          <Toaster richColors closeButton position="top-right"/>
          <LanguageProvider initialLang="th">
            {children}
          </LanguageProvider>
        </ClientSWRProvider>
      </Providers>
      </body>
    </html>
  );
}

