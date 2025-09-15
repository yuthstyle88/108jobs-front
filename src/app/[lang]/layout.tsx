import {LanguageProvider} from "@/contexts/LanguageContext";
import {getCurrentLanguage} from "@/actions/getCurrentLanguage";
import {Kanit} from "next/font/google";
import {Toaster} from "sonner";
import FontAwesomeConfig from "../fontawesome";
import "../globals.css";
import {generateLocalizedMetadata} from "@/lib/metadata";
import React from "react";
import { isoDataInitializer } from "@/utils";
import {ClientSWRProvider} from "@/components/ClientSWRProvider";
import {GlobalLoaderProvider} from "@/contexts/GlobalLoaderContext";
import {GlobalErrorProvider} from "@/contexts/GlobalErrorContext";
import GlobalError from "@/components/GlobalError";
import GlobalLoader from "@/components/Loading";
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
    return generateLocalizedMetadata("home");
}

export default async function RootLayout({
                                             children,
                                             params,
                                         }: Readonly<{
    children: React.ReactNode;
    params: any;
}>) {
    const lang = params.lang;
    const isoData = await isoDataInitializer();
    const cookieLang = await getCurrentLanguage();
    const userLang = isoData?.myUserInfo?.localUserView?.localUser?.interfaceLanguage as string | undefined;
    const initialLang = cookieLang || lang || userLang;
    return (
        <html lang={initialLang} suppressHydrationWarning>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="dns-prefetch" href="https://fonts.googleapis.com"/>
            <FontAwesomeConfig/>
        </head>
        <body suppressHydrationWarning className={`${kanit.className} antialiased bg-white`}>
        <script
            dangerouslySetInnerHTML={{
                __html: `window.isoData = ${JSON.stringify(isoData)};`,
            }}
        />
        <LanguageProvider initialLang={initialLang!}>
            <GlobalErrorProvider>
                <GlobalLoaderProvider>
                    <ClientSWRProvider>
                        <Toaster richColors closeButton position="top-right"/>
                        <GlobalError/>
                        <GlobalLoader/>
                        {children}
                    </ClientSWRProvider>
                </GlobalLoaderProvider>
            </GlobalErrorProvider>
        </LanguageProvider>
        </body>
        </html>
    );
}