import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import FontAwesomeConfig from "./fontawesome";
import { LanguageProvider } from "@/contexts/LanguageContext";

const kanit = Kanit({
  subsets: ["latin", "vietnamese", "thai"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Fastlance.vn",
    template: "%s | fastlance.vn",
  },
  description: "Tổng hợp freelancer chất lượng hàng đầu cho doanh nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <FontAwesomeConfig />
      </head>
      <body
        suppressHydrationWarning
        className={`${kanit.className} antialiased`}
      >
         <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
