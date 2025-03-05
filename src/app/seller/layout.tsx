import SellerHeader from "@/components/SellerHeader";
import SellerSidebar from "@/components/SellerSidebar";
import { ReactNode } from "react";
import { defaultMetadata } from "@/config/metadata";

interface StartSellingLayoutProps {
  children: ReactNode;
}

export default function StartSellingLayout({
  children,
}: StartSellingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      <SellerSidebar />
      <div className="flex-1">
        <SellerHeader />
        <div className="p-8">
          <div className="rounded-lg p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  ...defaultMetadata,
  title: "Seller Center | Fastlance.vn",
  description:
    "ติดตามความคืบหน้าและจัดการงานอย่างมืออาชีพบน Fastlance Seller Center",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Seller Center | Fastlance.vn",
    description:
      "ติดตามความคืบหน้าและจัดการงานอย่างมืออาชีพบน Fastlance Seller Center",
  },
};
