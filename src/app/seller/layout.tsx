import SellerHeader from "@/components/SellerHeader";
import SellerSidebar from "@/components/SellerSidebar";
import { defaultMetadata } from "@/config/metadata";
import SpSellerHeader from "@/containers/SpHeaderSeller";
import { ReactNode } from "react";

interface StartSellingLayoutProps {
  children: ReactNode;
}

export default function StartSellingLayout({
  children,
}: StartSellingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      <div className="hidden md:block">
        <SellerSidebar />
      </div>
      <div className="flex-1">
        <div className="hidden md:block">
          <SellerHeader />
        </div>
        <div className="block md:hidden">
          <SpSellerHeader />
        </div>
        <div className="p-0 md:p-8">
          <div className="rounded-lg p-0 md:p-6 pt-[4.5rem] md:pt-0">{children}</div>
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
