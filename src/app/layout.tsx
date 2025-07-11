import { auth } from "@/auth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Kanit } from "next/font/google";
import { Toaster } from "sonner";
import FontAwesomeConfig from "./fontawesome";
import "./globals.css";
import { Providers } from "./providers";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { SWRConfig } from "swr";
import swrConfig from "@/config/swrConfig";

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

  const session = await auth();

  return (
    <html lang="th" suppressHydrationWarning>
    <head>
      <FontAwesomeConfig />
    </head>
    <body suppressHydrationWarning className={`${kanit.className} antialiased bg-white`}>
    <Providers session={session}>
        <SWRConfig value={swrConfig}>
          <Toaster richColors closeButton position="top-right" />
            <LanguageProvider initialLang="th">
              {children}
            </LanguageProvider>
        </SWRConfig>
    </Providers>
    </body>
    </html>
  );
}