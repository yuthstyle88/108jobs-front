import { auth } from "@/auth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SessionUserProvider } from "@/contexts/SessionContext";
import { Kanit } from "next/font/google";
import { Toaster } from "sonner";
import FontAwesomeConfig from "../fontawesome";
import "../globals.css";
import { Providers } from "../providers";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Google Font setup
const kanit = Kanit({
  subsets: ["latin", "vietnamese", "thai"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const VALID_LANGS = ["th", "en", "vi"];

/** ✅ generateMetadata cần `params` là Promise<{ lang: string }> để khớp compiler */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return generateLocalizedMetadata("home", { lang });
}

/** ✅ layout cũng cần `params` là Promise để build không lỗi */
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!VALID_LANGS.includes(lang)) {
    notFound();
  }

  const session = await auth();

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <FontAwesomeConfig />
      </head>
      <body
        suppressHydrationWarning
        className={`${kanit.className} antialiased bg-white`}
      >
        <Providers session={session}>
          <Toaster richColors closeButton position="top-right" />
          <SessionUserProvider initialSession={session}>
            <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
          </SessionUserProvider>
        </Providers>
      </body>
    </html>
  );
}
